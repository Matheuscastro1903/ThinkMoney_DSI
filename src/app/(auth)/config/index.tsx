import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          style={styles.arrow}
        />
        <Text style={styles.textHeader}>Voltar</Text>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container2}>
          <Image
            source={require("../../../assets/images/image.png")}
            style={styles.avatar}
          />
          <Text style={styles.name}>João Marcelo</Text>
          <Text style={styles.email}>joaozin@thinkmoney.com.br</Text>
          <Text style={styles.address}>UFRPE</Text>
        </View>

        <View style={styles.container3}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="at-circle" size={24} color="grey" />
              <Text style={styles.rowLabel}>Username</Text>
            </View>
            <Text style={styles.rowValue}>@joaomcoutinho</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="calendar-outline" size={24} color="grey" />
              <Text style={styles.rowLabel}>Age</Text>
            </View>
            <Text style={styles.rowValue}>19 years</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="briefcase-outline" size={24} color="grey" />
              <Text style={styles.rowLabel}>Profile</Text>
            </View>
            <Text style={styles.rowValue}>Professional</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="location-outline" size={24} color="grey" />
              <Text style={styles.rowLabel}>Endereco</Text>
            </View>
            <Text style={styles.rowValue}>UFRPE</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="call-outline" size={24} color="grey" />
              <Text style={styles.rowLabel}>Telefone</Text>
            </View>
            <Text style={styles.rowValue}>92138948232</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color="grey"
              />
              <Text style={styles.rowLabel}>Senha</Text>
            </View>
            <Text style={styles.rowValue}>•⁠•⁠•⁠•⁠•⁠•⁠</Text>
          </View>
        </View>

        <TouchableOpacity>
          <View style={styles.container4}>
            <Ionicons name="create-outline" size={22} color="#000" />
            <Text>Editar conta</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.container5}>
            <Ionicons
              name="trash-outline"
              size={22}
              color="#000"
              style={{ color: "red" }}
            />
            <Text style={{ color: "red" }}>Excluir conta</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "black",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 40,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#1D1252",
  },
  textHeader: {
    color: "white",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 20,
  },
  arrow: {
    marginRight: 30,
    height: 20,
    width: 20,
  },
  container2: {
    alignItems: "center",
    marginTop: 60,
  },
  name: {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 10,
  },
  email: {
    color: "white",
    marginBottom: 10,
  },
  address: {
    color: "white",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 10,
  },
  container3: {
    marginTop: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    height: 250,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowLabel: {
    marginLeft: 8,
  },
  rowValue: {
    color: "black",
  },
  container4: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: 20,
    marginRight: 20,
    height: 40,
  },
  container5: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: 20,
    marginRight: 20,
    height: 40,
  },
});
