import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


// SHOW banner when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});



// SETUP
export async function setupNotifications() {

  // Skip web
  if (Platform.OS === 'web') return;

  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    alert('Permission denied');
    return;
  }

  // Android channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alerts', {
      name: 'Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }
}



// LOW GAS ALERT
export async function sendLowGasAlert(gasLevel) {

  if (Platform.OS === 'web') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Low Gas Alert',
      body: `Gas level is low (${gasLevel}%)`,
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.MAX,
    },

    trigger: null,
  });
}



// LOW BATTERY ALERT
export async function sendLowBatteryAlert(batteryLevel) {

  if (Platform.OS === 'web') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔋 Low Battery Alert',
      body: `Battery level is low (${batteryLevel}%)`,
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.MAX,
    },

    trigger: null,
  });
}