import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Card, Field, Btn, SectionTitle, Row, Chip, Banner, IconBtn } from '../../components/ui';
import { colors, space, font, fontFamily, listBottomPad } from '../../theme';
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

  // Chuẩn hoá học vấn: Hỗ trợ cả mảng hoặc object đơn (dữ liệu cũ).
  const eduList = Array.isArray(draft.education)
    ? draft.education
    : draft.education && (draft.education.school || draft.education.major)
      ? [draft.education]
      : [];

  const updateEdu = (idx, field, val) => {
    const next = [...eduList];
    next[idx] = { ...(next[idx] || {}), [field]: val };
    set('education', next);
  };

  const addEdu = () => {
    set('education', [...eduList, { school: '', major: '', period: '', gpa: '' }]);
  };

  const removeEdu = (idx) => {
    set('education', eduList.filter((_, i) => i !== idx));
  };

  // Chuẩn hoá kinh nghiệm
  const expList = Array.isArray(draft.experience) ? draft.experience : [];

  const updateExp = (idx, field, val) => {
    const next = [...expList];
    next[idx] = { ...(next[idx] || {}), [field]: val };
    set('experience', next);
  };

  const addExp = () => {
    set('experience', [...expList, { role: '', company: '', period: '', points: [] }]);
  };

  const removeExp = (idx) => {
    set('experience', expList.filter((_, i) => i !== idx));
  };

  // Chuẩn hoá nhóm kỹ năng
  const setGroupItems = (idx, text) => {
    const groups = [...(draft.skillGroups || [])];
    groups[idx] = { ...groups[idx], items: text.split(',').map((s) => s.trim()).filter(Boolean) };
    set('skillGroups', groups);
  };

  const save = async () => {
    setBusy(true);
    try {
      const cleanedEdu = eduList.filter((e) => (e.school || '').trim() || (e.major || '').trim());
      const payload = {
        ...draft,
        education: cleanedEdu,
      };
      await db.saveSiteProfile(payload);
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
      contentContainerStyle={{ padding: space[4], paddingBottom: listBottomPad() }}
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

      <SectionTitle right={
        <Btn title="Thêm học vấn" icon="add" small variant="secondary" onPress={addEdu} />
      }>
        Học vấn ({eduList.length})
      </SectionTitle>

      {eduList.map((edu, idx) => (
        <Card key={idx} style={{ marginBottom: space[3] }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: space[2] }}>
            <Text style={[font.h3, { color: colors.primary, fontFamily: fontFamily.bold }]}>
              {edu.school || `Học vấn #${idx + 1}`}
            </Text>
            <IconBtn
              icon="trash-outline"
              color={colors.danger}
              onPress={() => removeEdu(idx)}
            />
          </Row>
          <Field
            label="Trường"
            value={edu.school || ''}
            onChangeText={(v) => updateEdu(idx, 'school', v)}
            placeholder="Đại học FPT"
          />
          <Field
            label="Chuyên ngành"
            value={edu.major || ''}
            onChangeText={(v) => updateEdu(idx, 'major', v)}
            placeholder="Kỹ thuật phần mềm / Thiết kế đồ hoạ"
          />
          <Row gap={space[2]}>
            <View style={{ flex: 1.5 }}>
              <Field
                label="Thời gian"
                value={edu.period || ''}
                onChangeText={(v) => updateEdu(idx, 'period', v)}
                placeholder="2021 - 2024"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="GPA"
                value={edu.gpa || ''}
                onChangeText={(v) => updateEdu(idx, 'gpa', v)}
                placeholder="3.2 / 4.0"
              />
            </View>
          </Row>
        </Card>
      ))}

      <Btn
        title="+ Thêm học vấn / Bằng cấp mới"
        icon="add"
        variant="secondary"
        onPress={addEdu}
        style={{ marginBottom: space[4] }}
      />

      <SectionTitle right={
        <Btn title="Thêm kinh nghiệm" icon="add" small variant="secondary" onPress={addExp} />
      }>
        Kinh nghiệm làm việc ({expList.length})
      </SectionTitle>

      {expList.map((exp, idx) => (
        <Card key={idx} style={{ marginBottom: space[3] }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: space[2] }}>
            <Text style={[font.h3, { color: colors.secondary, fontFamily: fontFamily.bold }]}>
              {exp.role || `Kinh nghiệm #${idx + 1}`}
            </Text>
            <IconBtn
              icon="trash-outline"
              color={colors.danger}
              onPress={() => removeExp(idx)}
            />
          </Row>
          <Field
            label="Vị trí / Vai trò"
            value={exp.role || ''}
            onChangeText={(v) => updateExp(idx, 'role', v)}
            placeholder="UI/UX Designer"
          />
          <Field
            label="Công ty / Tổ chức"
            value={exp.company || ''}
            onChangeText={(v) => updateExp(idx, 'company', v)}
            placeholder="Học viện Minh Trí Thành"
          />
          <Field
            label="Thời gian"
            value={exp.period || ''}
            onChangeText={(v) => updateExp(idx, 'period', v)}
            placeholder="03/2024 - Hiện tại"
          />
          <Field
            label="Chi tiết công việc (Mỗi dòng một ý)"
            value={(exp.points || []).join('\n')}
            onChangeText={(v) => updateExp(idx, 'points', v.split('\n'))}
            multiline
            placeholder="Phụ trách thiết kế giao diện..."
          />
        </Card>
      ))}

      <Btn
        title="+ Thêm kinh nghiệm làm việc"
        icon="add"
        variant="secondary"
        onPress={addExp}
        style={{ marginBottom: space[4] }}
      />

      <SectionTitle>Nhóm kỹ năng ({ (draft.skillGroups || []).length })</SectionTitle>
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

      <Row style={{ marginTop: space[6] }} gap={space[3]}>
        {dirty ? <Btn title="Bỏ thay đổi" variant="secondary" onPress={reset} style={{ flex: 1 }} /> : null}
        <Btn
          title="Lưu lên website"
          icon="cloud-upload-outline"
          onPress={save}
          loading={busy}
          loadingTitle="Đang lưu…"
          disabled={!dirty}
          style={{ flex: dirty ? 2 : 1 }}
        />
      </Row>
    </ScrollView>
  );
}
