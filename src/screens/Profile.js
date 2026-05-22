
import { Link } from "@react-navigation/native";
import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, TextInput, Button, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { GasContext } from '../context/GasContext';
const Profile = () => {

    const { user } = useContext(GasContext);
    return (
        <>
            <View style={styles.container}>
                <Image
                    source={require("../../assets/profile.png")}
                    style={styles.logo}
                />
                <Text style={styles.title}>Hello, {user?.username}!</Text>
                <Text style={styles.subtitle}>Smart Clyinder Dashboard Mobile</Text>
                <View style={styles.login}>
                    <Text style={{ fontSize: 16, marginBottom: 12, textAlign: "center", color: "#ffffff", }}>Connect Cylinder</Text>
                    <View style={{ backgroundColor: '#ffffff', paddingVertical: 5, paddingLeft: 2, borderRadius: 20 }}>

                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <MaterialCommunityIcons name="gas-cylinder" size={30} color="black" />
                            <Text style={{ textAlign: "center", paddingLeft: 10, fontWeight: 500 }}>Cylinder 1</Text>
                        </View>
                    </View>


                </View>
                <View style={styles.login}>
                    <Text style={{ fontSize: 16, marginBottom: 12, textAlign: "center", color: "#ffffff", }}>Add Cylinder</Text>
                    <View style={{ backgroundColor: '#ffffff', paddingVertical: 5, paddingLeft: 2, borderRadius: 20 }}>

                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <MaterialCommunityIcons name="gas-cylinder" size={30} color="black" />
                            <Text style={{ textAlign: "center", paddingLeft: 10, fontWeight: 500 }}>Add Cylinder</Text>
                        </View>
                    </View>


                </View>


            </View>
        </>
    )
}

export default Profile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
        alignItems: "center",
        justifyContent: "center",
        gap: 2
    },
    logo: {
        width: 140,
        height: 140,

        resizeMode: "contain",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffffff",
    },
    subtitle: {
        fontSize: 14,
        color: "#94a3b8",
        marginTop: 5,
    },
    login: {

        borderRadius: 15,
        padding: 15,
        marginTop: 22,
        width: '70%',


    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
    },

});