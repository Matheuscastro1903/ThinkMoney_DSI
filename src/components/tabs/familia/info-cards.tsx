import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

// Trocar pela interface correta depois
interface FamiliaProps {
    qtdMembros: number,
    qtdMetas: number,
}

// Importar dados reais depois
const mockData: FamiliaProps = {
    qtdMembros: 3,
    qtdMetas: 5,
};

export default function InfoCards() {
    const[qtdMembros, setQtdMembros] = useState<number>(0)
    const[qtdMetas, setQtdMetas] = useState<number>(0)

    useEffect(() => {
        setQtdMembros(mockData.qtdMembros)
        setQtdMetas(mockData.qtdMetas)
    }, [])

    return (
    <View style={styles.quickStats}>
        <View style={styles.statCard}>
            <Ionicons name="people" size={18} color="#1D1252" />
            <View style={styles.statInfo}>
            <Text style={styles.statNumber}>
                {qtdMembros}
            </Text>
            <Text style={styles.statLabel}>MEMBROS</Text>
            </View>
        </View>
        <View style={styles.statCard}>
            <Ionicons name="flag-outline" size={18} color="#1D1252" />
            <View style={styles.statInfo}>
            <Text style={styles.statNumber}>
                {qtdMetas}
            </Text>
            <Text style={styles.statLabel}>METAS</Text>
            </View>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
  quickStats: {
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 40,
    width: '100%',
    justifyContent: 'center',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  statInfo: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#000000',
    letterSpacing: 1,
    textAlign: 'center',
  },   
})