import React from 'react';
import { LogBox, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
} from '@expo-google-fonts/be-vietnam-pro';
import { AuthProvider } from './src/contexts/AuthContext';
import { AppProvider } from './src/contexts/AppContext';
import RootNavigator from './src/navigation';
import ErrorBoundary from './src/components/ErrorBoundary';
import { colors } from './src/theme';

LogBox.ignoreLogs([
  'expo-notifications: Custom sound',
  'Cannot connect to Expo CLI',
  '@firebase/firestore',
  'Tried to register two views with the same name',
]);

export default function App() {
  // Toàn bộ thang chữ trỏ tới Be Vietnam Pro nên phải chờ font nạp xong,
  // nếu không màn đầu tiên sẽ nhấp nháy bằng font hệ thống rồi mới đổi.
  const [fontsLoaded, fontError] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {fontsLoaded || fontError ? (
          <AuthProvider>
            <AppProvider>
              <ErrorBoundary>
                <RootNavigator />
              </ErrorBoundary>
            </AppProvider>
          </AuthProvider>
        ) : (
          <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
