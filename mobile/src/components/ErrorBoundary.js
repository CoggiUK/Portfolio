import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { colors, space, radius, font, fontFamily } from '../theme';

/**
 * Trong bản release, một lỗi render chưa bắt sẽ đóng thẳng app. Boundary này
 * giữ app sống và cho người dùng quay lại thay vì mất toàn bộ phiên làm việc.
 * Dùng React primitives thuần để chính nó không phụ thuộc `components/ui`.
 */
export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  retry = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <View style={s.wrap}>
        <Text style={[font.h2, { color: colors.text, textAlign: 'center' }]}>
          Màn hình gặp sự cố
        </Text>
        <Text style={[font.small, { color: colors.textMuted, textAlign: 'center', marginTop: space[2] }]}>
          App vẫn chạy — bạn có thể thử mở lại màn hình này.
        </Text>

        <ScrollView style={s.detail} contentContainerStyle={{ padding: space[3] }}>
          <Text style={[font.tiny, { color: colors.danger }]}>
            {error?.message || String(error)}
          </Text>
        </ScrollView>

        <Pressable onPress={this.retry} style={({ pressed }) => [s.btn, pressed && { opacity: 0.85 }]}>
          <Text style={[font.body, { color: colors.onPrimary, fontFamily: fontFamily.bold }]}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }
}

const s = {
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space[5],
  },
  detail: {
    maxHeight: 160,
    alignSelf: 'stretch',
    marginTop: space[4],
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  btn: {
    marginTop: space[5],
    paddingHorizontal: space[6],
    paddingVertical: space[3],
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
};
