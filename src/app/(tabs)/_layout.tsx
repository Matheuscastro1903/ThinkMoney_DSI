import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router"; // SLOT — renderiza a tela atual automaticamente
import NavBar from "@/src/components/tabs/navbar";

export default function Layout() {
    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.container}>

                {/* Slot é o equivalente ao {children} do Next — renderiza a tela ativa */}
                <Slot />

                {/* Footer fixo em todas as telas do grupo (app) */}
                <NavBar></NavBar>

            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
})