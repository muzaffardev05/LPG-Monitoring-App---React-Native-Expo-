import { View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from "react";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { useContext } from "react";
import { GasContext } from "../context/GasContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
const Alarm = () => {
    const { gasLowAlert, setGasLowAlert, batteryLowAlert, setBatteryLowAlert } = useContext(GasContext)



    const OnGasLowAlert = async () => {

        try {

            const newValue = !gasLowAlert;

            setGasLowAlert(newValue);

            if (newValue) {

                // SAVE TRUE
                await AsyncStorage.setItem(
                    "gasLowAlert",
                    JSON.stringify(true)
                );

            } else {

                // REMOVE
                await AsyncStorage.removeItem(
                    "gasLowAlert"
                );
            }

        } catch (error) {

            console.log(error);
        }
    };




   
    const OnBatteryLowAlert = async () => {

        try {

            const newValue = !batteryLowAlert;

            // UPDATE STATE
            setBatteryLowAlert(newValue);

            if (newValue) {

                await AsyncStorage.setItem(
                    "batteryLowAlert",
                    JSON.stringify(true)
                );

            } else {

                await AsyncStorage.removeItem(
                    "batteryLowAlert"
                );
            }

        } catch (error) {

            console.log(error);
        }
    };

    return (
        <>

            <View style={{ display: "flex", flexDirection: "row", gap: 14, alignItems: "center" }}>
                <TouchableOpacity onPress={OnGasLowAlert} style={{ backgroundColor: "#0f172a", color: "#ffffff", padding: 16, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <MaterialIcons
                        name="notification-important"
                        size={24}
                        color={gasLowAlert ? '#0df020' : '#ffff'}
                    />
                    <Text style={{ color: "#ffff" }}>Low Gas </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={OnBatteryLowAlert} style={{ backgroundColor: "#0f172a", color: "#ffffff", padding: 16, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <MaterialIcons
                        name="notification-important"
                        size={24}
                        color={batteryLowAlert ? '#0df020' : '#ffff'}
                    />
                    <Text style={{ color: "#ffff" }}>Low Battery</Text>
                </TouchableOpacity>

            </View>
        </>
    )
}


export default Alarm;