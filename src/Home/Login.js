import React, {
    useEffect,
    useState,
    useContext
} from "react";

import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image,
    TextInput,
    Button,
    Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { GasContext } from "../context/GasContext";
import HomeCylinder from "../components/HomeCylinders";

const Login = ({ navigation }) => {

    const {
        user,
        login,
        register,
        loading,
        setLoading
    } = useContext(GasContext);

    const [registerMode, setRegisterMode] = useState(false);

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");




    useEffect(() => {
        setLoading(true)
        const timer = setTimeout(() => {
            setLoading(false)
        }, 3000); // 3 seconds splash

        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {

        if (user) {

            navigation.replace("MainTabs");

        }

    }, [user]);

    // LOGIN
    const handleLogin = async () => {


        const result = await login(username, password);
        console.log(result);

        if (result.success) {

            Alert.alert("Success", result.message);

        } else {

            Alert.alert("Error", result.message);

        }
    };

    // REGISTER
    const handleRegister = async () => {

        if (password !== confirmPassword) {

            Alert.alert(
                "Error",
                "Passwords do not match"
            );

            return;
        }

        const result = await register(
            username,
            email,
            password
        );

        if (result.success) {

            Alert.alert("Success", result.message);

            setRegisterMode(false);

            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } else {

            Alert.alert("Error", result.message);

        }
    };

    if (loading) {

        return (

            <View style={styles.loaderContainer}>
                <HomeCylinder />
                <ActivityIndicator
                    size="large"
                    color="#00ffcc"
                />

            </View>
        );
    }

    return (

        <View style={styles.container}>


            <HomeCylinder />
            <View style={styles.card}>

                <SafeAreaView>

                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />

                    {
                        registerMode && (

                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                            />
                        )
                    }

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    {
                        registerMode && (

                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        )
                    }

                    <Button
                        title={
                            registerMode
                                ? "Register"
                                : "Login"
                        }
                        color="#c7301c"
                        onPress={
                            registerMode
                                ? handleRegister
                                : handleLogin
                        }
                    />

                </SafeAreaView>

                <View style={styles.footer}>

                    <Text>
                        {
                            registerMode
                                ? "Already have account?"
                                : "Don't have account?"
                        }
                    </Text>

                    <Text
                        style={styles.link}
                        onPress={() =>
                            setRegisterMode(!registerMode)
                        }
                    >
                        {
                            registerMode
                                ? "Login Here"
                                : "Register Here"
                        }
                    </Text>

                </View>

            </View>

        </View>
    );
};

export default Login;

const styles = StyleSheet.create({

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f172a",
    },

    container: {
        flex: 1,
        backgroundColor: "#0f172a",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },

    subtitle: {
        color: "#94a3b8",
        marginBottom: 25,
    },

    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
    },

    footer: {
        marginTop: 15,
        alignItems: "center",
    },

    link: {
        color: "#c7301c",
        fontWeight: "bold",
        marginTop: 5,
    },

});