import React, { useContext, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TextInput,
    ScrollView,
    Alert,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GasContext } from "../context/GasContext";

const AlertSettingsScreen = () => {
    const {
        batteryLowAlert,
        setBatteryLowAlert,
        gasLowAlert, setGasLowAlert,
        gasAlertEnabled,
        setGasAlertEnabled,
        batteryAlertEnabled,
        setBatteryAlertEnabled,
        gasThreshold,
        setGasThreshold,
        batteryThreshold,
        setBatteryThreshold,
    } = useContext(GasContext);

    // const [gasInput, setGasInput] = useState(gasThreshold);
    // const [batteryInput, setBatteryInput] = useState(
    //     batteryThreshold
    // );





   const saveSettings = async (settings) => {
    try {
        await AsyncStorage.setItem(
            "alertSettings",
            JSON.stringify(settings)
        );

      
    } catch (error) {
        console.log("Save Error:", error);

        Alert.alert(
            "Error",
            "Failed to save settings."
        );
    }
};
  const updateSettings = async (updates = {}) => {
    const settings = {
        gasLowAlert,
        batteryLowAlert,
        gasThreshold,
        batteryThreshold,
       
    };

    await saveSettings(settings);
};



    const OnBatteryLowAlert = async () => {

        try {

            const newValue = !batteryLowAlert;

            // UPDATE STATE
            setBatteryLowAlert(newValue);
            await updateSettings({
                batteryLowAlert: newValue,
            });


        } catch (error) {

            console.log(error);
        }
    };

    const OnGasLowAlert = async () => {

        try {

            const newValue = !gasLowAlert;

            setGasLowAlert(newValue);
            await updateSettings({
                gasLowAlert: newValue,
            });


        } catch (error) {

            console.log(error);
        }
    };

   const updateGasThreshold = async (value) => {
    const number = Number(value);

    if (isNaN(number)) {
        Alert.alert("Invalid Input", "Please enter a valid number.");
        return;
    }

    if (number < 1 || number > 100) {
        Alert.alert(
            "Invalid Percentage",
            "Gas threshold must be between 1 and 100."
        );
        return;
    }

    setGasThreshold(number);
};

   const updateBatteryThreshold = async (value) => {
    const number = Number(value);

    if (isNaN(number)) {
        Alert.alert("Invalid Input", "Please enter a valid number.");
        return;
    }

    if (number < 1 || number > 100) {
        Alert.alert(
            "Invalid Percentage",
            "Battery threshold must be between 1 and 100."
        );
        return;
    }

    setBatteryThreshold(number);
};



    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >


            {/* GAS ALERT */}

            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.title}>
                        Low Gas Alert
                    </Text>

                    <Switch
                        trackColor={{ false: '#767577', true: '#319149' }}
                        thumbColor={gasLowAlert ? '#0af002' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={OnGasLowAlert}
                        value={gasLowAlert}
                    />
                </View>

                <Text style={styles.description}>
                    Send notification when cylinder gas
                    falls below selected level.
                </Text>

                <Text style={styles.label}>
                    Alert Below (%)
                </Text>

                <TextInput
    value={String(gasThreshold)}
    onChangeText={updateGasThreshold}
    keyboardType="numeric"
    style={styles.input}
    editable={gasLowAlert}
/>
            </View>

            {/* BATTERY ALERT */}

            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.title}>
                        Low Battery Alert
                    </Text>

                    <Switch
                        trackColor={{ false: '#767577', true: '#319149' }}
                        thumbColor={batteryLowAlert ? '#0af002' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={OnBatteryLowAlert}
                        value={batteryLowAlert}

                    />
                </View>

                <Text style={styles.description}>
                    Send notification when battery
                    reaches critical level.
                </Text>

                <Text style={styles.label}>
                    Alert Below (%)
                </Text>

               <TextInput
    value={String(batteryThreshold)}
    onChangeText={updateBatteryThreshold}
    keyboardType="numeric"
    style={styles.input}
    editable={batteryLowAlert}
/>
            </View>


            <TouchableOpacity style={{ display: "flex", alignItems: "center" }}>
                <Text
                    style={styles.save}
                    onPress={updateSettings}
                >Save Settings</Text>
            </TouchableOpacity>


        </ScrollView>
    );
};

export default AlertSettingsScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
        flexGrow: 1,
        paddingBottom: 30,

    },

    heading: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 20,
        color: "#0f172a",
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#0f172a",
    },

    description: {
        marginTop: 10,
        color: "#64748b",
        lineHeight: 20,
    },

    label: {
        marginTop: 15,
        marginBottom: 6,
        color: "#334155",
        fontWeight: "500",
    },

    input: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#fff",
    },

    save: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "600",
        marginTop: 10,
        backgroundColor: "#000000",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: "#24c22c"

    },
});