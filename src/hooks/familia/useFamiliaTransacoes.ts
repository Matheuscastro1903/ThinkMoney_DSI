import { useMemo } from 'react'
import { useUsuarioLogado } from '@/src/hooks/useUsuarioLogado'
import { useFamilia } from './useFamilia'
import { GastoProps } from '@/src/types/gasto'

type GastoComCampos = GastoProps & {
    id?: string
    titulo?: string
    descricao?: string
    valor?: number
    categoria?: string
    membroNome?: string
    membroAvatar?: number
    data?: string
    iconName?: string
    iconFamily?: string
}

type TransacaoSection = {
    section: string
    data: GastoComCampos[]
}

function labelData(data: Date): string {
    const hoje = new Date()
    const ontem = new Date()
    ontem.setDate(hoje.getDate() - 1)

    const mesmaData = (a: Date, b: Date) =>
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()

    if (mesmaData(data, hoje)) return 'HOJE'
    if (mesmaData(data, ontem)) return 'ONTEM'
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }).toUpperCase()
}

/**
 * Hook da tela Transações da família.
 * Lê familia.gastos (campo embutido) e agrupa por data em seções
 * (Hoje / Ontem / datas anteriores formatadas).
 *
 * NOTA: GastoProps ainda está vazio em types/gasto.ts.
 * Quando for preenchido, remover o cast GastoComCampos e ajustar os campos.
 */
export function useFamiliaTransacoes() {
    const { familiaId } = useUsuarioLogado()
    const { familia, membros, isLoading, refetch } = useFamilia(familiaId)

    const gastos = (familia?.gastos ?? []) as GastoComCampos[]

    const gastoTotal = useMemo(
        () => gastos.reduce((acc, g) => acc + (g.valor ?? 0), 0),
        [gastos]
    )

    const sections = useMemo<TransacaoSection[]>(() => {
        const mapa: Record<string, GastoComCampos[]> = {}

        gastos.forEach((g) => {
            const data = g.data ? new Date(g.data) : new Date()
            const label = labelData(data)
            if (!mapa[label]) mapa[label] = []
            mapa[label].push(g)
        })

        return Object.entries(mapa).map(([section, data]) => ({ section, data }))
    }, [gastos])

    return {
        sections,
        gastoTotal,
        qtdMembros: membros.length,
        isLoading,
        refetch,
    }
}
