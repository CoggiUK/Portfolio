import React, { useState } from 'react';
import { View, Text, Linking } from 'react-native';
import { Screen, Header, Segmented, IconBtn, Row } from '../components/ui';
import { colors, space, font } from '../theme';
import { useApp } from '../contexts/AppContext';
import ProfilePane from './website/ProfilePane';
import ProjectsPane from './website/ProjectsPane';

const SITE_URL = 'https://tunglamng.web.app';

export default function WebsiteScreen({ navigation }) {
  const { site } = useApp();
  const [tab, setTab] = useState('profile');

  return (
    <Screen>
      <Header
        title="Quản trị website"
        subtitle={`${(site.projects || []).length} dự án đang hiển thị`}
        right={
          <Row>
            <IconBtn icon="open-outline" onPress={() => Linking.openURL(SITE_URL)} />
            <IconBtn icon="settings-outline" onPress={() => navigation.navigate('Settings')} />
          </Row>
        }
      />
      <View style={{ paddingHorizontal: space[4], paddingBottom: space[3] }}>
        <Segmented
          value={tab}
          onChange={setTab}
          items={[{ value: 'profile', label: 'Hồ sơ' }, { value: 'projects', label: 'Dự án' }]}
        />
        <Text style={[font.tiny, { color: colors.textMuted, marginTop: space[2] }]}>
          Mọi thay đổi lưu thẳng vào Firestore và hiện lên website ngay lập tức.
        </Text>
      </View>
      {tab === 'profile' ? <ProfilePane /> : <ProjectsPane navigation={navigation} />}
    </Screen>
  );
}
