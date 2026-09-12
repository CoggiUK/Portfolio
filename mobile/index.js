import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';


if (Platform.OS === 'android') {
  try {
    const { registerWidgetTaskHandler } = require('react-native-android-widget');
    if (typeof registerWidgetTaskHandler === 'function') {
      const { widgetTaskHandler } = require('./src/services/widgetSync');
      registerWidgetTaskHandler(widgetTaskHandler);
    }
  } catch (err) {
    console.warn('[index.js] Widget task handler init warning:', err?.message);
  }
}

registerRootComponent(App);

