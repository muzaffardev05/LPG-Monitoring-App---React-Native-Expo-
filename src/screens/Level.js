import React, { useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { GasContext } from '../context/GasContext';
const Level = () => {
    const heightAnim = useRef(new Animated.Value(0)).current;
    const { gasLevel } = useContext(GasContext);

    useEffect(() => {
        Animated.timing(heightAnim, {
            toValue: gasLevel,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [gasLevel]);

    const getLevelColor = () => {
        if (gasLevel > 60) return '#4caf50';
        if (gasLevel > 20) return '#ffc107';
        return '#f44336';
    };

    return (
        <TouchableOpacity style={styles.card} >
            <View style={styles.imageContainer}>
               
                <Image
                    style={styles.image}
                    source={require('../../assets/cylinder.png')}
                />

                <View style={styles.verticalBarBackground}>
                    <Animated.View
                        style={[
                            styles.verticalBarFill,
                            {
                                height: heightAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%'],
                                }),
                                backgroundColor: getLevelColor(),
                            },
                        ]}
                    />
                </View>
            </View>
            <Text style={styles.levelText}> <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{gasLevel}</Text>% Remaining</Text>
        </TouchableOpacity>
    );
};

export default Level;

const styles = StyleSheet.create({
    card: {
        display: 'flex',
        gap: 1,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageContainer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 280,
        height: 300,

    },
    verticalBarBackground: {
        position: 'absolute',
        width: 20,
        height: '45%',
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        bottom: '20%',
        left: '48%',
        overflow: 'hidden',
    },
    verticalBarFill: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderRadius: 10,
    },
    levelText: {

        fontSize: 14,
        fontWeight: 600,
        color: '#000000',
        textAlign: 'center',
        marginBottom:40
    },
});