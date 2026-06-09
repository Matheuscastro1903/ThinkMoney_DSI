import { useCallback } from 'react'
import * as Clipboard from 'expo-clipboard'
import { Alert } from 'react-native'
import { useUsuarioLogado } from '@/src/hooks/useUsuarioLogado'
import { useFamilia } from './useFamilia'

/**
 * Hook da tela Home da família.
 * Agrega dados de leitura (nome, membros, código) e a ação de copiar código.
 */
export function useFamiliaHome() {
    const { familiaId } = useUsuarioLogado()
    const { familia, membros, isLoading, error, refetch } = useFamilia(familiaId)

    const copiarCodigo = useCallback(async () => {
        if (!familia?.codigo_convite) return
        await Clipboard.setStringAsync(familia.codigo_convite)
        Alert.alert('Código copiado!', `${familia.codigo_convite} foi copiado para a área de transferência.`)
    }, [familia?.codigo_convite])

    return {
        familyName: familia?.nome ?? '—',
        codigoConvite: familia?.codigo_convite ?? '—',
        membros,
        isLoading,
        error,
        refetch,
        copiarCodigo,
    }
}
