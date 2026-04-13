import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HeaderBack() {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <View style={styles.iconContainer}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 80,
        backgroundColor: 'transparent', // Dá fim a tarja preta dura
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#3E346B', // Mesma cor do botão "Ver Todos"
        alignItems: 'center',
        justifyContent: 'center',
    },
});
