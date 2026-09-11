import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export interface TodayWidgetProps {
  eventCount?: number;
  overdueCount?: number;
  dateStr?: string;
}

export function TodayWidget({
  eventCount = 0,
  overdueCount = 0,
  dateStr = 'Hôm nay',
}: TodayWidgetProps) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#0F172A',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Header Widget */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <TextWidget
          text="TÙNG LÂM WORKSPACE"
          style={{
            color: '#38BDF8',
            fontSize: 11,
            fontWeight: 'bold',
          }}
        />
        <TextWidget
          text={dateStr}
          style={{
            color: '#94A3B8',
            fontSize: 11,
          }}
        />
      </FlexWidget>

      {/* Body: Thống kê số lượng */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: 'match_parent',
          marginVertical: 6,
        }}
      >
        <FlexWidget
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#1E293B',
            borderRadius: 12,
            paddingVertical: 8,
            paddingHorizontal: 12,
            flex: 1,
            marginRight: 6,
          }}
        >
          <TextWidget
            text={String(eventCount)}
            style={{
              color: '#F8FAFC',
              fontSize: 22,
              fontWeight: 'bold',
            }}
          />
          <TextWidget
            text="Lịch hẹn"
            style={{
              color: '#94A3B8',
              fontSize: 11,
            }}
          />
        </FlexWidget>

        <FlexWidget
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#1E293B',
            borderRadius: 12,
            paddingVertical: 8,
            paddingHorizontal: 12,
            flex: 1,
            marginLeft: 6,
          }}
        >
          <TextWidget
            text={String(overdueCount)}
            style={{
              color: overdueCount > 0 ? '#EF4444' : '#10B981',
              fontSize: 22,
              fontWeight: 'bold',
            }}
          />
          <TextWidget
            text={overdueCount > 0 ? 'Việc quá hạn' : 'Đúng hạn'}
            style={{
              color: '#94A3B8',
              fontSize: 11,
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Footer Widget */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <TextWidget
          text={
            eventCount > 0
              ? `Hôm nay: ${eventCount} lịch • ${overdueCount} việc quá hạn`
              : overdueCount > 0
              ? `Có ${overdueCount} việc cần hoàn thành sớm`
              : 'Mọi công việc đã sẵn sàng'
          }
          style={{
            color: '#CBD5E1',
            fontSize: 12,
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
