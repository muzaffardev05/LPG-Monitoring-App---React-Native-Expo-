import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-web';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Level from './Level';
import Temp from './Temp';
import Alarm from './Alarm';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
    const [activeScreen, setActiveScreen] = useState('level');
   
    const renderContent = () => {
        switch (activeScreen) {
            case 'level':
                return <Level level="52" style={styles.content}></Level>;

            case 'temp':
                return <Temp currentTemp={13} maxTemp={40} />;

            case 'alarm':
                return <Alarm />;



            default:
                return null;
        }
    };

    return (


        <View style={styles.container}>

            {/* Buttons */}
            <SafeAreaView>

           
            <View style={styles.buttonContainer}>

                {/* Gas Level */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        activeScreen === 'level' && styles.activeButton,
                    ]}
                    onPress={() => setActiveScreen('level')}
                >
                    <MaterialCommunityIcons
                        name="gas-cylinder"
                        size={24}
                        color={activeScreen === 'level' ? '#fff' : '#000'}
                    />
                </TouchableOpacity>

                {/* Temperature */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        activeScreen === 'temp' && styles.activeButton,
                    ]}
                    onPress={() => setActiveScreen('temp')}
                >
                    <MaterialCommunityIcons
                        name="temperature-celsius"
                        size={24}
                        color={activeScreen === 'temp' ? '#fff' : '#000'}
                    />
                </TouchableOpacity>

                {/* Alarm */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        activeScreen === 'alarm' && styles.activeButton,
                    ]}
                    onPress={() => setActiveScreen('alarm')}
                >
                    <MaterialIcons
                        name="notification-important"
                        size={24}
                        color={activeScreen === 'alarm' ? '#fff' : '#000'}
                    />
                </TouchableOpacity>



            </View>
 </SafeAreaView>
            <View style={{ display: "flex", justifyContent: "center", alignItems: 'center', marginTop: 6 }}>
                <View style={styles.content}>
                    <Text style={{ color: '#ffff', fontSize: 20, }}>{activeScreen}</Text>
                    
                </View>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                {renderContent()}
            </View>

        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
    },

    button: {
        backgroundColor: '#d1d5db',
        padding: 12,
        borderRadius: 12,
    },

    activeButton: {
        backgroundColor: '#0f172a',
    },

    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    content: {

        fontWeight: 'bold',

        color: "#ffff",
        backgroundColor: "#0f172a",
        textTransform: 'capitalize',
        height: 40,
        width: 220,
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"




    },
});