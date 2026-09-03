import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Card, Field, Btn, SectionTitle, Row, Chip, Banner, IconBtn } from '../../components/ui';
import { colors, space, font } from '../../theme';
import { useApp } from '../../contexts/AppContext';
import * as db from '../../services/db';

const TEXT_FIELDS = [
  { key: 'name', label: 'Họ tên', placeholder: 'Tùng Lâm Nguyễn' },
  { key: 'title', label: 'Chức danh', placeholder: 'UI/UX Designer · hướng tới Product Designer' },
  { key: 'email', label: 'Email', placeholder: 'ban@example.com', keyboardType: 'email-address' },
  { key: 'phone', label: 'Điện thoại', placeholder: '0974 149 916' },
  { key: 'location', label: 'Khu vực', placeholder: 'Bồ Đề, Hà Nội' },
  { key: 'company', label: 'Nơi làm việc', placeholder: 'Học viện Minh Trí Thành' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/…' },
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/…' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/…' },
  { key: 'behance', label: 'Behance', placeholder: 'https://behance.net/…' },
];

export default function ProfilePane() {
  const { site, notify } = useApp();
  const [draft, setDraft] = useState(site.profile || {});
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);

  // Nhận thay đổi từ Firestore khi chưa sửa dở — tránh ghi đè thao tác đang gõ.
  useEffect(() => {
    if (!dirty) setDraft(site.profile || {});
  }, [site.profile, dirty]);

  const set = (key, value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };

  const setGroupItems = (idx, text) => {
    const groups = [...(draft.skillGroups || [])];
    groups[idx] = { ...groups[idx], items: text.split(',').map((s) => s.trim()).filter(Boolean) };
    set('skillGroups', groups);
  };

  const save = async () => {
    setBusy(true);
    try {
      await db.saveSiteProfile(draft);
      setDirty(false);
      notify('Đã cập nhật hồ sơ trên website', 'success');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const reset = () =>
    Alert.alert('Bỏ thay đổi?', 'Các sửa đổi chưa lưu sẽ mất.', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Bỏ', style: 'destructive', onPress: () => { setDraft(site.profile || {}); setDirty(false); } },
    ]);

  return (
    <ScrollView
      contentContainerStyle={{ padding: space[4], paddingBottom: space[8] }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {dirty ? <Banner type="info" message="Có thay đổi chưa lưu — bấm Lưu để cập nhật website." /> : null}

      <SectionTitle>Thông tin cơ bản</SectionTitle>
      <Card>
        {TEXT_FIELDS.map((f) => (
          <Field
            key={f.key}
            label={f.label}
            value={draft[f.key] || ''}
            onChangeText={(v) => set(f.key, v)}
            placeholder={f.placeholder}
            keyboardType={f.keyboardType}
            autoCapitalize={f.keyboardType === 'email-address' ? 'none' : 'sentences'}
          />
        ))}
      </Card>

      <SectionTitle>Giới thiệu</SectionTitle>
      <Card>
        <Field
          value={draft.bio || ''}
          onChangeText={(v) => set('bio', v)}
          multiline
          placeholder="Đoạn giới thiệu hiển thị ở đầu trang…"
        />
      </Card>

      <SectionTitle>Học vấn</SectionTitle>
      <Card>
        {['school', 'major', 'period', 'gpa'].map((k) => (
          <Field
            key={k}
            label={{ school: 'Trường', major: 'Chuyên ngành', period: 'Thời gian', gpa: 'GPA' }[k]}
            value={draft.education?.[k] || ''}
            onChangeText={(v) => set('education', { ...(draft.education || {}), [k]: v })}
          />
        ))}
      </Card>

      <SectionTitle>Nhóm kỹ năng</SectionTitle>
      {(draft.skillGroups || []).map((g, i) => (
        <Card key={i} style={{ marginBottom: space[2] }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: space[2] }}>
            <Text style={[font.h3, { color: colors.text, flex: 1 }]}>{g.label}</Text>
            <IconBtn
              icon="trash-outline"
              color={colors.danger}
              onPress={() => set('skillGroups', draft.skillGroups.filter((_, x) => x !== i))}
            />
          </Row>
          <Field
            label="Tên nhóm"
            value={g.label || ''}
            onChangeText={(v) => {
              const groups = [...draft.skillGroups];
              groups[i] = { ...groups[i], label: v };
              set('skillGroups', groups);
            }}
          />
          <Field
            label="Kỹ năng"
            hint="Cách nhau bởi dấu phẩy"
            value={(g.items || []).join(', ')}
            onChangeText={(v) => setGroupItems(i, v)}
            multiline
          />
          <Row style={{ flexWrap: 'wrap' }} gap={space[1]}>
            {(g.items || []).map((it) => <Chip key={it} label={it} active color={colors.cyan} />)}
          </Row>
        </Card>
      ))}
      <Btn
        title="Thêm nhóm kỹ năng"
        icon="add"
        variant="secondary"
        onPress={() => set('skillGroups', [...(draft.skillGroups || []), { label: 'Nhóm mới', items: [] }])}
      />

      <Row style={{ marginTop: space[6] }} gap={space[2]}>
        {dirty ? <Btn title="Bỏ" variant="ghost" onPress={reset} style={{ flex: 1 }} /> : null}
        <Btn title="Lưu lên website" icon="cloud-upload-outline" onPress={save} loading={busy}
          disabled={!dirty} style={{ flex: 2 }} />
      </Row>
    </ScrollView>
  );
}
