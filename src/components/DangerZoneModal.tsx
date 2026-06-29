import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ZonaPerigo } from '../hooks/useDangerZone';

interface Props {
    zonaPerigo: ZonaPerigo | null;
    onPararAlarme: () => void;
    onFechar: () => void;
}

export default function DangerZoneModal({ zonaPerigo, onPararAlarme, onFechar }: Props) {
    const [alarmeParado, setAlarmeParado] = useState(false);

    const handlePararAlarme = () => {
        onPararAlarme();
        setAlarmeParado(true);
    };

    const handleFechar = () => {
        setAlarmeParado(false);
        onFechar();
    };

    // Reseta o estado interno quando um novo alerta aparecer
    if (!zonaPerigo) return null;

    const localNome = zonaPerigo.cluster.titulo || 'este local';

    return (
        <Modal visible transparent animationType="fade" onRequestClose={handleFechar}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.iconRow}>
                        <Ionicons
                            name={alarmeParado ? 'warning-outline' : 'volume-high'}
                            size={48}
                            color={alarmeParado ? '#F59E0B' : '#EF4444'}
                        />
                    </View>

                    {!alarmeParado ? (
                        <>
                            <Text style={styles.titulo}>Alarme de Zona de Risco!</Text>
                            <Text style={styles.subtitulo}>
                                Você está a aproximadamente{' '}
                                <Text style={styles.destaque}>{zonaPerigo.distancia}m</Text>{' '}
                                de um local com muitos gastos registrados.
                            </Text>
                            <TouchableOpacity style={styles.botaoParar} onPress={handlePararAlarme}>
                                <Ionicons name="stop-circle-outline" size={20} color="#fff" />
                                <Text style={styles.botaoPararTexto}>Parar barulho</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.titulo}>Zona de Risco Financeiro</Text>
                            <Text style={styles.subtitulo}>
                                <Text style={styles.destaque}>{localNome}</Text> é um local onde você costuma
                                gastar bastante. Fique atento para não comprometer seu orçamento!
                            </Text>
                            <Text style={styles.dica}>
                                Evite compras por impulso e lembre-se das suas metas financeiras.
                            </Text>
                            <TouchableOpacity style={styles.botaoOk} onPress={handleFechar}>
                                <Text style={styles.botaoOkTexto}>OK, entendi</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#1D1252',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    iconRow: {
        marginBottom: 16,
    },
    titulo: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitulo: {
        fontSize: 14,
        color: '#CBD5E1',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 8,
    },
    destaque: {
        color: '#FBBF24',
        fontWeight: 'bold',
    },
    dica: {
        fontSize: 13,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    botaoParar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#EF4444',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 28,
        marginTop: 20,
    },
    botaoPararTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    botaoOk: {
        backgroundColor: '#34D399',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 40,
        marginTop: 4,
    },
    botaoOkTexto: {
        color: '#1D1252',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
