import React, { useEffect, useRef } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, Platform, Pressable } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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
import AssistantScreen from '../screens/AssistantScreen';
import EventFormScreen from '../screens/EventFormScreen';
import ProjectFormScreen from '../screens/ProjectFormScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F97316',
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.border,
    notification: '#F97316',
  },
};

function CustomTabBar({ state, navigation }) {
  const { unreadLeads } = useApp();
  const currentRoute = state.routes[state.index]?.name;

  const navigateTab = (targetName) => {
    Haptics.selectionAsync().catch(() => {});
    navigation.navigate(targetName);
  };

  return (
    <View style={s.tabBarWrapper} pointerEvents="box-none">
      <View style={s.tabBarCard}>
        {/* Tab 1: KHÁCH HÀNG */}
        <Pressable onPress={() => navigateTab('Liên hệ')} style={s.tabItem}>
          <Ionicons
            name={currentRoute === 'Liên hệ' ? 'person' : 'person-outline'}
            size={22}
            color={currentRoute === 'Liên hệ' ? '#F97316' : '#64748B'}
          />
          <Text style={[s.tabLabel, currentRoute === 'Liên hệ' && s.tabLabelActive]}>
            KHÁCH HÀNG
          </Text>
          {unreadLeads ? <View style={s.badgeDot} /> : null}
        </Pressable>

        {/* Tab 2: LỊCH LÀM VIỆC */}
        <Pressable onPress={() => navigateTab('Lịch')} style={s.tabItem}>
          <Ionicons
            name={currentRoute === 'Lịch' ? 'calendar' : 'calendar-outline'}
            size={22}
            color={currentRoute === 'Lịch' ? '#F97316' : '#64748B'}
          />
          <Text style={[s.tabLabel, currentRoute === 'Lịch' && s.tabLabelActive]}>
            LỊCH LÀM VIỆC
          </Text>
        </Pressable>

        {/* Center Floating Logo Emblem Button */}
        <View style={s.centerLogoSlot} pointerEvents="box-none">
          <Pressable
            onPress={() => navigateTab('Trang chủ')}
            style={({ pressed }) => [
              s.centerLogoBtn,
              currentRoute === 'Trang chủ' && s.centerLogoBtnActive,
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
          >
            <Image
              source={require('../../assets/logo-mark.png')}
              style={s.centerLogoImage}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Tab 4: SẢN PHẨM */}
        <Pressable onPress={() => navigateTab('Cá nhân')} style={s.tabItem}>
          <Ionicons
            name={currentRoute === 'Cá nhân' ? 'cube' : 'cube-outline'}
            size={22}
            color={currentRoute === 'Cá nhân' ? '#F97316' : '#64748B'}
          />
          <Text style={[s.tabLabel, currentRoute === 'Cá nhân' && s.tabLabelActive]}>
            SẢN PHẨM
          </Text>
        </Pressable>

        {/* Tab 5: MENU */}
        <Pressable onPress={() => navigateTab('Web')} style={s.tabItem}>
          <Ionicons
            name={currentRoute === 'Web' ? 'apps' : 'apps-outline'}
            size={22}
            color={currentRoute === 'Web' ? '#F97316' : '#64748B'}
          />
          <Text style={[s.tabLabel, currentRoute === 'Web' && s.tabLabelActive]}>
            MENU
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Lịch" component={CalendarScreen} />
      <Tab.Screen name="Cá nhân" component={PersonalScreen} />
      <Tab.Screen name="Liên hệ" component={LeadsScreen} />
      <Tab.Screen name="Web" component={WebsiteScreen} />
    </Tab.Navigator>
  );
}

function Splash() {
  return (
    <View style={s.splash}>
      <Image source={require('../../assets/logo-mark.png')} style={s.logo} resizeMode="contain" />
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={[font.small, { color: colors.textMuted, marginTop: space[3], fontWeight: '600' }]}>
        Đang mở Tùng Lâm Workspace…
      </Text>
    </View>
  );
}

export default function RootNavigator() {
  const { user, initializing } = useAuth();
  const navRef = useRef(null);

  useEffect(() => {
    try {
      if (Notifications?.addNotificationResponseReceivedListener) {
        const sub = Notifications.addNotificationResponseReceivedListener((res) => {
          const data = res?.notification?.request?.content?.data || {};
          if (!navRef.current) return;
          if (data.kind === 'lead') navRef.current.navigate('Tabs', { screen: 'Liên hệ' });
          else if (data.kind === 'event-reminder') navRef.current.navigate('Tabs', { screen: 'Lịch' });
          else if (data.kind === 'habit-reminder') {
            navRef.current.navigate('Tabs', { screen: 'Cá nhân', params: { tab: 'habits' } });
          }
        });
        return () => sub?.remove?.();
      }
    } catch (err) {
      console.warn('[navigation] Notification response listener warning:', err);
    }
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
            <Stack.Screen name="Assistant" component={AssistantScreen} options={{ animation: 'slide_from_right' }} />
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
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    height: Platform.OS === 'ios' ? 84 : 68,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 3,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#F97316',
    fontWeight: '800',
  },
  badgeDot: {
    position: 'absolute',
    top: 0,
    right: 18,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  centerLogoSlot: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -34,
    zIndex: 20,
  },
  centerLogoBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#F97316',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  centerLogoBtnActive: {
    borderColor: '#EA580C',
    transform: [{ scale: 1.05 }],
  },
  centerLogoImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
});
