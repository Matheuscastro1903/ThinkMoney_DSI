import { useState, useMemo } from 'react'
import { useUsuarioLogado } from '@/src/hooks/useUsuarioLogado'
import { useFamilia } from './useFamilia'
import { Meta } from '@/src/models/meta'
import { UsuarioProps } from '@/src/types/usuario'

// Tipo estendido localmente enquanto MetaProps ainda não tem campos definidos.
// Remover esta extensão quando MetaProps for preenchida no types/meta.ts.

/**
 * Hook da tela Metas da família.
 * Lê familia.metas (campo embutido no documento da família) e
 * expõe uma versão filtrada por criador para o Picker de membros.
 */
export function useFamiliaMetas() {
    const { familiaId } = useUsuarioLogado()
    const { familia, membros, isLoading, refetch } = useFamilia(familiaId)
    const [membroFiltro, setMembroFiltro] = useState<UsuarioProps["email"] | null> (null)

    const metas = (familia?.metas ?? []) as Meta[]

    const metasFiltradas = useMemo(() => {
        if (!membroFiltro) return metas
        return metas.filter((m) => m.criador?.email === membroFiltro)
    }, [metas, membroFiltro])

    const patrimonioTotal = useMemo(() =>
        metas.reduce((acc, m) => acc + (m.valorPoupado ?? 0), 0),
        [metas]
    )

    return {
        familyName: familia?.nome ?? '',
        metas,
        metasFiltradas,
        membros,
        membroFiltro,
        setMembroFiltro,
        patrimonioTotal,
        isLoading,
        refetch,
        familiaId,
    }
}
