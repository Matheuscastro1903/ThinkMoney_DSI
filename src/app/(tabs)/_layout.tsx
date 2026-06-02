import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot, usePathname } from "expo-router"; //slot— renderiza a tela atual automaticamente
import NavBar from "@/src/components/tabs/navbar";
import Header from "@/src/components/Header";

export default function Layout() {
    const pathname = usePathname()
    const hideChrome = pathname.includes("editar_meta")

    return (
        <SafeAreaView style={[styles.safeArea, hideChrome && { backgroundColor: "white"}]}>

            <View style={styles.container}>
                {/*header fixo em todas as telas */}
                {!hideChrome && <Header />}
                {/*<Header></Header>*/}
                {/*slot é o equivalente ao {children} do Next — renderiza a tela ativa*/}
                <Slot />
                {!hideChrome && <NavBar />}
                {/*footer fixo em todas as telas */}
                {/*<NavBar></NavBar>*/}

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