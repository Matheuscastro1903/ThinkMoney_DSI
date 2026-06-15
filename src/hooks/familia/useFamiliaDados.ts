import { useMemo } from 'react'
import { useUsuarioLogado } from '@/src/hooks/useUsuarioLogado'
import { useFamilia } from './useFamilia'
import { Gasto } from '@/src/models/gasto'



/**
 * Hook da tela Dados da família.
 * Lê familia.gastos e familia.membros (campos embutidos) para montar
 * os cards de gastos por membro, por categoria e as transações recentes.
 *
 * NOTA: GastoProps ainda está vazio em types/gasto.ts.
 * Os cálculos por enquanto retornam arrays vazios e o gastoTotal como 0.
 * Quando GastoProps for preenchido, basta remover o cast e ajustar os campos.
 */
export function useFamiliaDados() {
    const { familiaId } = useUsuarioLogado()
    const { familia, membros, isLoading, refetch } = useFamilia(familiaId)

    const gastos = (familia?.gastos ?? []) as Gasto[]

    const gastoTotal = useMemo(
        () => gastos.reduce((acc, g) => acc + (g.valor ?? 0), 0),
        [gastos]
    )

    const gastosPorMembro = useMemo(() => {
        const map: Record<string, number> = {}
        gastos.forEach((g) => {
            const nome = g.criador?.nome ?? 'Desconhecido'
            map[nome] = (map[nome] ?? 0) + (g.valor ?? 0)
        })
        return Object.entries(map).map(([nome, valor]) => ({ nome, valor }))
    }, [gastos])

    const gastosPorCategoria = useMemo(() => {
        const map: Record<string, number> = {}
        gastos.forEach((g) => {
            const cat = g.categoria ?? 'Outros'
            map[cat] = (map[cat] ?? 0) + (g.valor ?? 0)
        })
        return Object.entries(map).map(([nome, valor]) => ({ nome, valor }))
    }, [gastos])

    return {
        familyName: familia?.nome ?? '—',
        gastoTotal,
        gastosPorMembro,
        gastosPorCategoria,
        ultimosGastos: gastos,
        qtdMembros: membros.length,
        familiaId,
        isLoading,
        refetch,
    }
}
