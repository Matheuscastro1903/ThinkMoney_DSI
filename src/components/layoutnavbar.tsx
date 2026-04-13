import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "@/src/components/tabs/navbar";


export default function LayoutNavBar({ children }: { children?: React.ReactNode }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>


                <View style={{ flex: 1, backgroundColor: '#1D1252' }}>
                    {children}
                </View>


                <NavBar />

            </View>
        </SafeAreaView>
    );
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
});
