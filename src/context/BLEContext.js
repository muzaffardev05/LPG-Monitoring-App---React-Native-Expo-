import React, { createContext, useState, useEffect, useRef } from "react";
import { PermissionsAndroid, Platform } from "react-native";

export const BLEContext = createContext();

export const BLEProvider = ({ children }) => {
  const managerRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [connectedDevices, setConnectedDevices] = useState([]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      const { BleManager } = require("react-native-ble-plx");
      managerRef.current = new BleManager();
    }

    return () => {
      managerRef.current?.destroy();
    };
  }, []);

  // Android permissions
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
      } catch (error) {
        console.log("Permission Error:", error);
      }
    }
  };

  // Scan BLE devices
  const scanDevices = async () => {
    if (Platform.OS === "web") {
      console.log("BLE is not supported on Web");
      return;
    }

    await requestPermissions();

    const manager = managerRef.current;

    if (!manager) {
      console.log("BLE Manager not initialized");
      return;
    }

    const scannedDevices = [];

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan Error:", error);
        return;
      }

      if (
        device?.name &&
        !scannedDevices.some((d) => d.id === device.id)
      ) {
        scannedDevices.push(device);
        setDevices([...scannedDevices]);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
    }, 5000);
  };

  // Connect device
  const connectDevice = async (device) => {
    try {
      const connectedDevice = await device.connect();

      await connectedDevice.discoverAllServicesAndCharacteristics();

      setConnectedDevices((prev) => [...prev, connectedDevice]);

      console.log("Connected:", connectedDevice.name);

      monitorGasData(connectedDevice);
    } catch (error) {
      console.log("Connection Error:", error);
    }
  };

  // Monitor gas data
  const monitorGasData = (device) => {
    const SERVICE_UUID = "YOUR_SERVICE_UUID";
    const CHARACTERISTIC_UUID = "YOUR_CHARACTERISTIC_UUID";

    device.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          console.log("Monitor Error:", error);
          return;
        }

        const value = characteristic?.value;

        console.log("Gas Data:", value);

        // Update your gas state here
      }
    );
  };

  return (
    <BLEContext.Provider
      value={{
        devices,
        connectedDevices,
        scanDevices,
        connectDevice,
      }}
    >
      {children}
    </BLEContext.Provider>
  );
};