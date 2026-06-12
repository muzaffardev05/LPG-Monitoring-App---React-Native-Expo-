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
  FlatList,
  ActivityIndicator,
} from "react-native";

import { GasContext } from "../context/GasContext";
import { BLEContext } from "../context/BLEContext";

const AddCylinder = ({ navigation }) => {
  const { addCylinder } = useContext(GasContext);

  const {
    devices,
    scanDevices,
    connectDevice,
    isScanning,
  } = useContext(BLEContext);

  const [useBLE, setUseBLE] = useState(false);

  const [name, setName] = useState("");
  const [gasLevel, setGasLevel] = useState("");
  const [temperature, setTemperature] = useState("");
  const [batteryLevel, setBatteryLevel] = useState("");

  //---------------------------------------
  // Manual Cylinder
  //---------------------------------------

  const handleManualAdd = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Cylinder name is required");
      return;
    }

    const cylinder = {
      id: `cyl-${Date.now()}`,
      bleId: `cyl-${Date.now()}`,
      name: name.trim(),
      gasLevel: Number(gasLevel) || 0,
      batteryLevel: Number(batteryLevel) || 0,
      connected: true,
      temperature: Number(temperature) || 40,
      status: "Normal",
      isBLE: false,
      isVisible: true,
    };

    addCylinder(cylinder);
    navigation.goBack();
  };

  //---------------------------------------
  // BLE Cylinder
  //---------------------------------------

  const handleConnect = async (device) => {
    await connectDevice(device);

    const cylinder = {
      id: "cyl-" + Date.now(),

      bleId: device.id,

      name:
        device.name ||
        `Cylinder-${Date.now()}`,

      gasLevel: 80,

      batteryLevel: 95,

      connected: true,

      temperature: 40,

      status: "Normal",

      isBLE: true,

      isVisible: true,
    };

    addCylinder(cylinder);

    Alert.alert(
      "Success",
      "BLE Cylinder Connected"
    );

    navigation.goBack();
  };

  //---------------------------------------

  const renderDevice = ({ item }) => (
    <View style={styles.deviceCard}>
      <View>
        <Text style={styles.deviceName}>
          {item.name}
        </Text>

        <Text style={styles.deviceId}>
          {item.id}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.connectButton}
        onPress={() =>
          handleConnect(item)
        }
      >
        <Text style={styles.buttonText}>
          Connect
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.heading}>
        Add Cylinder
      </Text>

      <View style={styles.switchRow}>
        <Text style={styles.label}>
          Use BLE Device
        </Text>

        <Switch
          value={useBLE}
          onValueChange={setUseBLE}
        />
      </View>

      {!useBLE && (
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
            onPress={handleManualAdd}
          >
            <Text style={styles.buttonText}>
              Add Cylinder
            </Text>
          </TouchableOpacity>
        </>
      )}

      {useBLE && (
        <>
          <TouchableOpacity
            disabled={isScanning}
            style={[
              styles.scanButton,
              isScanning && styles.scanButtonScanning,
            ]}
            onPress={scanDevices}
          >
            <Text style={styles.buttonText}>
              Scan BLE Devices
            </Text>
          </TouchableOpacity>

          {isScanning && (
            <ActivityIndicator
              size="large"
              style={{
                marginVertical: 20,
              }}
            />
          )}

          <FlatList
            data={devices}
            keyExtractor={(item) =>
              item.id
            }
            renderItem={renderDevice}
            scrollEnabled={false}
            ListEmptyComponent={() =>
              !isScanning && (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 30,
                  }}
                >
                  No BLE Devices Found
                </Text>
              )
            }
          />
        </>
      )}
    </ScrollView>
  );
};

export default AddCylinder;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
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

  label: {
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  scanButton: {
    backgroundColor: "#059669",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,

  },
  scanButtonScanning: {
    backgroundColor: "#868282",
  },
  deviceCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  deviceId: {
    color: "#666",
    marginTop: 5,
    fontSize: 12,
  },

  connectButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});