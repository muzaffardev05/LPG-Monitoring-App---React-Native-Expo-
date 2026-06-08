





import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-web';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Level from './Level';
import Temp from './Temp';
import Alarm from './Alarm';
import { SafeAreaView } from 'react-native-safe-area-context';



const CylinderDetails = ({ route }) => {
    const [activeScreen, setActiveScreen] = useState('level');
    const { cylinder } = route.params;

    const renderContent = () => {
        switch (activeScreen) {
            case 'level':
                return <Level level={cylinder.gasLevel} />;

            case 'temp':
                return <Temp currentTemp={cylinder.temperature} maxTemp={40} />;




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
            {/* Bottom Cylinder Info */}
            <View style={styles.bottomCard}>
                <MaterialCommunityIcons
                    name="gas-cylinder"
                    size={26}
                    color="#0f172a"
                />

                <View style={{ marginLeft: 10 }}>

                    <Text style={styles.bottomTitle}>
                        {cylinder.name || `Cylinder ${cylinder.id}`}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default CylinderDetails;

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
    bottomCard: {
        position: 'absolute',
        bottom: 14,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingVertical: 4,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',

        // Shadow (iOS)
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,

        // Shadow (Android)
        elevation: 8,
    },

    bottomLabel: {
        fontSize: 12,
        color: '#506075',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    bottomTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
});