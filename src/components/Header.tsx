import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'

export default function Header() {
    return (
        <View style={styles.header}>
            <Image source={require('../assets/images/logothink.png')} style={styles.logo} />
            <TouchableOpacity onPress={() =>
                console.log('clicou no perfil')}>
                <Image source={require('../assets/images/onca.png')}
                    style={styles.avatar} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 120,
        backgroundColor: '#000000',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingTop: 50,
        paddingRight: 30,
        paddingBottom: 14,
        paddingLeft: 30,
    },
    logo: {
        width: 68,
        height: 59,
        resizeMode: 'contain',
        transform: [{ scale: 3 }]
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#4ADE80',
    },
})
