import React, { useContext, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Alert,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { VirtualizedList } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GasContext } from "../context/GasContext";
import { BLEContext } from "../context/BLEContext";




const CylinderList = ({ navigation }) => {
    const { cylinders, setCylinders } = useContext(GasContext);
    const {
        connectById,
        connectingDeviceId,
    } = useContext(BLEContext);
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
                activeOpacity={item.connected ? 0.9 : 1}
                style={[
                    styles.card,
                    item.connected
                        ? styles.connectedCard
                        : styles.disconnectedCard,
                    isSelected && styles.selectedCard,
                ]}
            >
                <Pressable
                    disabled={!item.connected}
                    onLongPress={() => handleLongPress(item.id)}
                    delayLongPress={400}
                    onPress={() => {
                        if (isSelected) {
                            setSelectedCylinderId(null);
                            return;
                        }

                        if (item.connected) {
                            navigation.navigate("CylinderDetails", {
                                cylinder: item,
                            });
                        }
                    }}
                >
                    <View style={styles.header}>

                        <MaterialCommunityIcons
                            name="gas-cylinder"
                            size={42}
                            color={
                                item.connected
                                    ? "#0f172a"
                                    : "#94a3b8"
                            }
                        />

                        <View style={styles.content}>

                            <View style={styles.topRow}>
                                <Text style={styles.title}>
                                    {item.name}
                                </Text>

                                <Text
                                    style={[
                                        styles.status,
                                        {
                                            color: item.connected
                                                ? "#16a34a"
                                                : "#dc2626",
                                        },
                                    ]}
                                >
                                    {item.connected
                                        ? "Connected"
                                        : "Offline"}
                                </Text>
                            </View>

                            <Text style={styles.subtitle}>
                                Gas Level:{" "}
                                {item.connected
                                    ? `${item.gasLevel}%`
                                    : "--"}
                            </Text>

                            <View style={styles.infoRow}>
                                <Text>
                                    🌡{" "}
                                    {item.connected
                                        ? `${item.temperature}°C`
                                        : "--"}
                                </Text>

                                <Text>
                                    🔋{" "}
                                    {item.connected
                                        ? `${item.batteryLevel}%`
                                        : "--"}
                                </Text>
                            </View>

                            {!item.connected && (
                                <TouchableOpacity
                                    style={styles.connectButton}
                                    disabled={
                                        connectingDeviceId === item.bleId
                                    }
                                    onPress={() =>
                                        connectById(item.bleId)
                                    }
                                >
                                    {connectingDeviceId === item.bleId ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <MaterialCommunityIcons
                                                name="bluetooth-connect"
                                                size={18}
                                                color="#fff"
                                            />

                                            <Text style={styles.connectButtonText}>
                                                Connect Device
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
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

                                <Text>Edit</Text>
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

                                <Text>Delete</Text>
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
    size={80}
    color="#64748b"
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
                        style={{ marginBottom: 50 }}
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

            {visibleCylinders.length != 0 ? (<TouchableOpacity
                style={styles.floatingBtn}
                onPress={handleAddCylinder}
            >
                <MaterialIcons
                    name="add"
                    size={34}
                    color="#fff"
                />
            </TouchableOpacity>) : (null)}
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

    connectedCard: {
        backgroundColor: "#ffffff",
        borderLeftWidth: 5,
        borderLeftColor: "#22c55e",
    },

    disconnectedCard: {
        backgroundColor: "#d6d9db",
        borderLeftWidth: 5,
        borderLeftColor: "#ef4444",
        opacity: 0.9,
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

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },

    subtitle: {
        marginTop: 6,
        color: "#64748b",
        fontSize: 14,
    },

    status: {
        fontSize: 13,
        fontWeight: "700",
    },

    infoRow: {
        flexDirection: "row",
        marginTop: 8,
        gap: 20,
    },

    offlineBanner: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: "#fef2f2",
        borderRadius: 8,
        alignSelf: "flex-start",
    },

    offlineText: {
        marginLeft: 6,
        color: "#991b1b",
        fontSize: 12,
        fontWeight: "600",
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
        borderRadius: 35,
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
        backgroundColor: "#000",
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
    connectButton: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2563eb",
        paddingVertical: 10,
        borderRadius: 10,
    },

    connectButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 8,
    },
});