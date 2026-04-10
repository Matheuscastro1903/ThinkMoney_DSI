import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Link, type Href } from "expo-router";

//importando biblioteca de icons
import { Ionicons } from "@expo/vector-icons";

interface ButtonComeBackProps {
  label: string;
  url: Href;
  color: string;
}

export default function ButtonComeBack({
  label,
  url,
  color,
}: ButtonComeBackProps) {
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: color,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Link href={url} asChild>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}
        >
          <Ionicons name="arrow-back" size={32} color="white" />
          <Text style={{ color: "white", fontSize: 15 }}> {label}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({});
