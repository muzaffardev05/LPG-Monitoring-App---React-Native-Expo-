import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { Platform, PermissionsAndroid, Alert } from "react-native";
import { Buffer } from "buffer";

export const BLEContext = createContext();
import { GasContext } from "./GasContext";
export const BLEProvider = ({ children }) => {


  const {
    updateCylinderFromBLE,
    cylinders,
    cylindersLoaded,
    disconnectCylinder,
  } = useContext(GasContext);
  const managerRef = useRef(null);
  const reconnectedRef =
    useRef(false);
  const [devices, setDevices] = useState([]);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [deviceData, setDeviceData] = useState({});
  const [isScanning, setIsScanning] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState(null);
  useEffect(() => {
    if (Platform.OS !== "web") {
      const { BleManager } = require("react-native-ble-plx");
      managerRef.current = new BleManager();
    }

    return () => {
      managerRef.current?.destroy();
    };
  }, []);



  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!cylindersLoaded) return;

    if (
      cylinders.length > 0 &&
      !reconnectedRef.current
    ) {
      reconnectedRef.current = true;

      reconnectBLEDevices();
    }
  }, [cylinders, cylindersLoaded]);

  const reconnectBLEDevices = async () => {
    const bleCylinders = cylinders.filter(
      (item) =>  item.bleId  && item.isVisible
    );

    console.log(bleCylinders);
    for (const cylinder of bleCylinders) {
      try {
        await connectById(cylinder.bleId);

        console.log(
          "Reconnected:",
          cylinder.name
        );
      } catch {
       
        disconnectCylinder(cylinder.bleId);
      }
    }
  };


  const requestPermissions = async () => {
    if (Platform.OS !== "android") return true;

    try {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      return (
        result["android.permission.BLUETOOTH_SCAN"] === "granted" &&
        result["android.permission.BLUETOOTH_CONNECT"] === "granted"
      );
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const scanDevices = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'BLE Unavailable',
        'Bluetooth scanning is not supported on web.'
      );
      return;
    }

    const granted = await requestPermissions();

    if (!granted) {
      return;
    }

    const manager = managerRef.current;

    if (!manager) {
      return;
    }

    setDevices([]);
    setIsScanning(true);

    const foundDevices = [];

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        setIsScanning(false);
        return;
      }

      if (!device?.name) return;

      const exists = foundDevices.find(
        (item) => item.id === device.id
      );

      if (!exists) {
        foundDevices.push(device);
        setDevices([...foundDevices]);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 8000);
  };

  const stopScan = () => {
    managerRef.current?.stopDeviceScan();
    setIsScanning(false);
  };

  const connectDevice = async (
    device,
    onConnected = () => { }
  ) => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'BLE Unavailable',
        'Bluetooth connections are not supported on web.'
      );
      return;
    }

    try {
      setConnectingDeviceId(device.id);

      const connectedDevice = await device.connect();

      await connectedDevice.discoverAllServicesAndCharacteristics();

      setConnectedDevices((prev) => {
        const exists = prev.find(
          (d) => d.id === connectedDevice.id
        );

        if (exists) {
          return prev;
        }

        return [...prev, connectedDevice];
      });

      connectedDevice.onDisconnected(
        (error, disconnectedDevice) => {
          disconnectCylinder(disconnectedDevice?.id);

          setConnectedDevices((prev) =>
            prev.filter(
              (item) =>
                item.id !== disconnectedDevice?.id
            )
          );
        }
      );

      monitorGasData(connectedDevice);

      onConnected(connectedDevice);
    } catch (e) {
      console.log("Connect Error", e);
    } finally {
      setConnectingDeviceId(null);
    }
  };

  const connectById = async (
    bleId,
    onConnected = () => { }
  ) => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'BLE Unavailable',
        'Bluetooth connections are not supported on web.'
      );
      return;
    }

    try {
      setConnectingDeviceId(bleId);

      const manager = managerRef.current;
      if (!manager) {
        throw new Error('BLE manager unavailable');
      }

      const connectedDevice =
        await manager.connectToDevice(bleId);

      await connectedDevice.discoverAllServicesAndCharacteristics();

      setConnectedDevices((prev) => {
        const exists = prev.find(
          (d) => d.id === connectedDevice.id
        );

        if (exists) return prev;

        return [...prev, connectedDevice];
      });

      connectedDevice.onDisconnected(
        (error, disconnectedDevice) => {
          disconnectCylinder(disconnectedDevice?.id);

          setConnectedDevices((prev) =>
            prev.filter(
              (item) =>
                item.id !== disconnectedDevice?.id
            )
          );
        }
      );

      monitorGasData(connectedDevice);

      onConnected(connectedDevice);
    } catch (e) {
      console.log(e);
       disconnectCylinder(bleId);

     
    } finally {
      setConnectingDeviceId(null);
    }
  };


  const disconnectDevice = async (deviceId) => {
    try {
      await managerRef.current.cancelDeviceConnection(
        deviceId
      );

      setConnectedDevices((prev) =>
        prev.filter((item) => item.id !== deviceId)
      );
    } catch (e) {
      console.log(e);
    }
  };


  // const getDeviceById = (id) => {
  //   return devices.find((d) => d.id === id);
  // };

  /*
      Replace these UUIDs
  */

  const SERVICE_UUID = "YOUR_SERVICE_UUID";
  const CHARACTERISTIC_UUID = "YOUR_CHARACTERISTIC_UUID";

  const monitorGasData = (device) => {
    if (
      SERVICE_UUID === "YOUR_SERVICE_UUID" ||
      CHARACTERISTIC_UUID === "YOUR_CHARACTERISTIC_UUID"
    ) {
      console.warn(
        "BLE service/characteristic UUIDs are placeholders; update BLEContext.js before using BLE monitoring."
      );
      return;
    }

    device.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          console.log(
            "Monitor Error:",
            error
          );

          disconnectCylinder(device.id);

          return;
        }

        try {
          if (!characteristic?.value) return;

          const decoded = Buffer.from(
            characteristic.value,
            "base64"
          ).toString();

          const data = JSON.parse(decoded);

          updateCylinderFromBLE(
            device.id,
            data
          );

        } catch (e) {
          console.log(
            "Decode Error:",
            e
          );
        }
      }
    );
  };





  return (
    <BLEContext.Provider
      value={{
        devices,
        connectedDevices,
        deviceData,
        isScanning,
        connectingDeviceId,
        scanDevices,
        stopScan,

        connectDevice,
        connectById,
        disconnectDevice,
      }}
    >
      {children}
    </BLEContext.Provider>
  );
};