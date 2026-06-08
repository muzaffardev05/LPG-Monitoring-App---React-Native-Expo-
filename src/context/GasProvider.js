import React, { useState, useEffect, useRef } from 'react';
import { GasContext } from './GasContext';
import {
  setupNotifications,
  sendLowGasAlert,
  sendLowBatteryAlert,
} from '../utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GasProvider = ({ children }) => {

  const [gasLevel, setGasLevel] = useState(60);
  const [batteryLevel, setBatteryLevel] = useState(63);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(21);
  const [maxTemp, setMaxTemp] = useState(65);

  const [user, setUser] = useState(null);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);


  const [gasLowAlert, setGasLowAlert] = useState(false);
  const [batteryLowAlert, setBatteryLowAlert] = useState(false);
  const [userAllowGasAlert, setUserAllowGasAlert] = useState(false);
  const [userAllowBatteryAlert, setUserAllowBatteryAlert] = useState(false);






  const [gasAlertEnabled, setGasAlertEnabled] = useState(false)
  const [batteryAlertEnabled, setbatteryAlertEnabled] = useState(false)
  const [gasThreshold, setGasThreshold] = useState(15)
  const [batteryThreshold, setBatteryThreshold] = useState(6)
const CYLINDERS_KEY = `cylinders_${user?.id}`;
  const [cylinders, setCylinders] = useState([
    {
      id: "cyl-001",
      name: "Kitchen Cylinder",
      gasLevel: 80,
      batteryLevel: 95,
      connected: true,
      temperature: 40,
      status: "Normal",
      isVisible: true,

    },
    {
      id: "cyl-002",
      name: "Backup Cylinder",
      gasLevel: 10,
      batteryLevel: 48,
      connected: true,
      temperature: 12,
      status: "Low Gas",
      isVisible: true,
    }
  ]);

const gasAlertSent = useRef({});
const batteryAlertSent = useRef({});
  useEffect(() => {
    setupNotifications();
  }, []);

  // LOAD USERS + LOGIN SESSION
  useEffect(() => {

    loadUsers();
    loadSession();
    loadAlerts();
    loadAlertSettings();
    loadCylinders()

  }, []);





  useEffect(() => {

  cylinders.forEach(cylinder => {

    // GAS ALERT
    if (gasLowAlert) {

      if (
        cylinder.gasLevel <= gasThreshold &&
        !gasAlertSent.current[cylinder.id]
      ) {

        sendLowGasAlert(
          cylinder.name,
          cylinder.gasLevel
        );

        gasAlertSent.current[cylinder.id] = true;
      }

      if (cylinder.gasLevel > gasThreshold) {
        gasAlertSent.current[cylinder.id] = false;
      }
    }

    // BATTERY ALERT
    if (batteryLowAlert) {

      if (
        cylinder.batteryLevel <= batteryThreshold &&
        !batteryAlertSent.current[cylinder.id]
      ) {

        sendLowBatteryAlert(
          cylinder.name,
          cylinder.batteryLevel
        );

        batteryAlertSent.current[cylinder.id] = true;
      }

      if (cylinder.batteryLevel > batteryThreshold) {
        batteryAlertSent.current[cylinder.id] = false;
      }
    }

  });

}, [
  cylinders,
  gasLowAlert,
  batteryLowAlert,
  gasThreshold,
  batteryThreshold
]);

useEffect(() => {
  saveCylinders();
}, [cylinders]);

useEffect(() => {
  if (user) {
    loadCylinders();
  }
}, [user]);
const saveCylinders = async () => {
  if (!user) return;

  await AsyncStorage.setItem(
    `cylinders_${user.id}`,
    JSON.stringify(cylinders)
  );
};
  // LOAD REGISTERED USERS
  const loadUsers = async () => {

    try {

      const storedUsers = await AsyncStorage.getItem("users");

      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }

    } catch (error) {

      console.log("Load Users Error:", error);

    }
  };

  // LOAD LOGGED IN USER
  const loadSession = async () => {

    try {

      const session = await AsyncStorage.getItem("currentUser");

      if (session) {

        setUser(JSON.parse(session));

      }

    } catch (error) {

      console.log("Session Error:", error);

    } finally {

      setLoading(false);

    }
  };

  //load alerts

  const loadAlertSettings = async () => {
    try {
      const [alertSettings] = await Promise.all([
        AsyncStorage.getItem("alertSettings"),
      ]);

      const newsettings = (JSON.parse(alertSettings));


      if (alertSettings) {
        setGasLowAlert(newsettings.gasLowAlert);
        setBatteryLowAlert(newsettings.batteryLowAlert);
        setGasThreshold(newsettings.gasThreshold)
        setBatteryThreshold(newsettings.batteryThreshold)
      }


    } catch (error) {
      console.log("Session Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const [gasLowAlert, batteryLowAlert] = await Promise.all([
        AsyncStorage.getItem("gasLowAlert"),
        AsyncStorage.getItem("batteryLowAlert"),
      ]);

      if (gasLowAlert) {
        setGasLowAlert(JSON.parse(gasLowAlert));
      }

      if (batteryLowAlert) {
        setBatteryLowAlert(JSON.parse(batteryLowAlert));
      }
    } catch (error) {
      console.log("Session Error:", error);
    } finally {
      setLoading(false);
    }
  };


