import React, { useContext, useMemo, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Alert,
    ActivityIndicator,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { GasContext } from "../context/GasContext";
import { BLEContext } from "../context/BLEContext";

const CylinderList = ({ navigation }) => {
    const { cylinders, setCylinders } = useContext(GasContext);

    const { connectById, connectingDeviceId } =
        useContext(BLEContext);

    const [selectedCylinderId, setSelectedCylinderId] =
        useState(null);

    const visibleCylinders = useMemo(() => {
        return cylinders.filter((item) => item.isVisible);
    }, [cylinders]);

    const connectedCount = visibleCylinders.filter(
        (item) => item.connected
    ).length;

    const offlineCount =
        visibleCylinders.length - connectedCount;

    const handleAddCylinder = () => {
        navigation.navigate("AddCylinder");
    };

    const handleLongPress = (id) => {
        setSelectedCylinderId((prev) =>
            prev === id ? null : id
        );
    };

    const handleDelete = (id) => {
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
                    onPress: () => {
                        const updated = cylinders.filter(
                            (item) => item.id !== id
                        );

                        setCylinders(updated);
                        setSelectedCylinderId(null);
                    },
                },
            ]
        );
    };

    const renderCylinder = ({ item }) => {
        const isSelected =
            selectedCylinderId === item.id;

        return (
            <TouchableOpacity
                activeOpacity={0.95}
                style={[
                    styles.card,
                    isSelected && styles.selectedCard,
                ]}
            >
                <Pressable
                    delayLongPress={400}
                    onLongPress={() =>
                        handleLongPress(item.id)
                    }
                    onPress={() => {
                        if (isSelected) {
                            setSelectedCylinderId(null);
                            return;
                        }

                        if (item.connected) {
                            navigation.navigate(
                                "CylinderDetails",
                                {
                                    cylinder: item,
                                }
                            );
                        }
                    }}
                >
                    <View style={styles.header}>



                        <View style={styles.content}>

                            <View style={styles.topRow}>

                                <Text style={styles.title}>
                                    {item.name}
                                </Text>

                                <View
                                    style={[
                                        styles.statusBadge,
                                        item.connected
                                            ? styles.connectedBadge
                                            : styles.offlineBadge,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            {
                                                color: item.connected
                                                    ? "#16A34A"
                                                    : "#DC2626",
                                            },
                                        ]}
                                    >
                                        {item.connected
                                            ? "Connected"
                                            : "Offline"}
                                    </Text>
                                </View>

                            </View>

                            <Text style={styles.label}>
                                Gas Level
                            </Text>

                            <View style={styles.progressBackground}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        {
                                            width: item.connected
                                                ? `${item.gasLevel}%`
                                                : "0%",
                                        },
                                    ]}
                                />
                            </View>

                            <Text style={styles.percentText}>
                                {item.connected
                                    ? `${item.gasLevel}%`
                                    : "--"}
                            </Text>

                            <View style={styles.infoRow}>

                                <View style={styles.infoCard}>
                                    <MaterialCommunityIcons
                                        name="thermometer"
                                        size={18}
                                        color="#2563EB"
                                    />

                                    <Text style={styles.infoText}>
                                        {item.connected
                                            ? `${item.temperature}°C`
                                            : "--"}
                                    </Text>
                                </View>

                                <View style={styles.infoCard}>
                                    <MaterialCommunityIcons
                                        name="battery"
                                        size={18}
                                        color="#16A34A"
                                    />

                                    <Text style={styles.infoText}>
                                        {item.connected
                                            ? `${item.batteryLevel}%`
                                            : "--"}
                                    </Text>
                                </View>




                                <View style={styles.infoCard}>
                                    <TouchableOpacity
                                        style={styles.connectButton}
                                        disabled={
                                            connectingDeviceId === item.bleId || item.connected
                                        }
                                        onPress={() =>
                                            connectById(item.bleId)
                                        }
                                    >
                                        {connectingDeviceId ===
                                            item.bleId ? (
                                            <>
                                                <ActivityIndicator
                                                    color="#000000"
                                                />


                                            </>
                                        ) : (
                                            <>
                                                <MaterialCommunityIcons

                                                    name="bluetooth-connect"
                                                    size={18}
                                                   color={item.connected ? "#2563EB" : "#000000"}
                                                />

                                                {/* <Text
                    style={
                      styles.connectButtonText
                    }
                  >
                    Connect Device
                  </Text> */}
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>

                            </View>







                        </View>

                    </View>

                    {/* {!item.connected && (
            <TouchableOpacity
              style={styles.connectButton}
              disabled={
                connectingDeviceId === item.bleId
              }
              onPress={() =>
                connectById(item.bleId)
              }
            >
              {connectingDeviceId ===
              item.bleId ? (
                <>
                  <ActivityIndicator
                    color="#fff"
                  />

                  <Text
                    style={
                      styles.connectButtonText
                    }
                  >
                    Connecting...
                  </Text>
                </>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="bluetooth-connect"
                    size={20}
                    color="#fff"
                  />

                  <Text
                    style={
                      styles.connectButtonText
                    }
                  >
                    Connect Device
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )} */}

                    {isSelected && (
                        <View style={styles.actionContainer}>

                            <TouchableOpacity
                                style={styles.actionButton}
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
                                    size={22}
                                    color="#2563EB"
                                />

                                <Text style={styles.editText}>
                                    Edit
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() =>
                                    handleDelete(item.id)
                                }
                            >
                                <MaterialCommunityIcons
                                    name="delete-outline"
                                    size={22}
                                    color="#DC2626"
                                />

                                <Text style={styles.deleteText}>
                                    Delete
                                </Text>
                            </TouchableOpacity>

                        </View>
                    )}

                </Pressable>
            </TouchableOpacity>
        );
    };

    if (visibleCylinders.length === 0) {
        return (
            <View style={styles.emptyContainer}>

                <View style={styles.emptyCircle}>
                    <MaterialCommunityIcons
                        name="gas-cylinder"
                        size={80}
                        color="#64748B"
                    />
                </View>

                <Text style={styles.emptyTitle}>
                    No Cylinders Yet
                </Text>

                <Text style={styles.emptySubtitle}>
                    Add your first LPG cylinder to
                    monitor gas level, battery and
                    temperature in real time.
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
        );
    }

    return (
        <View style={styles.container}>

            <View style={styles.summaryCard}>

                <Text style={styles.summaryTitle}>
                    My Cylinders
                </Text>

                <View style={styles.summaryRow}>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>
                            {visibleCylinders.length}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Total
                        </Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text
                            style={[
                                styles.summaryValue,
                                { color: "#16A34A" },
                            ]}
                        >
                            {connectedCount}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Connected
                        </Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text
                            style={[
                                styles.summaryValue,
                                { color: "#DC2626" },
                            ]}
                        >
                            {offlineCount}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Offline
                        </Text>
                    </View>

                </View>

            </View>

            <Pressable
                style={{ flex: 1 }}
                onPress={() =>
                    setSelectedCylinderId(null)
                }
            >
                <FlatList
                    data={visibleCylinders}
                    renderItem={renderCylinder}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: 120,
                    }}
                />
            </Pressable>

            <TouchableOpacity
                style={styles.fab}
                onPress={handleAddCylinder}
            >
                <MaterialIcons
                    name="add"
                    size={32}
                    color="#ffffff"
                />
            </TouchableOpacity>

        </View>
    );
};

