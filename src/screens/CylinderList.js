import React, { useContext, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { VirtualizedList } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GasContext } from "../context/GasContext";





const CylinderList = ({ navigation }) => {
    const { cylinders, setCylinders } = useContext(GasContext);
    const visibleCylinders = cylinders.filter(
        (cylinder) => cylinder.isVisible
    );
    const renderRightActions = () => (
        <View style={styles.rightAction}>
            <Text style={styles.actionText}>Delete</Text>
        </View>
    );
    // Store selected cylinder id instead of boolean
    const [selectedCylinderId, setSelectedCylinderId] = useState(null);

    const handleAddCylinder = () => {
        navigation.navigate("AddCylinder");
    };

    const handleLongPress = (id) => {
        setSelectedCylinderId((prev) =>
            prev === id ? null : id
        );
    };

    const handleDelete = async (id) => {
        Alert.alert(
            "Delete Cylinder",
            "Are you sure you want to delete this cylinder?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                    

                        const Updatedcylinders = await cylinders.filter((i) => i.id !== id)
                        setCylinders(Updatedcylinders);
                        setSelectedCylinderId(null);
                    },
                },
            ]
        );
    };

    const renderCylinder = ({ item }) => {
        const isSelected = selectedCylinderId === item.id;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={[
                    styles.card,
                    isSelected && styles.selectedCard,
                ]}
            >
                <Pressable
                    onLongPress={() => handleLongPress(item.id)}
                    delayLongPress={400}
                    onPress={() => {
                        if (isSelected) {
                            setSelectedCylinderId(null);
                            return;
                        }

                        navigation.navigate("CylinderDetails", {
                            cylinder: item,
                        });
                    }}
                >
                    <View style={styles.header}>
                        <MaterialCommunityIcons
                            name="gas-cylinder"
                            size={40}
                            color="#0f172a"
                        />

                        <View style={styles.content}>
                            <Text style={styles.title}>
                                {item.name}
                            </Text>

                            <Text style={styles.subtitle}>
                                Gas Level: {item.gasLevel}%
                            </Text>

                            <View style={styles.infoRow}>
                                <Text>
                                    🌡 {item.temperature}°C
                                </Text>

                                <Text>
                                    🔋 {item.batteryLevel}%
                                </Text>
                            </View>
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

                    {isSelected && (
                        <View style={styles.actionContainer}>
                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() =>
                                    navigation.navigate(
                                        "EditCylinder",
                                        {
                                            cylinder: item,
                                        }
                                    )
                                }
                            >
                                <MaterialCommunityIcons
                                    name="circle-edit-outline"
                                    size={24}
                                    color="#2563eb"
                                />

                                <Text style={styles.actionText}>
                                    Edit
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() =>
                                    handleDelete(item.id)
                                }
                            >
                                <MaterialCommunityIcons
                                    name="delete"
                                    size={24}
                                    color="#dc2626"
                                />

                                <Text style={styles.actionText}>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Pressable>
            </TouchableOpacity>
        );
    };

    return (

        <View style={{ flex: 1, marginTop: 35 }}>
            {visibleCylinders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <MaterialCommunityIcons
                            name="gas-cylinder"
                            size={90}
                            color="#94a3b8"
                        />
                    </View>

                    <Text style={styles.emptyTitle}>
                        No Cylinders Available
                    </Text>

                    <Text style={styles.emptySubtitle}>
                        Add your first gas cylinder to start monitoring
                        gas levels, battery status, and alerts in
                        real-time.
                    </Text>

                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={handleAddCylinder}
                    >
                        <MaterialIcons
                            name="add"
                            size={22}
                            color="#fff"
                        />
                        <Text style={styles.emptyButtonText}>
                            Add Cylinder
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <Pressable
                    style={{ flex: 1 }}
                    onPress={() => setSelectedCylinderId(null)}
                >
                    <FlatList
                    style={{marginBottom:50}}
                        data={visibleCylinders}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCylinder}
                        contentContainerStyle={{
                            padding: 15,
                            paddingBottom: 120,
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </Pressable>
            )}

            { visibleCylinders.length !=0 ? ( <TouchableOpacity
                style={styles.floatingBtn}
                onPress={handleAddCylinder}
            >
                <MaterialIcons
                    name="add"
                    size={34}
                    color="#fff"
                />
            </TouchableOpacity>):(null)}
        </View>

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

    selectedCard: {
        borderWidth: 2,
        borderColor: "#2563eb",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
    },

    content: {
        flex: 1,
        marginLeft: 12,
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
        gap: 15,
        marginTop: 10,
    },

    actionContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 15,
        gap: 20,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingTop: 12,
    },

    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    actionText: {
        fontWeight: "600",
    },

    floatingBtn: {
        position: "absolute",
        right: 20,
        bottom: 100,

        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,


    },
    emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
},

emptyIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
},

emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
},

emptySubtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
},

emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
},

emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
},
});