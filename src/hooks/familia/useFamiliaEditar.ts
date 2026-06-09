import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useUsuarioLogado } from '@/src/hooks/useUsuarioLogado'
import { useFamilia } from './useFamilia'
import { useFamiliaAcoes } from './useFamiliaAcoes'
import { UsuarioProps } from '@/src/types/usuario'

/**
 * Hook da tela Editar família.
 * Combina leitura de membros com as ações de remover membro,
 * sair da família e excluir a família, todas com confirmação via Alert.
 */
export function useFamiliaEditar() {
    const router = useRouter()
    const { familiaId } = useUsuarioLogado()
    const { familia, membros, isLoading, refetch } = useFamilia(familiaId)
    const acoes = useFamiliaAcoes()

    function confirmarRemoverMembro(membro: UsuarioProps) {
        Alert.alert(
            'Remover membro',
            `Deseja remover ${membro.nome} da família?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        if (!familiaId) return
                        await acoes.removerMembro(familiaId, membro)
                        refetch()
                    },
                },
            ]
        )
    }

    function confirmarSairDaFamilia() {
        Alert.alert(
            'Sair da Família',
            'Tem certeza que deseja sair desta família? Você precisará de um novo código para entrar novamente.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        if (!familiaId) return
                        await acoes.sairDaFamilia(familiaId)
                    },
                },
            ]
        )
    }

    function confirmarExcluirFamilia() {
        Alert.alert(
            'Excluir Família',
            'Ao excluir a família, todos os dados compartilhados serão permanentemente removidos. Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        if (!familiaId) return
                        await acoes.excluirFamilia(familiaId)
                    },
                },
            ]
        )
    }

    async function salvarAlteracoes(novoNome: string) {
        if (!familiaId) return
        await acoes.editarFamilia(familiaId, novoNome)
        refetch()
        router.back()
    }

    return {
        familia,
        membros,
        isLoading: isLoading || acoes.isLoading,
        confirmarRemoverMembro,
        confirmarSairDaFamilia,
        confirmarExcluirFamilia,
        salvarAlteracoes,
    }
}
