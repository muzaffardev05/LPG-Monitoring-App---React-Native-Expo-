import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStack } from './navigation/AppNavigator';
import  GasProvider  from './context/GasProvider';
import { BLEProvider } from './context/BLEContext';
export default function App() {
  return (
<SafeAreaProvider>




    <GasProvider>
      <BLEProvider>
      <NavigationContainer>
        <RootStack  />
        <StatusBar style="auto" />
      </NavigationContainer>
      </BLEProvider>
    </GasProvider>
    
</SafeAreaProvider>
  );
}

