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



export async function sendLowGasAlert(cylinderName, gasLevel) {
  if (Platform.OS === 'web') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚠️ Low Gas Alert',
      body: `${cylinderName} gas level is low (${gasLevel}%)`,
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null,
  });
}

export async function sendLowBatteryAlert(cylinderName, batteryLevel) {
  if (Platform.OS === 'web') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔋 Low Battery Alert',
      body: `${cylinderName} battery level is low (${batteryLevel}%)`,
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null,
  });
}