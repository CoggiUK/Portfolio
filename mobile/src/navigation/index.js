import React, { useEffect, useRef } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import { colors, space, font } from '../theme';
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

const ICONS = {
  'Trang chủ': ['home', 'home-outline'],
  'Lịch': ['calendar', 'calendar-outline'],
  'Cá nhân': ['grid', 'grid-outline'],
  'Liên hệ': ['chatbubbles', 'chatbubbles-outline'],
  'Web': ['globe', 'globe-outline'],
};

function Tabs() {
  const { unreadLeads } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 66,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          elevation: 4,
          shadowColor: '#0F172A',
          shadowOpacity: 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', letterSpacing: 0.1, marginTop: 2 },
        tabBarBadgeStyle: {
          backgroundColor: colors.primary,
          color: colors.onPrimary,
          fontSize: 12,
          fontWeight: '700',
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          lineHeight: 18,
        },
        tabBarIcon: ({ focused, color }) => {
          const [on, off] = ICONS[route.name] || ICONS['Trang chủ'];
          return (
            <View style={s.tabIconWrap}>
              <Ionicons name={focused ? on : off} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Lịch" component={CalendarScreen} />
      <Tab.Screen name="Cá nhân" component={PersonalScreen} />
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
      <Image source={require('../../assets/logo-mark.png')} style={s.logo} resizeMode="contain" />
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
  logo: { width: 84, height: 84, marginBottom: space[5] },
  tabIconWrap: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
