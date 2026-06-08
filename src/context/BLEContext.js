import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { Buffer } from "buffer";

export const BLEContext = createContext();
import { GasContext } from "./GasContext";
export const BLEProvider = ({ children }) => {


  const { updateCylinderFromBLE, cylinders, disconnectCylinder } =
    useContext(GasContext);
  const managerRef = useRef(null);
  const reconnectedRef =
    useRef(false);
  const [devices, setDevices] = useState([]);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [deviceData, setDeviceData] = useState({});
  const [isScanning, setIsScanning] = useState(false);

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
    if (
      cylinders.length > 0 &&
      !reconnectedRef.current
    ) {
      reconnectedRef.current = true;

      reconnectBLEDevices();
    }
  }, [cylinders]);
  const reconnectBLEDevices =
    async () => {
      const manager =
        managerRef.current;

      if (!manager) return;

      const bleCylinders =
        cylinders.filter(
          (item) =>
            item.isBLE &&
            item.bleId
        );

      for (const cylinder of bleCylinders) {
        try {
          const device =
            await manager.connectToDevice(
              cylinder.bleId
            );

          await device.discoverAllServicesAndCharacteristics();

          monitorGasData(device);

          console.log(
            "Reconnected:",
            cylinder.name
          );
        } catch (error) {
          console.log(
            "Reconnect Failed:",
            cylinder.name
          );

          disconnectCylinder(
            cylinder.bleId
          );
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
    try {
      const connected = await device.connect();

      await connected.discoverAllServicesAndCharacteristics();

      setConnectedDevices((prev) => {
        const exists = prev.find(
          (d) =>
            d.id === connectedDevice.id
        );

        if (exists) return prev;

        return [
          ...prev,
          connectedDevice,
        ];
      });

      connectedDevice.onDisconnected(
  (error, device) => {
    disconnectCylinder(
      device?.id
    );
  }
);

      monitorGasData(connected);

      onConnected(connected);
    } catch (e) {
      console.log("Connect Error", e);
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

  /*
      Replace these UUIDs
  */

  const SERVICE_UUID = "YOUR_SERVICE_UUID";

  const CHARACTERISTIC_UUID =
    "YOUR_CHARACTERISTIC_UUID";

  const monitorGasData = (device) => {
    const SERVICE_UUID = "YOUR_SERVICE_UUID";
    const CHARACTERISTIC_UUID =
      "YOUR_CHARACTERISTIC_UUID";

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

        scanDevices,
        stopScan,

        connectDevice,
        disconnectDevice,
      }}
    >
      {children}
    </BLEContext.Provider>
  );
};