export default CylinderList;





const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        paddingTop: 35,
    },

    /* =========================
        Summary Card
    ========================== */

    summaryCard: {
        backgroundColor: "#252222",
        // marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 3,
        padding: 20,

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 6,
        },

        elevation: 6,
    },

    summaryTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#dadbdf",
        marginBottom: 18,
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    summaryItem: {
        alignItems: "center",
        flex: 1,
        backgroundColor:"#f1f5f9",
        marginHorizontal: 4,
        paddingVertical: 6,
        borderRadius: 14,

    },

    summaryValue: {
        fontSize: 28,
        fontWeight: "700",
        color: "#2563EB",
    },

    summaryLabel: {
        marginTop: 6,
        color: "#64748B",
        fontSize: 14,
        fontWeight: "500",
    },

    /* =========================
        Cylinder Card
    ========================== */

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 18,
        marginBottom: 18,

        shadowColor: "#000",

        shadowOpacity: 0.08,

        shadowRadius: 14,

        shadowOffset: {
            width: 0,
            height: 8,
        },

        elevation: 8,
    },

    selectedCard: {
        borderWidth: 2,
        borderColor: "#415070",
        backgroundColor: "#EFF6FF",
    },

    header: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    iconContainer: {
        width: 65,
        height: 65,
        borderRadius: 18,

        justifyContent: "center",
        alignItems: "center",
    },

    content: {
        flex: 1,
        marginLeft: 16,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    title: {
        fontSize: 19,
        fontWeight: "700",
        color: "#0F172A",
        flex: 1,
    },

    /* =========================
        Status Badge
    ========================== */

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    connectedBadge: {
        backgroundColor: "#DCFCE7",
    },

    offlineBadge: {
        backgroundColor: "#FEE2E2",
    },

    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },

    /* =========================
        Progress
    ========================== */

    label: {
        marginTop: 18,
        color: "#64748B",
        fontSize: 13,
        fontWeight: "600",
    },

    progressBackground: {
        height: 10,
        borderRadius: 20,
        backgroundColor: "#E2E8F0",
        marginTop: 8,
        overflow: "hidden",
    },

    progressFill: {
        height: 10,
        borderRadius: 20,
        backgroundColor: "#22C55E",
    },

    percentText: {
        marginTop: 6,
        fontSize: 13,
        fontWeight: "700",
        color: "#16A34A",
    },

    /* =========================
        Info Cards
    ========================== */

    infoRow: {
        flexDirection: "row",
        marginTop: 18,
        justifyContent: "space-between",
    },

    infoCard: {
        flex: 1,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: "#F8FAFC",

        paddingVertical: 12,

        borderRadius: 14,

        marginHorizontal: 4,
    },

    infoText: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: "600",
        color: "#334155",
    },

    /* =========================
        Connect Button
    ========================== */

    connectButton: {


        height: 50,




        borderRadius: 14,

        justifyContent: "center",

        alignItems: "center",

        flexDirection: "row",

        // shadowColor: "#2563EB",

        // shadowOpacity: 0.2,

        // shadowRadius: 10,

        // elevation: 5,
    },

    connectButtonText: {
        marginLeft: 8,

        color: "#FFFFFF",

        fontWeight: "700",

        fontSize: 15,
    },

    /* =========================
        Actions
    ========================== */

    actionContainer: {
        marginTop: 18,

        flexDirection: "row",

        justifyContent: "space-evenly",

        borderTopWidth: 1,

        borderTopColor: "#E2E8F0",

        paddingTop: 16,
    },

    actionButton: {
        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#F8FAFC",

        paddingHorizontal: 18,

        paddingVertical: 10,

        borderRadius: 12,
    },

    editText: {
        marginLeft: 6,

        fontWeight: "600",

        color: "#2563EB",
    },

    deleteText: {
        marginLeft: 6,

        fontWeight: "600",

        color: "#DC2626",
    },

    /* =========================
        Floating Button
    ========================== */

    fab: {
        position: "absolute",

        right: 20,

        bottom: 100,

        width: 68,

        height: 68,

        borderRadius: 34,

        backgroundColor: "#000000",

        justifyContent: "center",

        alignItems: "center",

        shadowColor: "#2563EB",

        shadowOpacity: 0.3,

        shadowRadius: 12,

        elevation: 10,
    },

    /* =========================
        Empty State
    ========================== */

    emptyContainer: {
        flex: 1,

        justifyContent: "center",

        alignItems: "center",

        backgroundColor: "#F8FAFC",

        paddingHorizontal: 32,
    },

    emptyCircle: {
        width: 170,

        height: 170,

        borderRadius: 85,

        backgroundColor: "#FFFFFF",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 30,

        shadowColor: "#000",

        shadowOpacity: 0.08,

        shadowRadius: 10,

        elevation: 6,
    },

    emptyTitle: {
        fontSize: 28,

        fontWeight: "700",

        color: "#0F172A",

        marginBottom: 12,
    },

    emptySubtitle: {
        textAlign: "center",

        color: "#64748B",

        fontSize: 15,

        lineHeight: 24,

        marginBottom: 34,
    },

    emptyButton: {
        backgroundColor: "#000000",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 26,

        paddingVertical: 15,

        borderRadius: 14,

        shadowColor: "#2563EB",
       

        shadowOpacity: 0.2,

        shadowRadius: 8,

        elevation: 5,
    },

    emptyButtonText: {
        color: "#FFFFFF",

        marginLeft: 8,

        fontSize: 16,

        fontWeight: "700",
    },

});