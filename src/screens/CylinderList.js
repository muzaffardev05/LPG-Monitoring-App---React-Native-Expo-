import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GasContext } from "../context/GasContext";

const CylinderList = ({ navigation }) => {
  const { cylinders } = useContext(GasContext);

  const renderCylinder = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("CylinderDetails", {
          cylinder: item,
        })
      }
    >
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="gas-cylinder"
          size={40}
          color="#0f172a"
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>
            Gas Level: {item.gasLevel}%
          </Text>
        </View>

        <Text
          style={[
            styles.status,
            {
              color:
                item.gasLevel < 20
                  ? "red"
                  : "green",
            },
          ]}
        >
          {item.status}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text>🌡 {item.temperature}°C</Text>
        <Text>🔋 {item.battery}%</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={cylinders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderCylinder}
      contentContainerStyle={{ padding: 15 }}
    />
  );
};

export default CylinderList;


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#666",
    marginTop: 3,
  },

  status: {
    fontWeight: "bold",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});