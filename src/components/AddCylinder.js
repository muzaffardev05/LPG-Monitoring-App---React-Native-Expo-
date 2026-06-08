import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import { GasContext } from "../context/GasContext";

const AddCylinder = ({ navigation }) => {
  const { addCylinder } = useContext(GasContext);

  const [useBLE, setUseBLE] = useState(false);

  const [name, setName] = useState("");
  const [gasLevel, setGasLevel] = useState("");
  const [temperature, setTemperature] = useState("");
  const [batteryLevel, setBatteryLevel] = useState("");

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Cylinder name is required");
      return;
    }

    const cylinder = {
      id: Date.now(), // random unique id
      name: name.trim(),
      gasLevel: Number(gasLevel) || 0,
      temperature: Number(temperature) || 0,
      batteryLevel: Number(batteryLevel) || 0,
      isVisible: true,
      status:
        Number(gasLevel) < 20
          ? "Low Gas"
          : "Normal",
    };

    addCylinder(cylinder);

    navigation.goBack();
  };

  const handleBLEConnect = () => {
    Alert.alert(
      "BLE",
      "BLE device scanning will be implemented here."
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        Add Cylinder
      </Text>

      <View style={styles.switchRow}>
        <Text>Use BLE Device</Text>

        <Switch
          value={useBLE}
          onValueChange={setUseBLE}
        />
      </View>

      {!useBLE ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Cylinder Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Gas Level (%)"
            keyboardType="numeric"
            value={gasLevel}
            onChangeText={setGasLevel}
          />

          <TextInput
            style={styles.input}
            placeholder="Temperature"
            keyboardType="numeric"
            value={temperature}
            onChangeText={setTemperature}
          />

          <TextInput
            style={styles.input}
            placeholder="Battery Level (%)"
            keyboardType="numeric"
            value={batteryLevel}
            onChangeText={setBatteryLevel}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleAdd}
          >
            <Text style={styles.buttonText}>
              Add Cylinder
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.bleButton}
            onPress={handleBLEConnect}
          >
            <Text style={styles.buttonText}>
              Connect BLE Device
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default AddCylinder;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  bleButton: {
    backgroundColor: "#059669",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});