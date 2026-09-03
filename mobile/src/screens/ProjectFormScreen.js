import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import {
  Screen, Header, Card, Field, Btn, SectionTitle, Row, IconBtn, Banner,
} from '../components/ui';
import { colors, space, font } from '../theme';
import { useApp } from '../contexts/AppContext';
import * as db from '../services/db';

const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 48);

const blank = {
  id: '', title: '', subtitle: '', role: '', period: '',
  tech: [], metrics: {}, details: [], links: { live: '', github: '', figma: '' },
};

export default function ProjectFormScreen({ navigation, route }) {
  const { index } = route.params || {};
  const { site, notify } = useApp();
  const projects = site.projects || [];
  const existing = useMemo(
    () => (typeof index === 'number' ? projects[index] : null),
    [projects, index]
  );

  const [form, setForm] = useState(() => ({ ...blank, ...(existing || {}) }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setLink = (k, v) => setForm((f) => ({ ...f, links: { ...(f.links || {}), [k]: v } }));

  const metricEntries = Object.entries(form.metrics || {});

  const setMetric = (i, key, value) => {
    const next = metricEntries.map(([k, v], x) => (x === i ? [key, value] : [k, v]));
    set('metrics', Object.fromEntries(next.filter(([k]) => k)));
  };

  const save = async () => {
    if (!form.title.trim()) return setError('Dự án cần có tiêu đề.');
    setBusy(true);
    setError('');
    try {
      const payload = {
        ...form,
        id: form.id || slugify(form.title) || `project-${Date.now()}`,
        title: form.title.trim(),
        tech: (form.tech || []).filter(Boolean),
        details: (form.details || []).map((d) => d.trim()).filter(Boolean),
      };
      const next = [...projects];
      if (typeof index === 'number') next[index] = payload;
      else next.push(payload);
      await db.saveSiteProjects(next);
      notify(typeof index === 'number' ? 'Đã cập nhật dự án' : 'Đã thêm dự án mới', 'success');
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = () =>
    Alert.alert('Xoá dự án?', `"${existing?.title}" sẽ biến mất khỏi website.`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          await db.saveSiteProjects(projects.filter((_, i) => i !== index));
          navigation.goBack();
        },
      },
    ]);

  return (
    <Screen>
      <Header
        title={existing ? 'Sửa dự án' : 'Dự án mới'}
        subtitle="Hiển thị trên portfolio"
        onBack={() => navigation.goBack()}
        right={existing ? <IconBtn icon="trash-outline" color={colors.danger} onPress={confirmDelete} /> : null}
      />
      <ScrollView
        contentContainerStyle={{ padding: space[4], paddingBottom: space[8] }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Banner type="error" message={error} onClose={() => setError('')} />

        <Card>
          <Field label="Tiêu đề" value={form.title} onChangeText={(v) => set('title', v)}
            placeholder="MTT Monitor — GA4 & Ads Tracking Dashboard" />
          <Field label="Mô tả ngắn" value={form.subtitle} onChangeText={(v) => set('subtitle', v)}
            placeholder="Hệ thống giám sát dữ liệu real-time" />
          <Field label="Vai trò" value={form.role} onChangeText={(v) => set('role', v)}
            placeholder="End-to-End Product Designer" />
          <Field label="Thời gian" value={form.period} onChangeText={(v) => set('period', v)}
            placeholder="07/2025 - Hiện tại" />
          <Field
            label="Công nghệ"
            hint="Cách nhau bởi dấu phẩy — cũng là nguồn tính khối Kỹ năng trên web"
            value={(form.tech || []).join(', ')}
            onChangeText={(v) => set('tech', v.split(',').map((t) => t.trim()).filter(Boolean))}
            multiline
          />
        </Card>

        <SectionTitle right={
          <IconBtn icon="add" color={colors.primary}
            onPress={() => set('metrics', { ...(form.metrics || {}), [`metric${metricEntries.length + 1}`]: '' })} />
        }>
          Chỉ số hiệu quả
        </SectionTitle>
        <Card>
          {metricEntries.length ? (
            metricEntries.map(([k, v], i) => (
              <Row key={i} gap={space[2]} style={{ marginBottom: space[2] }}>
                <View style={{ flex: 1 }}>
                  <Field style={{ marginBottom: 0 }} value={k} placeholder="efficiency"
                    onChangeText={(nk) => setMetric(i, nk, v)} autoCapitalize="none" />
                </View>
                <View style={{ flex: 1.3 }}>
                  <Field style={{ marginBottom: 0 }} value={v} placeholder="3-in-1 GA4 + FB + Ads"
                    onChangeText={(nv) => setMetric(i, k, nv)} />
                </View>
                <IconBtn icon="close" color={colors.danger}
                  onPress={() => set('metrics', Object.fromEntries(metricEntries.filter((_, x) => x !== i)))} />
              </Row>
            ))
          ) : (
            <Text style={[font.small, { color: colors.textMuted }]}>
              Chưa có chỉ số. Bấm + để thêm cặp khoá – giá trị (ví dụ roi → +18% chuyển đổi).
            </Text>
          )}
        </Card>

        <SectionTitle right={
          <IconBtn icon="add" color={colors.primary} onPress={() => set('details', [...(form.details || []), ''])} />
        }>
          Điểm nổi bật
        </SectionTitle>
        <Card>
          {(form.details || []).length ? (
            form.details.map((d, i) => (
              <Row key={i} gap={space[2]} style={{ alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Field
                    style={{ marginBottom: space[2] }}
                    value={d}
                    multiline
                    placeholder="Mô tả một điểm nổi bật của dự án…"
                    onChangeText={(v) => set('details', form.details.map((x, xi) => (xi === i ? v : x)))}
                  />
                </View>
                <IconBtn icon="close" color={colors.danger}
                  onPress={() => set('details', form.details.filter((_, xi) => xi !== i))} />
              </Row>
            ))
          ) : (
            <Text style={[font.small, { color: colors.textMuted }]}>Bấm + để thêm gạch đầu dòng.</Text>
          )}
        </Card>

        <SectionTitle>Liên kết</SectionTitle>
        <Card>
          <Field label="Live demo" value={form.links?.live || ''} onChangeText={(v) => setLink('live', v)}
            placeholder="https://…" autoCapitalize="none" />
          <Field label="GitHub" value={form.links?.github || ''} onChangeText={(v) => setLink('github', v)}
            placeholder="https://github.com/…" autoCapitalize="none" />
          <Field label="Figma" value={form.links?.figma || ''} onChangeText={(v) => setLink('figma', v)}
            placeholder="https://figma.com/…" autoCapitalize="none" />
        </Card>

        <Btn title={existing ? 'Lưu thay đổi' : 'Thêm vào website'} icon="cloud-upload-outline"
          onPress={save} loading={busy} style={{ marginTop: space[5] }} />
      </ScrollView>
    </Screen>
  );
}
