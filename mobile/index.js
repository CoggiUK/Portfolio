import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';
import { widgetTaskHandler } from './src/services/widgetSync';

if (Platform.OS === 'android') {
  try {
    const { registerWidgetTaskHandler } = require('react-native-android-widget');
    registerWidgetTaskHandler(widgetTaskHandler);
  } catch (err) {
    // An toàn khi chạy trong Expo Go hoặc môi trường chưa prebuild
  }
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
