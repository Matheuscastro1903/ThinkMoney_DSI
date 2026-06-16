import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  TextInput,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import NavBarFamilia from "@/src/components/tabs/familia/navbar/page";
import InfoCards from "@/src/components/tabs/familia/info-cards";
import { useFamiliaEditar } from "@/src/hooks/familia/useFamiliaEditar";
import { useRouter } from "expo-router";
import { Usuario } from "@/src/models/usuario";
import { useState } from "react";

export default function FamiliaEditar() {
  const router = useRouter();
  const {
    familia,
    familyName,
    membros,
    isLoading,
    isUsuarioLogadoAdmin,
    confirmarRemoverMembro,
    salvarAlteracoes,
  } = useFamiliaEditar();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [novoNome, setNovoNome] = useState(familyName);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.familyName}>{`Família ${familyName}`}</Text>

        <InfoCards />

        <NavBarFamilia></NavBarFamilia>
      </View>

      <View style={styles.membrosSection}>
        <Text style={styles.sectionLabel}>MEMBROS</Text>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#ffffff"
            style={{ marginTop: 20 }}
          />
        ) : (
          membros.map((membro: Usuario, index: number) => (
            <View key={membro.email ?? index} style={styles.membroRow}>
              <View style={styles.membroInicial}>
                <Text style={styles.membroInicialText}>
                  {membro.nome?.charAt(0).toUpperCase() ?? "?"}
                </Text>
              </View>
              <View style={styles.membroInfo}>
                <Text style={styles.membroNome}>{membro.nome}</Text>
                <Text style={styles.membroRole}>
                  {familia?.admin && membro.email === familia.admin.email
                    ? "ADMIN"
                    : "MEMBRO"}
                </Text>
              </View>
              {isUsuarioLogadoAdmin &&
                (!familia?.admin || membro.email !== familia.admin.email) && (
                  <TouchableOpacity
                    onPress={() => confirmarRemoverMembro(membro)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                )}
            </View>
          ))
        )}
      </View>

      <View style={styles.acoesSection}>
        <TouchableOpacity
          style={styles.cancelarButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelarButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editarNomeButton}
          onPress={() => {
            setNovoNome(familyName);
            setModalVisivel(true);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil-outline" size={16} color="#ffffff" />
          <Text style={styles.editarNomeButtonText}>
            Editar nome da família
          </Text>
        </TouchableOpacity>

        {!isUsuarioLogadoAdmin && !isLoading && (
          <TouchableOpacity
            style={styles.sairButton}
            onPress={() =>
              router.push("/familia/editar/confirmar-saida" as any)
            }
            activeOpacity={0.7}
          >
            <Ionicons name="exit-outline" size={16} color="#E1FF00" />
            <Text style={styles.sairButtonText}>Sair da Família</Text>
          </TouchableOpacity>
        )}

        {isUsuarioLogadoAdmin && !isLoading && (
          <>
            <Text style={styles.avisoText}>
              Ao excluir a conta da família, todos os dados compartilhados e
              pertences de membros serão permanentemente removidos.
            </Text>

            <TouchableOpacity
              style={styles.excluirButton}
              onPress={() =>
                router.push("/familia/editar/confirmar-exclusao" as any)
              }
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <Text style={styles.excluirButtonText}>Excluir Família</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Editar nome da família</Text>

            <TextInput
              style={styles.modalInput}
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Nome da família"
              placeholderTextColor="rgba(29,18,82,0.4)"
              autoFocus
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.modalCancelar}
                onPress={() => setModalVisivel(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSalvar}
                onPress={async () => {
                  setModalVisivel(false);
                  await salvarAlteracoes(novoNome);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalSalvarText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#1D1252",
  },
  scrollContent: {
    alignItems: "center",
    gap: 24,
    paddingBottom: 32,
  },
  familyName: {
    fontSize: 36,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: -0.9,
    marginTop: 16,
    textAlign: "center",
  },
  headerContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 24,
  },
  membrosSection: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  membroRow: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  membroInicial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5DEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  membroInicialText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D1252",
  },
  membroInfo: {
    flex: 1,
  },
  membroNome: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1D1252",
  },
  membroRole: {
    fontSize: 10,
    fontWeight: "600",
    color: "#867DC1",
    letterSpacing: 1,
    marginTop: 2,
  },
  acoesSection: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 12,
  },
  cancelarButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cancelarButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  sairButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E1FF00",
  },
  sairButtonText: {
    color: "#E1FF00",
    fontSize: 15,
    fontWeight: "bold",
  },
  avisoText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 17,
    paddingHorizontal: 10,
  },
  excluirButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  excluirButtonText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "bold",
  },
  nomeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  editNomeContainer: {
    width: "100%",
    gap: 12,
    marginTop: 16,
  },
  editNomeInput: {
    fontSize: 28,
    fontWeight: "600",
    color: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.4)",
    paddingVertical: 8,
    textAlign: "center",
  },
  editNomeBotoes: {
    flexDirection: "row",
    gap: 10,
  },
  salvarButton: {
    flex: 1,
    backgroundColor: "#1A73E8",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  salvarButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  editarNomeButton: {
  backgroundColor: 'transparent',
  borderRadius: 12,
  paddingVertical: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.3)',
},
editarNomeButtonText: {
  color: '#ffffff',
  fontSize: 15,
  fontWeight: 'bold',
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.6)',
  justifyContent: 'center',
  paddingHorizontal: 24,
},
modalCard: {
  backgroundColor: '#ffffff',
  borderRadius: 20,
  padding: 24,
  gap: 20,
},
modalTitulo: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#1D1252',
  textAlign: 'center',
},
modalInput: {
  borderWidth: 1,
  borderColor: 'rgba(29,18,82,0.2)',
  borderRadius: 10,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 16,
  color: '#1D1252',
},
modalBotoes: {
  flexDirection: 'row',
  gap: 10,
},
modalCancelar: {
  flex: 1,
  borderWidth: 1,
  borderColor: 'rgba(29,18,82,0.2)',
  borderRadius: 10,
  paddingVertical: 14,
  alignItems: 'center',
},
modalCancelarText: {
  color: '#1D1252',
  fontWeight: 'bold',
  fontSize: 15,
},
modalSalvar: {
  flex: 1,
  backgroundColor: '#1D1252',
  borderRadius: 10,
  paddingVertical: 14,
  alignItems: 'center',
},
modalSalvarText: {
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: 15,
},
});
