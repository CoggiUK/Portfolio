import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Screen, Header, Segmented, IconBtn } from '../components/ui';
import { space } from '../theme';
import TasksPane from './personal/TasksPane';
import NotesPane from './personal/NotesPane';
import HabitsPane from './personal/HabitsPane';
import FinancePane from './personal/FinancePane';

const TABS = [
  { value: 'tasks', label: 'Việc', title: 'Công việc' },
  { value: 'notes', label: 'Ghi chú', title: 'Ghi chú' },
  { value: 'habits', label: 'Thói quen', title: 'Thói quen' },
  { value: 'finance', label: 'Chi tiêu', title: 'Chi tiêu' },
];

export default function PersonalScreen({ navigation, route }) {
  const [tab, setTab] = useState(route.params?.tab || 'tasks');

  // Điều hướng từ Dashboard có thể chỉ định thẳng module cần mở.
  useEffect(() => {
    if (route.params?.tab) setTab(route.params.tab);
  }, [route.params?.tab]);

  const meta = TABS.find((t) => t.value === tab);

  return (
    <Screen>
      <Header
        title={meta.title}
        subtitle="Không gian cá nhân"
        right={<IconBtn icon="settings-outline" onPress={() => navigation.navigate('Settings')} />}
      />
      <View style={{ paddingHorizontal: space[4], paddingBottom: space[3] }}>
        <Segmented items={TABS} value={tab} onChange={setTab} />
      </View>
      {tab === 'tasks' && <TasksPane />}
      {tab === 'notes' && <NotesPane />}
      {tab === 'habits' && <HabitsPane />}
      {tab === 'finance' && <FinancePane />}
    </Screen>
  );
}
