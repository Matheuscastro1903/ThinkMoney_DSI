import { useMemo } from 'react'
import { useUsuarioLogado } from '@/src/hooks/useUsuarioLogado'
import { useFamilia } from './useFamilia'
import { GastoProps } from '@/src/types/gasto'

type TransacaoSection = {
    section: string
    data: GastoProps[]
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

export function useFamiliaGastos() {
    const { familiaId } = useUsuarioLogado()
    const { familia, membros, isLoading, refetch } = useFamilia(familiaId)

    const gastos = (familia?.gastos ?? []) as GastoProps[]

    const gastoTotal = useMemo(
        () => gastos.reduce((acc, g) => acc + (g.valor ?? 0), 0),
        [gastos]
    )

    const sections = useMemo<TransacaoSection[]>(() => {
        const mapa: Record<string, GastoProps[]> = {}

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
        qtdMembros: membros?.length ?? 0,
        membros: membros ?? [],
        familiaId,
        isLoading,
        refetch,
    }
}
