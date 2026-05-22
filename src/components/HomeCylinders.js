import { Image, Text, StyleSheet } from "react-native";

const HomeCylinder = () => {

    return (
        <>
            <Image
                source={require("../../assets/gas-cylinder.png")}
                style={styles.logo}
            />

            <Text style={styles.title}>
                Gas Monitor System
            </Text>

            <Text style={styles.subtitle}>
                Tracking Cylinders in Real-Time
            </Text></>
    )
}


export default HomeCylinder;

const styles = StyleSheet.create({

    
  

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

   
  
});