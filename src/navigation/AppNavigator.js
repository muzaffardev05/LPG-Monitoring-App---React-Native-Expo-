import * as React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Ionicons from '@expo/vector-icons/Ionicons';

import Login from '../Home/Login';

import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import CylinderList from '../screens/CylinderList';
import CylinderDetails from '../screens/CylinderDetails';
import EditCylinder from '../components/EditCylinder';
import AddCylinder from '../components/AddCylinder';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// --------------------
// Bottom Tabs
// --------------------
function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: '#0f172a',
                tabBarInactiveTintColor: '#94A3B8',

                tabBarStyle: {
                    position: 'absolute',
                    bottom: 15,
                    left: 15,
                    right: 15,
                    elevation: 5,

                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    height: 70,

                    paddingBottom: 8,
                    paddingTop: 8,

                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },

                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    }
                    else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return (
                        <Ionicons
                            name={iconName}
                            size={focused ? 28 : 24}
                            color={color}
                        />
                    );
                },
            })}
        >


            <Tab.Screen name="Home" component={CylinderList} />
           
            <Tab.Screen name="Profile" component={Profile} />
            <Tab.Screen name="Settings" component={Settings} />




        </Tab.Navigator>
    );
}


// --------------------
// Root Stack
// --------------------
export function RootStack() {
    return (
      

        
        <Stack.Navigator initialRouteName="Login">

            {/* Welcome Screen */}
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />

            {/* Tabs */}
            
            <Stack.Screen
                name="MainTabs"
                component={BottomTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CylinderDetails"
                component={CylinderDetails}
                
            />

            <Stack.Screen
  name="EditCylinder"
  component={EditCylinder}
/>
            <Stack.Screen
  name="AddCylinder"
  component={AddCylinder}
/>

        </Stack.Navigator>
        
    );
}