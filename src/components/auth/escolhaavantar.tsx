import { useState } from "react"
import { View, Image, TouchableOpacity, StyleSheet,Text } from "react-native"

type AvatarID = 1 | 2 | 3 | 4 | 5;

// caminho corrigido — subindo 2 níveis (auth → components → src)
const avatares = {
    1: require('../../assets/images/avatarcapivara.png'),
    2: require('../../assets/images/avataronca.png'),
    3: require('../../assets/images/avatarjacare.png'),
    4: require('../../assets/images/avatarleao.png'),
    5: require('../../assets/images/avatarpanda.png'),
}

interface EscolhaAvatarProps {
    onChange?: (avatar: any) => void;
}

export default function EscolhaAvatar({ onChange }: EscolhaAvatarProps) {

    // estado inicia com o require do primeiro avatar
    const [avatar, setAvatar] = useState(avatares[1]);

    function changingAvatar(value: AvatarID) {
        const novoAvatar = avatares[value];
        setAvatar(novoAvatar);
        onChange?.(novoAvatar); // avisa o pai qual avatar foi escolhido
    }

    return (
        <View style={styles.main}>

            {/* imagem grande do avatar selecionado */}
            <View style={styles.avatarContainer}>
                <Image source={avatar} style={styles.iconMaior} />
            </View>

            <View >
                <Text style={{fontSize:16}}>Escolhas seu avatar</Text>
            </View>


            <View style={styles.viewEscolha}>

                <TouchableOpacity onPress={() => changingAvatar(1)}>
                    <View style={styles.avatarContainer}>
                        <Image source={avatares[1]} style={styles.iconEscolha} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changingAvatar(2)}>
                    <View style={styles.avatarContainer}>
                        <Image source={avatares[2]} style={styles.iconEscolha} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changingAvatar(3)}>
                    <View style={styles.avatarContainer}>
                        <Image source={avatares[3]} style={styles.iconEscolha} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changingAvatar(4)}>
                    <View style={styles.avatarContainer}>
                        <Image source={avatares[4]} style={styles.iconEscolha} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changingAvatar(5)}>
                    <View style={styles.avatarContainer}>
                        <Image source={avatares[5]} style={styles.iconEscolha} />
                    </View>
                </TouchableOpacity>

            </View>
    </View>
    
    )
}

const styles = StyleSheet.create({

    main: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        padding: 20,
    },

    iconMaior: {
        width: 128,
        height: 128,
        resizeMode: 'contain',
    },

    viewEscolha: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
    },

    iconEscolha: {
        width: 55,
        height: 55,
        resizeMode: 'contain',
    },
    avatarContainer: {
    backgroundColor: '#E5DEFF',
    borderRadius: 50,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
},
})