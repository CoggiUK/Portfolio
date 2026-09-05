import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Screen, BrandHeader, Segmented } from '../components/ui';
import { space } from '../theme';
import TasksPane from './personal/TasksPane';
import NotesPane from './personal/NotesPane';
import HabitsPane from './personal/HabitsPane';
import FinancePane from './personal/FinancePane';

const TABS = [
  { value: 'tasks', label: 'Việc', title: 'Công việc', icon: 'checkbox' },
  { value: 'notes', label: 'Ghi chú', title: 'Ghi chú', icon: 'reader' },
  { value: 'habits', label: 'Thói quen', title: 'Thói quen', icon: 'leaf' },
  { value: 'finance', label: 'Chi tiêu', title: 'Chi tiêu', icon: 'wallet' },
];

export default function PersonalScreen({ navigation, route }) {
  const [tab, setTab] = useState(route.params?.tab || 'tasks');
  const [createTarget, setCreateTarget] = useState(
    route.params?.create ? { tab: route.params.tab || 'tasks', id: Date.now() } : null
  );

  // Điều hướng từ Dashboard có thể chỉ định thẳng module cần mở.
  useEffect(() => {
    if (route.params?.tab) setTab(route.params.tab);
    if (route.params?.create) {
      setCreateTarget({ tab: route.params.tab || 'tasks', id: Date.now() });
      navigation.setParams({ create: undefined });
    }
  }, [route.params?.tab, route.params?.create, navigation]);

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    setCreateTarget(null);
  };

  const meta = TABS.find((t) => t.value === tab);

  return (
    <Screen edges={[]}>
      <BrandHeader
        icon={meta.icon}
        title={meta.title}
        subtitle="Không gian cá nhân"
        actions={[{ icon: 'settings-outline', label: 'Cài đặt', onPress: () => navigation.navigate('Settings') }]}
      />
      <View style={{ paddingHorizontal: space[4], paddingTop: space[4], paddingBottom: space[3] }}>
        <Segmented items={TABS} value={tab} onChange={handleTabChange} />
      </View>
      {tab === 'tasks' && <TasksPane initialCreate={createTarget?.tab === 'tasks' ? createTarget.id : 0} />}
      {tab === 'notes' && <NotesPane />}
      {tab === 'habits' && <HabitsPane initialCreate={createTarget?.tab === 'habits' ? createTarget.id : 0} />}
      {tab === 'finance' && <FinancePane initialCreate={createTarget?.tab === 'finance' ? createTarget.id : 0} />}
    </Screen>
  );
}
