import { Usuario } from '@/src/models/usuario'
import { useRouter } from 'expo-router'

import { useUsuarioLogado } from '@/src/hooks/useUsuarioLogado'
import { Alert } from 'react-native'
import { useFamilia } from './useFamilia'
import { useFamiliaAcoes } from './useFamiliaAcoes'

/**
 * Hook da tela Editar família.
 * Combina leitura de membros com as ações de remover membro,
 * sair da família e excluir a família, todas com confirmação via Alert.
 */
export function useFamiliaEditar() {
    const router = useRouter()
    const { familiaId, usuario: usuarioLogado, isLoading: isLoadingUsuario } = useUsuarioLogado()
    const { familia, membros, isLoading: isLoadingFamilia, refetch } = useFamilia(familiaId)
    const acoes = useFamiliaAcoes()

    const isUsuarioLogadoAdmin = usuarioLogado?.email === familia?.admin.email

    function confirmarRemoverMembro(membro: Usuario) {
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

    async function salvarAlteracoes(novoNome: string) {
        if (!familiaId) return
        await acoes.editarFamilia(familiaId, novoNome)
        refetch()
        router.back()
    }

    return {
        familia,
        familyName: familia?.nome ?? '',
        membros,
        isLoading: isLoadingFamilia || acoes.isLoading || isLoadingUsuario,
        isUsuarioLogadoAdmin,
        confirmarRemoverMembro,
        salvarAlteracoes,
    }
}
