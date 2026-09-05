import React, { useEffect, useRef } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';

import { colors, space, radius, font } from '../theme';
import TabBar, { CENTER_ROUTE } from '../components/TabBar';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import PersonalScreen from '../screens/PersonalScreen';
import LeadsScreen from '../screens/LeadsScreen';
import WebsiteScreen from '../screens/WebsiteScreen';
import EventFormScreen from '../screens/EventFormScreen';
import ProjectFormScreen from '../screens/ProjectFormScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

/**
 * 4 tab hai bên + nút logo thương hiệu nổi ở giữa dẫn về Trang chủ.
 * Thứ tự route quyết định vị trí hiển thị: 2 tab trái · logo · 2 tab phải.
 */
function Tabs() {
  const { unreadLeads } = useApp();
  return (
    <Tab.Navigator
      initialRouteName={CENTER_ROUTE}
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
    >
      <Tab.Screen name="Lịch" component={CalendarScreen} />
      <Tab.Screen name="Cá nhân" component={PersonalScreen} />
      <Tab.Screen name={CENTER_ROUTE} component={HomeScreen} />
      <Tab.Screen
        name="Liên hệ"
        component={LeadsScreen}
        options={{ tabBarBadge: unreadLeads || undefined }}
      />
      <Tab.Screen name="Web" component={WebsiteScreen} />
    </Tab.Navigator>
  );
}

function Splash() {
  return (
    <View style={s.splash}>
      <LinearGradient
        colors={[colors.brandFrom, 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.7 }}
      />
      <View style={s.splashLogo}>
        <Image source={require('../../assets/logo-mark.png')} style={s.logo} resizeMode="contain" />
      </View>
      <ActivityIndicator color={colors.primary} />
      <Text style={[font.small, { color: colors.textMuted, marginTop: space[3] }]}>Đang mở workspace…</Text>
    </View>
  );
}

export default function RootNavigator() {
  const { user, initializing } = useAuth();
  const navRef = useRef(null);

  // Chạm vào thông báo → mở đúng màn hình liên quan.
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((res) => {
      const data = res.notification.request.content.data || {};
      if (!navRef.current) return;
      if (data.kind === 'lead') navRef.current.navigate('Tabs', { screen: 'Liên hệ' });
      else if (data.kind === 'event-reminder') navRef.current.navigate('Tabs', { screen: 'Lịch' });
      else if (data.kind === 'habit-reminder') {
        navRef.current.navigate('Tabs', { screen: 'Cá nhân', params: { tab: 'habits' } });
      }
    });
    return () => sub.remove();
  }, []);

  if (initializing) return <Splash />;

  return (
    <NavigationContainer theme={navTheme} ref={navRef}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        {user ? (
          <>
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="EventForm" component={EventFormScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="ProjectForm" component={ProjectFormScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  splash: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  splashLogo: {
    width: 96, height: 96, borderRadius: radius['2xl'],
    alignItems: 'center', justifyContent: 'center', marginBottom: space[5],
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  logo: { width: 60, height: 60 },
});
