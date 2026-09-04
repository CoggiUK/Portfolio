import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, FAB, Empty, Row, Badge, IconBtn } from '../../components/ui';
import { colors, space, radius, font } from '../../theme';
import { useApp } from '../../contexts/AppContext';
import * as db from '../../services/db';

export default function ProjectsPane({ navigation }) {
  const { site, notify } = useApp();
  const projects = site.projects || [];

  const move = async (index, delta) => {
    const next = [...projects];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    await db.saveSiteProjects(next);
  };

  const confirmDelete = (p, index) =>
    Alert.alert('Xoá dự án?', `"${p.title}" sẽ biến mất khỏi website.`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          await db.saveSiteProjects(projects.filter((_, i) => i !== index));
          notify('Đã xoá dự án khỏi website', 'success');
        },
      },
    ]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={projects}
        keyExtractor={(p, i) => p.id || String(i)}
        contentContainerStyle={{ paddingHorizontal: space[4], paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Empty icon="albums-outline" title="Chưa có dự án nào"
            hint="Bấm + để thêm dự án hiển thị trên portfolio." />
        }
        renderItem={({ item: p, index }) => (
          <Card style={{ marginBottom: space[3] }} onPress={() => navigation.navigate('ProjectForm', { index })}>
            <Row style={{ justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={[font.h3, { color: colors.text }]} numberOfLines={2}>{p.title}</Text>
                {p.subtitle ? (
                  <Text style={[font.small, { color: colors.textSub, marginTop: 2 }]} numberOfLines={1}>
                    {p.subtitle}
                  </Text>
                ) : null}
              </View>
              <View style={{ gap: 2 }}>
                <IconBtn icon="chevron-up" size={16} onPress={() => move(index, -1)} />
                <IconBtn icon="chevron-down" size={16} onPress={() => move(index, 1)} />
              </View>
            </Row>

            <Row style={{ marginTop: space[3], flexWrap: 'wrap' }} gap={space[1]}>
              {(p.tech || []).slice(0, 5).map((t) => (
                <View key={t} style={s.tech}><Text style={[font.tiny, { color: colors.cyan }]}>{t}</Text></View>
              ))}
              {(p.tech || []).length > 5 ? (
                <Text style={[font.tiny, { color: colors.textMuted }]}>+{p.tech.length - 5}</Text>
              ) : null}
            </Row>

            <Row style={{ marginTop: space[3], justifyContent: 'space-between' }}>
              <Row gap={space[2]}>
                {p.period ? <Badge label={p.period} color={colors.textMuted} /> : null}
                {p.links?.live ? (
                  <IconBtn icon="globe-outline" size={16} color={colors.primary}
                    onPress={() => Linking.openURL(p.links.live)} />
                ) : null}
                {p.links?.figma ? (
                  <IconBtn icon="color-palette-outline" size={16} color={colors.secondary}
                    onPress={() => Linking.openURL(p.links.figma)} />
                ) : null}
              </Row>
              <IconBtn icon="trash-outline" size={16} color={colors.danger}
                onPress={() => confirmDelete(p, index)} />
            </Row>
          </Card>
        )}
      />
      <FAB onPress={() => navigation.navigate('ProjectForm', {})} />
    </View>
  );
}

const s = StyleSheet.create({
  tech: {
    paddingHorizontal: space[2], paddingVertical: 3, borderRadius: radius.pill,
    backgroundColor: colors.cyanDim, borderWidth: 1, borderColor: colors.border,
  },
});
