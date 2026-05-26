import usuarioService from "@/src/services/usuarioService";
import { auth } from "@/src/services/firebaseConfig";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { avatares } from '@/src/components/auth/escolhaavantar'



export default function Header() {
  const router = useRouter();
  const [avatarId, setAvatarId] = useState<number>(1);
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    usuarioService.buscarDadosUsuario(user.uid).then((dados) => {
      if (dados?.avatar) {
        setAvatarId(dados.avatar);
      }
    });
  }, []);
  return (
    <View style={styles.header}>
      <Image
        source={require("../assets/images/logothink.png")}
        style={styles.logo}
      />

      <TouchableOpacity onPress={() => router.push("/config")}>
        <Image source={avatares[avatarId]} style={styles.avatar} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 87,
    backgroundColor: "#000000",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingRight: 30,
  },
  logo: {
    width: 68,
    height: 59,
    resizeMode: "contain",
    transform: [{ scale: 3 }],
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#4ADE80",
  },
});
