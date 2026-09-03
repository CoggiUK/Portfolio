import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, FAB, Empty, Row, Field, Btn, Sheet, Chip } from '../../components/ui';
import { colors, space, radius, font } from '../../theme';
import { useApp } from '../../contexts/AppContext';
import { toDate, fmtRelative } from '../../utils/date';

const emptyForm = { title: '', content: '', tags: '', pinned: false };

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

  const openNew = () => { setEditing(null); setForm(emptyForm); setSheet(true); };
  const openEdit = (n) => {
    setEditing(n);
    setForm({ title: n.title || '', content: n.content || '', tags: (n.tags || []).join(', '), pinned: !!n.pinned });
    setSheet(true);
  };

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

  const confirmDelete = (n) =>
    Alert.alert('Xoá ghi chú?', n.title, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => remove('notes', n.id) },
    ]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: space[4] }}>
        <View style={s.search}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Tìm trong ghi chú…"
            placeholderTextColor={colors.textMuted}
            style={s.searchInput}
          />
          {q ? <Pressable onPress={() => setQ('')} hitSlop={8}><Ionicons name="close" size={15} color={colors.textMuted} /></Pressable> : null}
        </View>
        {allTags.length ? (
          <Row style={{ flexWrap: 'wrap', marginBottom: space[3] }} gap={space[2]}>
            <Chip label="Tất cả" active={!tag} onPress={() => setTag(null)} />
            {allTags.map((t) => (
              <Chip key={t} label={`#${t}`} active={tag === t} onPress={() => setTag(tag === t ? null : t)} color={colors.secondary} />
            ))}
          </Row>
        ) : null}
      </View>

      <FlatList
        data={list}
        keyExtractor={(n) => n.id}
        numColumns={2}
        columnWrapperStyle={{ gap: space[3] }}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 110, gap: space[3] }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Empty icon="reader-outline" title="Chưa có ghi chú" hint="Ghi lại ý tưởng trước khi nó bay mất." />}
        renderItem={({ item: n }) => (
          <Card style={s.note} onPress={() => openEdit(n)}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={[font.body, { color: colors.text, flex: 1 }]} numberOfLines={2}>{n.title}</Text>
              <Pressable onPress={() => update('notes', n.id, { pinned: !n.pinned })} hitSlop={8}>
                <Ionicons name={n.pinned ? 'bookmark' : 'bookmark-outline'} size={15}
                  color={n.pinned ? colors.amber : colors.textMuted} />
              </Pressable>
            </Row>
            {n.content ? (
              <Text style={[font.small, { color: colors.textSub, marginTop: space[2] }]} numberOfLines={5}>
                {n.content}
              </Text>
            ) : null}
            {n.tags?.length ? (
              <Text style={[font.tiny, { color: colors.secondary, marginTop: space[2] }]} numberOfLines={1}>
                {n.tags.map((t) => `#${t}`).join(' ')}
              </Text>
            ) : null}
            <Row style={{ marginTop: space[3], justifyContent: 'space-between' }}>
              <Text style={[font.tiny, { color: colors.textMuted }]}>
                {n.updatedAt ? fmtRelative(toDate(n.updatedAt)) : ''}
              </Text>
              <Pressable onPress={() => confirmDelete(n)} hitSlop={8}>
                <Ionicons name="trash-outline" size={14} color={colors.textMuted} />
              </Pressable>
            </Row>
          </Card>
        )}
      />

      <FAB onPress={openNew} />

      <Sheet visible={sheet} onClose={() => setSheet(false)} title={editing ? 'Sửa ghi chú' : 'Ghi chú mới'}>
        <Field label="Tiêu đề" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })}
          placeholder="Ý tưởng cho trang chủ v2" />
        <Field label="Nội dung" value={form.content} onChangeText={(v) => setForm({ ...form, content: v })}
          multiline placeholder="Viết tự do…" />
        <Field label="Thẻ" hint="Cách nhau bởi dấu phẩy" value={form.tags}
          onChangeText={(v) => setForm({ ...form, tags: v })} placeholder="design, ý tưởng" />
        <Row style={{ marginBottom: space[4] }}>
          <Chip label="Ghim lên đầu" icon="bookmark" color={colors.amber} active={form.pinned}
            onPress={() => setForm({ ...form, pinned: !form.pinned })} />
        </Row>
        <Btn title={editing ? 'Lưu' : 'Thêm ghi chú'} icon="checkmark" onPress={save} />
      </Sheet>
    </View>
  );
}

const s = StyleSheet.create({
  search: {
    flexDirection: 'row', alignItems: 'center', gap: space[2],
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, paddingHorizontal: space[3], marginBottom: space[3],
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: space[3] },
  note: { flex: 1, padding: space[3] },
});
