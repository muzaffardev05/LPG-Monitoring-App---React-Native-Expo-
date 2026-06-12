
import { Link } from "@react-navigation/native";
import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, TextInput, Button, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { GasContext } from '../context/GasContext';
import AlertSettingCard from "../components/AlertSettingCard";
import { Switch } from "react-native";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = ({ navigation }) => {

    const { user, cylinders, toggleCylinderVisibility } = useContext(GasContext);



    const handleAddCylinder = () => {
        navigation.navigate("AddCylinder");
    };

    const handleCylinder = async (id) => {
        try {
            await toggleCylinderVisibility(id)
        } catch (error) {
            console.log("Something Wrong");

        }
    }



    return (
        <>



            <View style={styles.container}>

                <SafeAreaView>


                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Image
                            source={require("../../assets/profile.png")}
                            style={styles.logo}
                        />
                        <Text style={styles.title}>Hello, {user?.username}!</Text>
                        <Text style={styles.subtitle}>Smart Clyinder Dashboard Mobile</Text>
                    </View>
                    <View style={styles.login}>
                        <Text
                            style={{
                                fontSize: 16,
                                marginBottom: 12,
                                fontWeight: "500",
                                textAlign: "center",
                                color: "#000000",
                            }}
                        >
                            Active Cylinders
                        </Text>


                        <View style={styles.cylinderContainer}>
                            <FlatList
                                data={cylinders}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled
                                renderItem={({ item }) => (
                                    <View style={styles.cylinderRow}>
                                        <View style={styles.cylinderInfo}>
                                            <MaterialCommunityIcons
                                                name="gas-cylinder"
                                                size={28}
                                                color="#000"
                                            />

                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={styles.cylinderName}>
                                                    {item.name}
                                                </Text>

                                                <Text style={styles.cylinderId}>
                                                    {item.id}
                                                </Text>
                                            </View>
                                        </View>

                                        <Switch
                                            value={item?.isVisible}
                                            trackColor={{
                                                false: "#767577",
                                                true: "#81b0ff",
                                            }}
                                            thumbColor="#f4f3f4"
                                            onValueChange={() =>
                                                toggleCylinderVisibility(item.id)
                                            }
                                        />
                                    </View>
                                )}
                                ListEmptyComponent={
                                    <Text style={{ textAlign: "center", padding: 15 }}>
                                        No cylinders found
                                    </Text>
                                }
                            />
                        </View>




                    </View>



                    <View style={{ marginBottom: 50 }}>

                        <View style={{ backgroundColor: '#000000', paddingVertical: 5, paddingHorizontal: 30, borderRadius: 20, marginTop: 10 }}>

                            <TouchableOpacity onPress={handleAddCylinder}>

                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                    <MaterialCommunityIcons name="gas-cylinder" size={30} color="white" />
                                    <Text style={{ textAlign: "center", paddingLeft: 10, fontWeight: 500, color: "white" }}>Add Cylinder</Text>
                                </View>
                            </TouchableOpacity>
                        </View>


                    </View>

                </SafeAreaView>
            </View>
        </>
    )
}

export default Profile;
const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        marginBottom: 40
    },
    logo: {
        width: 40,
        height: 40,

        resizeMode: "contain",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#000000",
    },
    subtitle: {
        fontSize: 14,
        color: "#000000",
        marginTop: 5,
    },
    login: {

        borderRadius: 15,
        padding: 15,
        marginTop: 4,
        width: '100%',
        marginBottom: 3


    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
    },
    cylinderContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 20,
        maxHeight: 290,
        minHeight: 290,
        borderColor: "#000",


    },

    cylinderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        gap: 14,
    },

    cylinderInfo: {
        flexDirection: "row",
        alignItems: "center",
    },

    cylinderName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },

    cylinderId: {
        fontSize: 12,
        color: "#6b7280",
    },
});