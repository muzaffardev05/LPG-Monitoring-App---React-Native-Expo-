import React, {
  useContext,
  useEffect,
  useState
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GasContext } from "../context/GasContext";
import { Link } from "@react-navigation/native";
import AccountSettings from "../components/AccountSettings";
import AlertSettingsScreen from "../components/AlertSettingCard";
import Alarm from "./Alarm";



const SettingsScreen = ({ navigation }) => {


  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [showAlertsSettings, setShowAlertsSettings] = useState(false)
  const { user } = useContext(GasContext);

  const [activeScreen, setActiveScreen] = useState("")






  const onShowAccountSettings = (screen) => {

    setShowAccountSettings(pre => !pre)
    setShowAlertsSettings(false)


  }

  const onALertsAccountSettings = () => {


    setShowAlertsSettings(pre => !pre)
    setShowAccountSettings(false)
  }






  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.heading}>
          Settings
        </Text>

        <Text style={styles.subheading}>
          Manage your account information
        </Text>

      </View>

      {/* PROFILE CARD */}

      {/* <View style={styles.card}>

        <View style={styles.iconBox}>

          <MaterialIcons
            name="person"
            size={45}
            color="#fff"
          />

        </View>

        <Text style={styles.name}>
          {user?.username}
        </Text>

        <Text style={styles.email}>
          {user?.email}
        </Text>

      </View> */}

      {/* FORM */}

      {/* <AccountSettings /> */}

      <View style={styles.settingmenu}>
        <TouchableOpacity style={styles.settingitem} onPress={onShowAccountSettings}>
          <Text style={styles.settingTitle}>Account Settings</Text>
        </TouchableOpacity>
        {showAccountSettings && <AccountSettings />}
        <TouchableOpacity style={styles.settingitem} onPress={onALertsAccountSettings}>
          <Text style={styles.settingTitle}>Alerts Settings</Text>
        </TouchableOpacity>
        {showAlertsSettings && <AlertSettingsScreen />}
      </View>


    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,

  },

  header: {
    paddingTop: 70,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
  },

  subheading: {
    color: "#1b1d1f",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#000000",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },

  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#c7301c",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  email: {
    color: "#94a3b8",
    marginTop: 5,
  },

  form: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },

  label: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#334155",
  },

  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    fontSize: 15,
  },

  saveButton: {
    backgroundColor: "#c7301c",
   
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  logoutButton: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  settingmenu: {

    paddingHorizontal: 20,
    color: "#cfcccc",
    marginBottom: 60
  },
  settingitem: {


    fontWeight: "bold",
    backgroundColor: "#1e293b",
    borderRadius: 20,
    borderRadius: 20,
    padding: 16,
    marginTop: 12,



  },
  settingTitle: {
    color: "#ffffff",
    fontSize: 15,
  }

});