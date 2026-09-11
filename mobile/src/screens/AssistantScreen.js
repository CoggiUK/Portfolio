import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ActivityIndicator, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  Screen, Header, Card, Row, Chip, Badge, Btn, Banner, IconBtn,
} from '../components/ui';
import { colors, space, radius, font, tint, shadows } from '../theme';
import { useApp } from '../contexts/AppContext';
import { subscribeMessages, saveMessage, askAssistant } from '../services/assistant';
import { toDate, fmtTime, dayKey, isSameDay } from '../utils/date';

const QUICK_SUGGESTIONS = [
  'Tóm tắt hôm nay',
  'Việc nào quá hạn?',
  'Liên hệ chưa đọc?',
  'Thêm việc mới...',
  'Thống kê chi tiêu tháng này',
];

export default function AssistantScreen() {
  const {
    uid, events, tasks, notes, habits, transactions, leads, unreadLeads,
    saveEvent, create, api, notify,
  } = useApp();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);
  const flatListRef = useRef(null);

  // Lắng nghe tin nhắn realtime từ Firestore
  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeMessages(uid, (msgs) => {
      setMessages(msgs);
    });
    return () => unsub?.();
  }, [uid]);

  // Chuẩn bị context hiện tại gửi cho Gemini
  const assistantContext = useMemo(() => {
    const now = new Date();
    const todayKey = dayKey(now);

    const todayEvents = events
      .filter((e) => {
        const s = toDate(e.start);
        return s && isSameDay(s, now);
      })
      .map((e) => ({
        title: e.title,
        time: fmtTime(toDate(e.start)),
        location: e.location || '',
      }));

    const overdueTasks = tasks
      .filter((t) => !t.done && t.due && toDate(t.due) < now)
      .map((t) => ({ title: t.title, priority: t.priority }));

    const pendingTasks = tasks
      .filter((t) => !t.done)
      .slice(0, 10)
      .map((t) => ({ title: t.title, due: t.due }));

    const unreadLeadList = leads
      .filter((l) => !l.read)
      .slice(0, 5)
      .map((l) => ({ name: l.name, email: l.email, message: (l.message || '').slice(0, 80) }));

    const todayHabits = habits.map((h) => ({
      title: h.title,
      doneToday: !!h.history?.[todayKey],
    }));

    const curMonth = now.getMonth();
    const curYear = now.getFullYear();
    let monthIncome = 0;
    let monthExpense = 0;
    transactions.forEach((tx) => {
      const d = toDate(tx.date || tx.createdAt);
      if (d && d.getMonth() === curMonth && d.getFullYear() === curYear) {
        if (tx.type === 'in') monthIncome += Number(tx.amount || 0);
        else monthExpense += Number(tx.amount || 0);
      }
    });

    return {
      currentTime: now.toLocaleString('vi-VN'),
      todaySummary: `${todayEvents.length} lịch hôm nay, ${overdueTasks.length} việc quá hạn, ${unreadLeads} liên hệ mới`,
      todayEventsCount: todayEvents.length,
      todayEvents,
      overdueTasksCount: overdueTasks.length,
      overdueTasks,
      pendingTasks,
      unreadLeadsCount: unreadLeads,
      unreadLeads: unreadLeadList,
      todayHabits,
      monthIncome,
      monthExpense,
    };
  }, [events, tasks, leads, unreadLeads, habits, transactions]);

  // Thực thi hành động do AI đề xuất
  const executeAction = useCallback(
    async (action) => {
      if (!action || !action.name) return null;
      const { name, input = {} } = action;

      try {
        switch (name) {
          case 'create_event': {
            const startDate = input.start ? new Date(input.start) : new Date();
            const endDate = input.end ? new Date(input.end) : new Date(startDate.getTime() + 3600000);
            await saveEvent({
              title: input.title || 'Lịch mới',
              start: startDate,
              end: endDate,
              location: input.location || '',
              description: input.notes || '',
              color: 'cyan',
              reminders: [15],
            });
            notify(`Đã tạo lịch: ${input.title}`, 'success');
            return { executed: true, summary: `Đã thêm lịch "${input.title}"` };
          }
          case 'create_task': {
            const dueDate = input.due ? new Date(input.due) : null;
            await create('tasks', {
              title: input.title || 'Công việc mới',
              due: dueDate,
              priority: input.priority || 'normal',
              done: false,
            });
            notify(`Đã thêm việc: ${input.title}`, 'success');
            return { executed: true, summary: `Đã thêm việc "${input.title}"` };
          }
          case 'create_note': {
            await create('notes', {
              title: input.title || 'Ghi chú mới',
              body: input.body || '',
              tags: Array.isArray(input.tags) ? input.tags : [],
            });
            notify(`Đã tạo ghi chú: ${input.title}`, 'success');
            return { executed: true, summary: `Đã lưu ghi chú "${input.title}"` };
          }
          case 'create_transaction': {
            await create('transactions', {
              type: input.type === 'in' ? 'in' : 'out',
              amount: Number(input.amount || 0),
              category: input.category || 'Khác',
              note: input.note || '',
              date: new Date(),
            });
            notify(`Đã ghi giao dịch: ${input.category}`, 'success');
            return { executed: true, summary: `Đã ghi nhận ${input.type === 'in' ? 'thu' : 'chi'} ${input.amount?.toLocaleString?.('vi-VN')}đ` };
          }
          case 'toggle_habit': {
            const normalizedTitle = (input.title || '').trim().toLowerCase();
            const habit = habits.find((h) => (h.title || '').trim().toLowerCase().includes(normalizedTitle));
            if (habit) {
              const today = dayKey(new Date());
              await api.toggleHabitDay(uid, habit, today);
              notify(`Đã cập nhật thói quen: ${habit.title}`, 'success');
              return { executed: true, summary: `Đã điểm danh "${habit.title}"` };
            }
            return { executed: false, summary: `Không tìm thấy thói quen "${input.title}"` };
          }
          case 'draft_lead_reply': {
            // Không ghi Firestore, giữ lại cho hiển thị nút mở Mail
            return { executed: true, summary: `Email nháp cho ${input.leadName || 'khách hàng'}` };
          }
          default:
            return null;
        }
      } catch (err) {
        console.warn('[assistant action error]', err);
        return { executed: false, error: err.message };
      }
    },
    [saveEvent, create, api, uid, habits, notify]
  );

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    setInputText('');
    setErrorBanner(null);
    Haptics.selectionAsync().catch(() => {});

    try {
      // Lưu tin nhắn user
      await saveMessage(uid, { role: 'user', text });

      setLoading(true);

      // Lấy lịch sử 20 tin gần nhất
      const history = messages.slice(-20).map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        text: m.text,
      }));

      // Gọi Gemini Cloud Function
      const res = await askAssistant({
        message: text,
        history,
        context: assistantContext,
      });

      let actionRecord = null;
      if (res.action) {
        const actionResult = await executeAction(res.action);
        actionRecord = {
          ...res.action,
          result: actionResult,
        };
      }

      // Lưu câu trả lời của AI
      await saveMessage(uid, {
        role: 'assistant',
        text: res.reply || 'Đã hoàn thành.',
        action: actionRecord,
      });
    } catch (err) {
      console.warn('[handleSend assistant]', err);
      setErrorBanner(err.message || 'Không thể kết nối với Trợ lý AI. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleMailto = (actionInput) => {
    const email = actionInput.email || '';
    const subject = encodeURIComponent('Phản hồi liên hệ từ Tùng Lâm');
    const body = encodeURIComponent(actionInput.replyText || '');
    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`).catch(() => {
      notify('Không thể mở ứng dụng gửi mail', 'error');
    });
  };

  return (
    <Screen edges={['top']}>
      <Header
        title="Trợ lý AI"
        subtitle="Thông minh · Tiết kiệm thời gian"
        badge="GEMINI"
      />

      {errorBanner ? (
        <View style={{ paddingHorizontal: space[4], marginBottom: space[2] }}>
          <Banner
            type="error"
            message={errorBanner}
            onClose={() => setErrorBanner(null)}
          />
        </View>
      ) : null}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.id || String(index)}
          contentContainerStyle={s.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={s.emptyWrap}>
              <View style={s.welcomeCard}>
                <View style={s.aiAvatar}>
                  <Ionicons name="sparkles" size={28} color={colors.primary} />
                </View>
                <Text style={[font.h2, { color: colors.text, textAlign: 'center', marginTop: space[3] }]}>
                  Xin chào Tùng Lâm!
                </Text>
                <Text style={[font.body, { color: colors.textSub, textAlign: 'center', marginTop: space[1], lineHeight: 22 }]}>
                  Tôi là trợ lý AI đồng hành của bạn. Tôi có thể tóm tắt lịch trình hôm nay, lọc việc quá hạn, ghi chú nhanh hoặc tạo lịch chỉ bằng một câu nói.
                </Text>
              </View>

              <Text style={[font.tiny, s.sectionLabel]}>GỢI Ý NHANH</Text>
              <View style={s.suggestionGrid}>
                {QUICK_SUGGESTIONS.map((sug, i) => (
                  <Chip
                    key={i}
                    label={sug}
                    icon="chatbubble-ellipses-outline"
                    onPress={() => handleSend(sug)}
                  />
                ))}
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const isUser = item.role === 'user';
            return (
              <View style={[s.msgRow, isUser ? s.msgRowUser : s.msgRowAssistant]}>
                {!isUser ? (
                  <View style={s.miniAvatar}>
                    <Ionicons name="sparkles" size={14} color={colors.primary} />
                  </View>
                ) : null}

                <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleAssistant]}>
                  <Text style={[font.body, isUser ? s.bubbleTextUser : s.bubbleTextAssistant]}>
                    {item.text}
                  </Text>

                  {/* Hiển thị thẻ hành động nếu có */}
                  {item.action ? (
                    <View style={s.actionCard}>
                      <Row style={{ justifyContent: 'space-between' }}>
                        <Badge
                          label={item.action.name.toUpperCase().replace(/_/g, ' ')}
                          color={colors.primary}
                          dot
                        />
                        {item.action.result?.executed ? (
                          <Text style={[font.tiny, { color: colors.primary, fontWeight: '700' }]}>
                            ✓ ĐÃ THỰC HIỆN
                          </Text>
                        ) : null}
                      </Row>

                      {item.action.result?.summary ? (
                        <Text style={[font.tiny, { color: colors.textSub, marginTop: 4 }]}>
                          {item.action.result.summary}
                        </Text>
                      ) : null}

                      {item.action.name === 'draft_lead_reply' ? (
                        <Btn
                          title="Mở Mail gửi phản hồi"
                          icon="mail-outline"
                          variant="secondary"
                          small
                          style={{ marginTop: space[2] }}
                          onPress={() => handleMailto(item.action.input)}
                        />
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </View>
            );
          }}
        />

        {loading ? (
          <Row style={s.loadingRow} gap={space[2]}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[font.tiny, { color: colors.textMuted, fontWeight: '600' }]}>
              Trợ lý đang xử lý và phân tích...
            </Text>
          </Row>
        ) : null}

        {/* Khung nhập tin nhắn */}
        <View style={s.inputBar}>
          <TextInput
            style={s.input}
            placeholder="Hỏi trợ lý hoặc nhờ tạo việc, lịch..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
            multiline={false}
          />
          <Pressable
            onPress={() => handleSend()}
            disabled={!inputText.trim() || loading}
            style={({ pressed }) => [
              s.sendBtn,
              !inputText.trim() && { opacity: 0.4 },
              pressed && { transform: [{ scale: 0.92 }] },
            ]}
          >
            <Ionicons name="send" size={17} color={colors.onPrimary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const s = StyleSheet.create({
  chatList: {
    padding: space[4],
    paddingBottom: space[4],
  },
  emptyWrap: {
    paddingVertical: space[4],
    alignItems: 'center',
  },
  welcomeCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space[5],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space[5],
    ...shadows.card,
  },
  aiAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primarySurface,
    borderColor: colors.primaryBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: space[2],
    alignSelf: 'flex-start',
  },
  suggestionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
    width: '100%',
  },
  msgRow: {
    flexDirection: 'row',
    marginVertical: space[1] + 2,
    alignItems: 'flex-end',
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowAssistant: {
    justifyContent: 'flex-start',
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySurface,
    borderColor: colors.primaryBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space[2],
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: space[3] + 2,
    paddingVertical: space[2] + 3,
    borderRadius: radius.md,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  bubbleAssistant: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 2,
    ...shadows.sm,
  },
  bubbleTextUser: {
    color: colors.onPrimary,
    lineHeight: 20,
  },
  bubbleTextAssistant: {
    color: colors.text,
    lineHeight: 21,
  },
  actionCard: {
    marginTop: space[2],
    paddingTop: space[2],
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  loadingRow: {
    paddingHorizontal: space[4],
    paddingVertical: space[2],
    alignItems: 'center',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgElevated,
    gap: space[2],
  },
  input: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: space[4],
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    color: colors.text,
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