const loadCylinders = async () => {
  try {
    const stored = await AsyncStorage.getItem(CYLINDERS_KEY);

    if (stored) {
      setCylinders(JSON.parse(stored));
    }
  } catch (error) {
    console.log("Load Cylinders Error:", error);
  }
};
  // REGISTER USER
  const register = async (username, email, password) => {

    try {

      // CHECK EMPTY
      if (!username || !email || !password) {

        return {
          success: false,
          message: "All fields are required",
        };
      }

      // CHECK EMAIL FORMAT
      const emailRegex = /\S+@\S+\.\S+/;

      if (!emailRegex.test(email)) {

        return {
          success: false,
          message: "Invalid email format",
        };
      }

      // CHECK PASSWORD LENGTH
      if (password.length < 4) {

        return {
          success: false,
          message: "Password must be at least 4 characters",
        };
      }

      // CHECK DUPLICATE USER
      const existingUser = users.find(
        item =>
          item.username === username ||
          item.email === email
      );

      if (existingUser) {

        return {
          success: false,
          message: "User already exists",
        };
      }

      const newUser = {
        id: Date.now(),
        username,
        email,
        password,
      };

      const updatedUsers = [...users, newUser];

      setUsers(updatedUsers);

      await AsyncStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      return {
        success: true,
        message: "Registration successful",
      };

    } catch (error) {

      console.log(error);

      return {
        success: false,
        message: "Registration failed",
      };
    }
  };

  // LOGIN USER
  const login = async (username, password) => {

    try {

      if (!username || !password) {

        return {
          success: false,
          message: "Username and password required",
        };
      }

      const existingUser = users.find(
        item =>
          item.username === username &&
          item.password === password
      );

      if (!existingUser) {

        return {
          success: false,
          message: "Invalid username or password",
        };
      }

      setUser(existingUser);

      await AsyncStorage.setItem(
        "currentUser",
        JSON.stringify(existingUser)
      );

      return {
        success: true,
        message: "Login successful",
      };

    } catch (error) {

      console.log(error);

      return {
        success: false,
        message: "Login failed",
      };
    }
  };

  // LOGOUT
  const logout = async () => {

    try {

      setUser(null);

      await AsyncStorage.removeItem("currentUser");

    } catch (error) {

      console.log(error);

    }



  }

  const updateProfile = async (
    username,
    email,
    currentPassword,
    newPassword
  ) => {

    try {

      if (!user) {

        return {
          success: false,
          message: "User not found",
        };
      }

      // VALIDATION
      if (!username || !email) {

        return {
          success: false,
          message: "Username and email required",
        };
      }

      // EMAIL VALIDATION
      const emailRegex = /\S+@\S+\.\S+/;

      if (!emailRegex.test(email)) {

        return {
          success: false,
          message: "Invalid email format",
        };
      }

      // CHECK DUPLICATE USERNAME
      const duplicateUser = users.find(
        item =>
          item.username === username &&
          item.id !== user.id
      );

      if (duplicateUser) {

        return {
          success: false,
          message: "Username already exists",
        };
      }

      // PASSWORD CHANGE
      let updatedPassword = user.password;

      // IF USER WANTS TO CHANGE PASSWORD
      if (currentPassword || newPassword) {

        // CHECK CURRENT PASSWORD
        if (currentPassword !== user.password) {

          return {
            success: false,
            message: "Current password incorrect",
          };
        }

        // CHECK NEW PASSWORD LENGTH
        if (newPassword.length < 4) {

          return {
            success: false,
            message: "New password too short",
          };
        }

        updatedPassword = newPassword;
      }

      // UPDATED USER
      const updatedUser = {
        ...user,
        username,
        email,
        password: updatedPassword,
      };

      // UPDATE CURRENT USER
      setUser(updatedUser);

      // UPDATE USER LIST
      const updatedUsers = users.map(item =>
        item.id === user.id
          ? updatedUser
          : item
      );

      setUsers(updatedUsers);

      // SAVE STORAGE
      await AsyncStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      await AsyncStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser)
      );

      return {
        success: true,
        message: "Profile updated successfully",
      };

    } catch (error) {

      console.log(error);

      return {
        success: false,
        message: "Update failed",
      };
    }
  };

  const addCylinder = async (cylinder) => {
  setCylinders(prev => [...prev, cylinder]);
};
  const deleteCylinder = async (id) => {
  setCylinders(prev =>
    prev.filter(item => item.id !== id)
  );
};
const updateCylinder = async (id, updatedData) => {
  setCylinders(prev =>
    prev.map(cylinder =>
      cylinder.id === id
        ? { ...cylinder, ...updatedData }
        : cylinder
    )
  );
};


const toggleCylinderVisibility = (id) => {
  setCylinders((prev) =>
    prev.map((cylinder) =>
      cylinder.id === id
        ? {
            ...cylinder,
            isVisible: !cylinder.isVisible,
          }
        : cylinder
    )
  );
};

  return (
    <GasContext.Provider
      value={{
        gasLevel,
        setGasLevel,
        deviceConnected,
        setDeviceConnected,
        currentTemp,
        setCurrentTemp,
        maxTemp,
        setMaxTemp,
        user,
        users,
        loading,
        setLoading,
        register,
        login,
        logout,
        updateProfile,
        gasLowAlert,
        setGasLowAlert,
        batteryLowAlert,
        setBatteryLowAlert,
        cylinders,
        setCylinders,
        updateCylinder,
        setGasThreshold,
        setBatteryThreshold,
        batteryThreshold,
        gasThreshold,
        addCylinder,
        toggleCylinderVisibility


      }}
    >
      {children}
    </GasContext.Provider>
  );
};

export default GasProvider;