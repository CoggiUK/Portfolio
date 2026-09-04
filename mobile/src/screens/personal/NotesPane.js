import React, { useMemo, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card, FAB, Empty, Row, Field, Btn, Sheet, Chip, Badge } from '../../components/ui';
import { colors, space, radius, font, tint, shadows } from '../../theme';
import { useApp } from '../../contexts/AppContext';
import { toDate, fmtRelative } from '../../utils/date';

const emptyForm = { title: '', content: '', tags: '', pinned: false };

// Note item memoized
const NoteItem = memo(function NoteItem({ item, onEdit, onTogglePin, onDelete }) {
  return (
    <Card
      style={[
        s.note,
        item.pinned && {
          borderColor: tint(colors.amber, 0.45),
          backgroundColor: tint(colors.amber, 0.05),
        },
      ]}
      onPress={() => onEdit(item)}
    >
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text
          style={[
            font.body,
            { color: colors.text, flex: 1, fontWeight: '700', lineHeight: 20 },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Pressable
          onPress={() => onTogglePin(item)}
          hitSlop={10}
          style={({ pressed }) => [pressed && { transform: [{ scale: 0.85 }] }]}
        >
          <Ionicons
            name={item.pinned ? 'bookmark' : 'bookmark-outline'}
            size={16}
            color={item.pinned ? colors.amber : colors.textMuted}
          />
        </Pressable>
      </Row>

      {item.content ? (
        <Text
          style={[font.small, { color: colors.textSub, marginTop: space[2], lineHeight: 18 }]}
          numberOfLines={4}
        >
          {item.content}
        </Text>
      ) : null}

      {item.tags?.length ? (
        <Row style={{ flexWrap: 'wrap', marginTop: space[2] }} gap={4}>
          {item.tags.slice(0, 2).map((t) => (
            <View key={t} style={s.tagPill}>
              <Text style={[font.tiny, { color: colors.secondary, fontWeight: '600' }]} numberOfLines={1}>
                #{t}
              </Text>
            </View>
          ))}
          {item.tags.length > 2 ? (
            <Text style={[font.tiny, { color: colors.textMuted }]}>+{item.tags.length - 2}</Text>
          ) : null}
        </Row>
      ) : null}

      <Row style={{ marginTop: space[3], justifyContent: 'space-between' }}>
        <Text style={[font.tiny, { color: colors.textMuted }]}>
          {item.updatedAt ? fmtRelative(toDate(item.updatedAt)) : 'Vừa xong'}
        </Text>
        <Pressable
          onPress={() => onDelete(item)}
          hitSlop={10}
          style={({ pressed }) => [pressed && { opacity: 0.5 }]}
        >
          <Ionicons name="trash-outline" size={14} color={colors.textMuted} />
        </Pressable>
      </Row>
    </Card>
  );
});

export default function NotesPane() {
  const { notes, create, update, remove } = useApp();
  const [q, setQ] = useState('');
  const [tag, setTag] = useState(null);
  const [sheet, setSheet] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const allTags = useMemo(
    () => Array.from(new Set(notes.flatMap((n) => n.tags || []))).sort(),
    [notes]
  );

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return notes
      .filter((n) => (tag ? (n.tags || []).includes(tag) : true))
      .filter((n) =>
        !needle ||
        `${n.title || ''} ${n.content || ''} ${(n.tags || []).join(' ')}`.toLowerCase().includes(needle)
      )
      .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));
  }, [notes, q, tag]);

  const openNew = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
    setSheet(true);
  }, []);

  const openEdit = useCallback((n) => {
    setEditing(n);
    setForm({
      title: n.title || '',
      content: n.content || '',
      tags: (n.tags || []).join(', '),
      pinned: !!n.pinned,
    });
    setSheet(true);
  }, []);

  const togglePin = useCallback((n) => {
    Haptics.selectionAsync().catch(() => {});
    update('notes', n.id, { pinned: !n.pinned });
  }, [update]);

  const save = async () => {
    if (!form.title.trim() && !form.content.trim()) return;
    const payload = {
      title: form.title.trim() || form.content.trim().split('\n')[0].slice(0, 60),
      content: form.content.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      pinned: form.pinned,
    };
    if (editing) await update('notes', editing.id, payload);
    else await create('notes', payload);
    setSheet(false);
  };

  const confirmDelete = useCallback((n) => {
    Alert.alert('Xoá ghi chú?', n.title, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => remove('notes', n.id) },
    ]);
  }, [remove]);

  const keyExtractor = useCallback((n) => n.id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <NoteItem
        item={item}
        onEdit={openEdit}
        onTogglePin={togglePin}
        onDelete={confirmDelete}
      />
    ),
    [openEdit, togglePin, confirmDelete]
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: space[4] }}>
        {/* Thanh tìm kiếm */}
        <View style={s.search}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Tìm kiếm nhanh trong ghi chú…"
            placeholderTextColor={colors.textMuted}
            style={s.searchInput}
          />
          {q ? (
            <Pressable onPress={() => setQ('')} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Thẻ phân loại Tags */}
        {allTags.length ? (
          <Row style={{ flexWrap: 'wrap', marginBottom: space[3] }} gap={space[2]}>
            <Chip label="Tất cả" active={!tag} onPress={() => setTag(null)} />
            {allTags.map((t) => (
              <Chip
                key={t}
                label={`#${t}`}
                active={tag === t}
                onPress={() => setTag(tag === t ? null : t)}
                color={colors.secondary}
              />
            ))}
          </Row>
        ) : null}
      </View>

      <FlatList
        data={list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ gap: space[3] }}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 110, gap: space[3] }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        ListEmptyComponent={
          <Empty
            icon="reader-outline"
            title="Chưa có ghi chú nào"
            hint="Ghi lại các ý tưởng sáng tạo, bản nháp nhanh trước khi quên."
          />
        }
      />

      <FAB onPress={openNew} />

      <Sheet visible={sheet} onClose={() => setSheet(false)} title={editing ? 'Sửa ghi chú' : 'Ghi chú mới'}>
        <Field
          label="Tiêu đề ghi chú"
          value={form.title}
          onChangeText={(v) => setForm({ ...form, title: v })}
          placeholder="Ý tưởng tính năng mới…"
        />
        <Field
          label="Nội dung chi tiết"
          value={form.content}
          onChangeText={(v) => setForm({ ...form, content: v })}
          multiline
          placeholder="Viết tự do những suy nghĩ, ghi chú nhanh của bạn ở đây…"
        />
        <Field
          label="Thẻ phân loại"
          hint="Các thẻ cách nhau bởi dấu phẩy"
          value={form.tags}
          onChangeText={(v) => setForm({ ...form, tags: v })}
          placeholder="Ví dụ: design, mobile, idea"
        />
        <Row style={{ marginBottom: space[4] }}>
          <Chip
            label={form.pinned ? 'Đã ghim lên đầu' : 'Ghim ghi chú lên đầu'}
            icon="bookmark"
            color={colors.amber}
            active={form.pinned}
            onPress={() => setForm({ ...form, pinned: !form.pinned })}
          />
        </Row>
        <Btn title={editing ? 'Lưu thay đổi' : 'Tạo ghi chú'} icon="checkmark" onPress={save} />
      </Sheet>
    </View>
  );
}

const s = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space[3],
    marginBottom: space[3],
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: space[2] + 2,
  },
  note: {
    flex: 1,
    padding: space[3] + 2,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  tagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: tint(colors.secondary, 0.15),
  },
});
