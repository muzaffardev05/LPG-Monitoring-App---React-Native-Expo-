import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStack } from './navigation/AppNavigator';
import  GasProvider  from './context/GasProvider';

export default function App() {
  return (
<SafeAreaProvider>


    <GasProvider>
      <NavigationContainer>
        <RootStack />
        <StatusBar style="auto" />
      </NavigationContainer>
    </GasProvider>
</SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});