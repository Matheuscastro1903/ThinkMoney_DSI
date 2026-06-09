import { useState, useEffect, useCallback } from 'react'
import familiaService from '@/src/services/familiasService'
import { FamiliaProps } from '@/src/types/familia'
import { UsuarioProps } from '@/src/types/usuario'

/**
 * Hook central de leitura da família.
 * Recebe familiaId (obtido via useUsuarioLogado) e busca os dados completos
 * do documento da família no Firestore. Não faz requisição se familiaId for null
 * (usuário ainda sem família).
 */
export function useFamilia(familiaId: string | null) {
    const [familia, setFamilia] = useState<FamiliaProps | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchFamilia = useCallback(async () => {
        if (!familiaId) {
            setFamilia(null)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const data = await familiaService.verMembrosFamilia(familiaId)
            setFamilia(data)
        } catch (err) {
            console.error('Erro ao carregar família:', err)
            setError('Não foi possível carregar os dados da família.')
        } finally {
            setIsLoading(false)
        }
    }, [familiaId])

    useEffect(() => {
        fetchFamilia()
    }, [fetchFamilia])

    const membros: UsuarioProps[] = familia?.membros ?? []

    return {
        familia,
        membros,
        isLoading,
        error,
        refetch: fetchFamilia,
    }
}
