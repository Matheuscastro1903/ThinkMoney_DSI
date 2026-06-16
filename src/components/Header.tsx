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
import ThinkMoneyLogo from "../assets/images/thinkmoney_logo_4k.svg";
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
      <ThinkMoneyLogo width={90} height={90} />

      <TouchableOpacity onPress={() => router.push("/config")}>
        <Image source={avatares[avatarId as keyof typeof avatares]} style={styles.avatar} />
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
    width: 60,
    height: 60,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#4ADE80",
  },
});
