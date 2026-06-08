import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { GasContext } from "../context/GasContext";

const EditCylinder = ({ route, navigation }) => {
  const { cylinder } = route.params;

  const { updateCylinder } = useContext(GasContext);

  const [name, setName] = useState(cylinder.name);

  const handleUpdate = () => {
    if (!name.trim()) {
      Alert.alert(
        "Error",
        "Cylinder name is required"
      );
      return;
    }

    updateCylinder(cylinder.id, {
      name: name.trim(),
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Cylinder Name
      </Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
      >
        <Text style={styles.buttonText}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditCylinder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});