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

const SettingsScreen = ({ navigation }) => {

  const {
    user,
    logout,
    updateProfile,
  } = useContext(GasContext);

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

const [newPassword, setNewPassword] = useState("");

const [confirmPassword, setConfirmPassword] = useState("");

  // LOAD USER DATA
  useEffect(() => {

    if (user) {

      setUsername(user.username || "");

      setEmail(user.email || "");
    }

  }, [user]);



// const handleLogout=async ()=>{
//     await logout();

//            navigation.replace("Login");
// }


  const handleLogout = async () => {

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Logout",

          style: "destructive",

          onPress: async () => {

            await logout();

            navigation.replace("Login");
          },
        },
      ]
    );
  };

  const handleSave = async () => {

  // CHECK PASSWORD MATCH
  if (newPassword || confirmPassword) {

    if (newPassword !== confirmPassword) {

      Alert.alert(
        "Error",
        "Passwords do not match"
      );

      return;
    }
  }

  setSaving(true);

  const result = await updateProfile(
    username,
    email,
    currentPassword,
    newPassword
  );

  setSaving(false);

  if (result.success) {

    Alert.alert(
      "Success",
      result.message
    );

    // CLEAR PASSWORD FIELDS
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } else {

    Alert.alert(
      "Error",
      result.message
    );
  }
};

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

      <View style={styles.card}>

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

      </View>

      {/* FORM */}

      <View style={styles.form}>

        <Text style={styles.label}>
          Username
        </Text>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
        />
       

<Text style={styles.label}>
  Current Password
</Text>

<TextInput
  style={styles.input}
  placeholder="Current Password"
  secureTextEntry
  value={currentPassword}
  onChangeText={setCurrentPassword}
/>

<Text style={styles.label}>
  New Password
</Text>

<TextInput
  style={styles.input}
  placeholder="New Password"
  secureTextEntry
  value={newPassword}
  onChangeText={setNewPassword}
/>

<Text style={styles.label}>
  Confirm Password
</Text>

<TextInput
  style={styles.input}
  placeholder="Confirm Password"
  secureTextEntry
  value={confirmPassword}
  onChangeText={setConfirmPassword}
/>



        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />

        {/* SAVE BUTTON */}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >

          <Text style={styles.saveText}>
            {
              saving
                ? "Saving..."
                : "Save Changes"
            }
          </Text>

        </TouchableOpacity>

        {/* LOGOUT BUTTON */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >

          <MaterialIcons
            name="logout"
            size={20}
            color="#fff"
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  header: {
    paddingTop: 70,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },

  subheading: {
    color: "#94a3b8",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#1e293b",
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
    padding: 16,
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

});