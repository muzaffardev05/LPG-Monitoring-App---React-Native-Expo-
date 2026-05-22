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

  const [cylinders, setCylinders] = useState([
    {
      id: "cyl-001",
      name: "Kitchen Cylinder",
      gasLevel: 80,
      batteryLevel: 95,
      connected: true,
    },
    {
      id: "cyl-002",
      name: "Backup Cylinder",
      gasLevel: 60,
      batteryLevel: 88,
      connected: true,
    },
  ]);

  const gasAlertSent = useRef(false);
  const batteryAlertSent = useRef(false);

  useEffect(() => {
    setupNotifications();
  }, []);

  // LOAD USERS + LOGIN SESSION
  useEffect(() => {

    loadUsers();
    loadSession();
    loadAlerts();

  }, []);





  useEffect(() => {
    if (gasLowAlert) {
      if (gasLevel <= 20 && !gasAlertSent.current) {
        sendLowGasAlert(gasLevel);
        gasAlertSent.current = true;
      }

      if (gasLevel > 20) {
        gasAlertSent.current = false;
      }
    }

    if (batteryLowAlert) {
      if (batteryLevel <= 15 && !batteryAlertSent.current) {
        sendLowBatteryAlert(batteryLevel);
        batteryAlertSent.current = true;
      }

      if (batteryLevel > 15) {
        batteryAlertSent.current = false;
      }
    }
  }, [gasLevel, batteryLevel, gasLowAlert, batteryLowAlert]);


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


    const login = (username, password) => {
      console.log(username, password);

      if (username === "admin" && password === "1234") {

        setUser({
          username: username,
          loggedIn: true,
        });

        return true;
      }

      return false;
    };

    const logout = () => {
      setUser(null);
    };

    const register = (username, email, password) => {

      const newUser = {
        username,
        email,
        password,
      };

      console.log("Registered User:", newUser);

      return true;
    };
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
        setCylinders


      }}
    >
      {children}
    </GasContext.Provider>
  );
};

export default GasProvider;