import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import {
  Screen, Header, Card, Field, Btn, SectionTitle, Row, IconBtn, Banner, Chip,
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
  cover: '', imageCount: 0,
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
  const [newTech, setNewTech] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setLink = (k, v) => setForm((f) => ({ ...f, links: { ...(f.links || {}), [k]: v } }));

  const addTech = (t) => {
    const val = (t || newTech).trim();
    if (!val) return;
    if (!(form.tech || []).includes(val)) {
      set('tech', [...(form.tech || []), val]);
    }
    setNewTech('');
  };

  const removeTech = (idx) => {
    set('tech', (form.tech || []).filter((_, i) => i !== idx));
  };

  const metricEntries = Object.entries(form.metrics || {});

  const setMetric = (i, key, value) => {
    const next = metricEntries.map(([k, v], x) => (x === i ? [key, value] : [k, v]));
    set('metrics', Object.fromEntries(next.filter(([k]) => k)));
  };

  const addMetric = () => {
    const nextKey = `metric_${Date.now()}`;
    set('metrics', { ...(form.metrics || {}), [nextKey]: '' });
  };

  const addDetail = () => {
    set('details', [...(form.details || []), '']);
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
        imageCount: Number(form.imageCount || 0),
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
    <Screen edges={['top', 'bottom']}>
      <Header
        title={existing ? 'Sửa dự án' : 'Dự án mới'}
        subtitle="Hiển thị trên portfolio"
        onBack={() => navigation.goBack()}
        right={existing ? <IconBtn icon="trash-outline" color={colors.danger} onPress={confirmDelete} /> : null}
      />
      <ScrollView
        contentContainerStyle={{ padding: space[4], paddingBottom: space[8] + 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Banner type="error" message={error} onClose={() => setError('')} />

        <SectionTitle>Thông tin cơ bản</SectionTitle>
        <Card>
          <Field label="Tiêu đề" value={form.title} onChangeText={(v) => set('title', v)}
            placeholder="MTT Monitor — GA4 & Ads Tracking Dashboard" />
          <Field label="Mô tả ngắn" value={form.subtitle} onChangeText={(v) => set('subtitle', v)}
            placeholder="Hệ thống giám sát dữ liệu real-time" />
          <Field label="Vai trò" value={form.role} onChangeText={(v) => set('role', v)}
            placeholder="End-to-End Product Designer" />
          <Field label="Thời gian" value={form.period} onChangeText={(v) => set('period', v)}
            placeholder="07/2025 - Hiện tại" />
        </Card>

        {/* ── Kỹ năng & Công nghệ ── */}
        <SectionTitle right={
          <Text style={[font.tiny, { color: colors.cyan, fontWeight: '700' }]}>
            {(form.tech || []).length} KỸ NĂNG
          </Text>
        }>
          Kỹ năng & Công nghệ
        </SectionTitle>
        <Card>
          <Row gap={space[2]} style={{ marginBottom: space[3] }}>
            <View style={{ flex: 1 }}>
              <Field
                style={{ marginBottom: 0 }}
                placeholder="Nhập kỹ năng (vd: Figma, Next.js...)"
                value={newTech}
                onChangeText={setNewTech}
                onSubmitEditing={() => addTech()}
                returnKeyType="done"
              />
            </View>
            <Btn title="+ Thêm" icon="add" small variant="secondary" onPress={() => addTech()} />
          </Row>

          {(form.tech || []).length > 0 ? (
            <Row style={{ flexWrap: 'wrap' }} gap={space[2]}>
              {form.tech.map((t, idx) => (
                <Chip
                  key={idx}
                  label={`${t}  ✕`}
                  active
                  color={colors.cyan}
                  onPress={() => removeTech(idx)}
                />
              ))}
            </Row>
          ) : (
            <Text style={[font.small, { color: colors.textMuted }]}>
              Chưa có kỹ năng. Nhập tên kỹ năng vào ô trên và bấm + Thêm.
            </Text>
          )}
        </Card>

        {/* ── Chỉ số hiệu quả (Metrics) ── */}
        <SectionTitle right={
          <Btn title="Thêm chỉ số" icon="add" small variant="secondary" onPress={addMetric} />
        }>
          Chỉ số hiệu quả ({metricEntries.length})
        </SectionTitle>
        <Card>
          {metricEntries.length ? (
            metricEntries.map(([k, v], i) => (
              <Row key={i} gap={space[2]} style={{ marginBottom: space[2], alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Field
                    style={{ marginBottom: 0 }}
                    value={k}
                    placeholder="Khoá (vd: leads)"
                    onChangeText={(nk) => setMetric(i, nk, v)}
                    autoCapitalize="none"
                  />
                </View>
                <View style={{ flex: 1.3 }}>
                  <Field
                    style={{ marginBottom: 0 }}
                    value={v}
                    placeholder="Giá trị (vd: +350%)"
                    onChangeText={(nv) => setMetric(i, k, nv)}
                  />
                </View>
                <IconBtn
                  icon="trash-outline"
                  color={colors.danger}
                  onPress={() => set('metrics', Object.fromEntries(metricEntries.filter((_, x) => x !== i)))}
                />
              </Row>
            ))
          ) : (
            <Text style={[font.small, { color: colors.textMuted }]}>
              Chưa có chỉ số. Bấm nút bên dưới để thêm cặp khoá – giá trị (ví dụ leads → +50% Leads).
            </Text>
          )}

          <Btn
            title="+ Thêm chỉ số hiệu quả"
            icon="add"
            variant="secondary"
            small
            style={{ marginTop: space[3] }}
            onPress={addMetric}
          />
        </Card>

        {/* ── Điểm nổi bật (Details) ── */}
        <SectionTitle right={
          <Btn title="Thêm điểm nổi bật" icon="add" small variant="secondary" onPress={addDetail} />
        }>
          Điểm nổi bật ({(form.details || []).length})
        </SectionTitle>
        <Card>
          {(form.details || []).length ? (
            form.details.map((d, i) => (
              <Row key={i} gap={space[2]} style={{ alignItems: 'flex-start', marginBottom: space[2] }}>
                <View style={{ flex: 1 }}>
                  <Field
                    style={{ marginBottom: 0 }}
                    value={d}
                    multiline
                    placeholder="Mô tả một điểm nổi bật của dự án…"
                    onChangeText={(v) => set('details', form.details.map((x, xi) => (xi === i ? v : x)))}
                  />
                </View>
                <IconBtn
                  icon="trash-outline"
                  color={colors.danger}
                  onPress={() => set('details', form.details.filter((_, xi) => xi !== i))}
                />
              </Row>
            ))
          ) : (
            <Text style={[font.small, { color: colors.textMuted }]}>
              Chưa có điểm nổi bật. Bấm nút bên dưới để thêm gạch đầu dòng mô tả dự án.
            </Text>
          )}

          <Btn
            title="+ Thêm điểm nổi bật"
            icon="add"
            variant="secondary"
            small
            style={{ marginTop: space[3] }}
            onPress={addDetail}
          />
        </Card>

        {/* ── Hình ảnh & Demo ── */}
        <SectionTitle>Hình ảnh & Demo</SectionTitle>
        <Card>
          <Field
            label="Ảnh bìa (URL)"
            value={form.cover || ''}
            onChangeText={(v) => set('cover', v)}
            placeholder="https://…/cover.png hoặc để trống"
            autoCapitalize="none"
          />
          <Field
            label="Số lượng ảnh demo"
            value={String(form.imageCount || 0)}
            onChangeText={(v) => set('imageCount', v.replace(/[^0-9]/g, ''))}
            placeholder="0"
            keyboardType="number-pad"
          />
        </Card>

        {/* ── Liên kết ── */}
        <SectionTitle>Liên kết</SectionTitle>
        <Card>
          <Field label="Live demo" value={form.links?.live || ''} onChangeText={(v) => setLink('live', v)}
            placeholder="https://…" autoCapitalize="none" />
          <Field label="GitHub" value={form.links?.github || ''} onChangeText={(v) => setLink('github', v)}
            placeholder="https://github.com/…" autoCapitalize="none" />
          <Field label="Figma" value={form.links?.figma || ''} onChangeText={(v) => setLink('figma', v)}
            placeholder="https://figma.com/…" autoCapitalize="none" />
        </Card>

        <View style={{ flexDirection: 'row', gap: space[3], marginTop: space[5] }}>
          <Btn
            title="Huỷ"
            variant="secondary"
            onPress={() => navigation.goBack()}
            style={{ flex: 1 }}
          />
          <Btn
            title={existing ? 'Lưu thay đổi' : 'Thêm vào website'}
            icon="cloud-upload-outline"
            onPress={save}
            loading={busy}
            loadingTitle="Đang lưu…"
            style={{ flex: 2 }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
