import React from 'react';
import { Platform } from 'react-native';
import { TodayWidget } from '../../widgets/TodayWidget';
import { fmtDate } from '../utils/date';

/**
 * Cập nhật giao diện của TodayWidget trên Android HomeScreen.
 * Chỉ chạy khi Platform.OS === 'android'.
 */
export async function syncTodayWidget({ eventCount = 0, overdueCount = 0 }) {
  if (Platform.OS !== 'android') return;

  try {
    const { requestWidgetUpdate } = require('react-native-android-widget');
    const dateStr = fmtDate(new Date());

    await requestWidgetUpdate({
      widgetName: 'TodayWidget',
      renderWidget: () => (
        <TodayWidget
          eventCount={eventCount}
          overdueCount={overdueCount}
          dateStr={dateStr}
        />
      ),
      widgetNotFound: () => {
        // Người dùng chưa thêm widget vào màn hình chính
      },
    });
  } catch (err) {
    // Không crash nếu đang chạy trên môi trường không hỗ trợ native widget (e.g. Expo Go)
    console.warn('[widgetSync] syncTodayWidget skip or error:', err.message);
  }
}

/**
 * Task handler xử lý các sự kiện nền của Widget (ví dụ: WIDGET_ADDED, WIDGET_UPDATE, WIDGET_RESIZED).
 */
export async function widgetTaskHandler(props) {
  const { widgetInfo, widgetAction } = props;
  if (widgetInfo.widgetName === 'TodayWidget') {
    switch (widgetAction) {
      case 'WIDGET_ADDED':
      case 'WIDGET_UPDATE':
      case 'WIDGET_RESIZED':
        props.renderWidget(
          <TodayWidget
            eventCount={0}
            overdueCount={0}
            dateStr={fmtDate(new Date())}
          />
        );
        break;
      default:
        break;
    }
  }
}
