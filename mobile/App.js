import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { AppProvider } from './src/contexts/AppContext';
import { LockProvider } from './src/contexts/LockContext';
import AppLockGate from './src/components/AppLockGate';
import RootNavigator from './src/navigation';
import ErrorBoundary from './src/components/ErrorBoundary';
import { colors } from './src/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <ErrorBoundary>
          <AuthProvider>
            <AppProvider>
              <LockProvider>
                <AppLockGate>
                  <View style={{ flex: 1 }}>
                    <StatusBar style="dark" />
                    <RootNavigator />
                  </View>
                </AppLockGate>
              </LockProvider>
            </AppProvider>
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
