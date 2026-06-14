import { useUsuarioLogado } from '@/src/hooks/useUsuarioLogado'
import { Usuario } from '@/src/models/usuario'
import familiaService from '@/src/services/familiasService'
import usuarioService from '@/src/services/usuarioService'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

/**
 * Hook de mutações da família.
 * Centraliza todas as operações que alteram estado no Firestore.
 * As funções marcadas com "Sincroniza usuário" também chamam
 * usuarioService.atualizarFamiliaId para manter o vínculo
 * usuário ↔ família consistente entre sessões.
 */
export function useFamiliaAcoes() {
    const { uid, usuario } = useUsuarioLogado()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function criarFamilia(nome: string): Promise<{ id: string, codigo_convite: string } | null> {
        if (!uid || !usuario) return null
        if (!nome.trim()) {
            Alert.alert('Campo obrigatório', 'Por favor, insira um nome para a família.')
            return null
        }

        setIsLoading(true)
        setError(null)
        try {
            const resultado = await familiaService.criarFamilia(nome.trim(), usuario as Usuario)
            await usuarioService.atualizarFamiliaId(uid, resultado.id)
            return resultado
        } catch (err) {
            console.error('Erro ao criar família:', err)
            setError('Não foi possível criar a família.')
            Alert.alert('Erro', 'Não foi possível criar a família. Tente novamente.')
            return null
        } finally {
            setIsLoading(false)
        }
    }

    async function editarFamilia(familiaId: string, novoNome: string): Promise<void> {
        if (!novoNome.trim()) {
            Alert.alert('Campo obrigatório', 'Por favor, insira um nome para a família.')
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            await familiaService.editarFamilia(familiaId, novoNome.trim())
        } catch (err) {
            console.error('Erro ao editar família:', err)
            setError('Não foi possível salvar as alterações.')
            Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    async function excluirFamilia(familiaId: string): Promise<void> {
        if (!uid) return
        setIsLoading(true)
        setError(null)
        try {
            await familiaService.excluirFamilia(familiaId)
            await usuarioService.atualizarFamiliaId(uid, null)
            router.replace('/(tabs)/familia/entrar')
        } catch (err) {
            console.error('Erro ao excluir família:', err)
            setError('Não foi possível excluir a família.')
            Alert.alert('Erro', 'Não foi possível excluir a família. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    async function adicionarMembro(familiaId: string, membro: Usuario): Promise<void> {
        setIsLoading(true)
        setError(null)
        try {
            await familiaService.adicionarMembro(familiaId, membro)
        } catch (err) {
            console.error('Erro ao adicionar membro:', err)
            setError('Não foi possível adicionar o membro.')
            Alert.alert('Erro', 'Não foi possível adicionar o membro. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    async function removerMembro(familiaId: string, membro: Usuario): Promise<void> {
        setIsLoading(true)
        setError(null)
        try {
            await familiaService.removerMembro(familiaId, membro)
        } catch (err) {
            console.error('Erro ao remover membro:', err)
            setError('Não foi possível remover o membro.')
            Alert.alert('Erro', 'Não foi possível remover o membro. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    async function sairDaFamilia(familiaId: string): Promise<void> {
        if (!uid || !usuario) return
        setIsLoading(true)
        setError(null)
        try {
            await familiaService.removerMembro(familiaId, usuario as Usuario)
            await usuarioService.atualizarFamiliaId(uid, null)
            router.replace('/(tabs)/familia/entrar')
        } catch (err) {
            console.error('Erro ao sair da família:', err)
            setError('Não foi possível sair da família.')
            Alert.alert('Erro', 'Não foi possível sair da família. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    // ─── Buscar por código ────────────────────────────────────────────────────
    // Apenas leitura — não altera vínculo.
    async function buscarPorCodigo(codigo: string) {
        setIsLoading(true)
        setError(null)
        try {
            return await familiaService.buscarPorCodigo(codigo.trim().toUpperCase())
        } catch (err) {
            console.error('Erro ao buscar família por código:', err)
            setError('Não foi possível verificar o código.')
            return null
        } finally {
            setIsLoading(false)
        }
    }

    // ─── Entrar em família via código ─────────────────────────────────────────
    // Sincroniza usuário: grava o familiaId encontrado no perfil do usuário.
    async function entrarEmFamilia(codigo: string): Promise<boolean> {
        if (!uid || !usuario) return false

        setIsLoading(true)
        setError(null)
        try {
            const familia = await familiaService.buscarPorCodigo(codigo.trim().toUpperCase())

            if (!familia) {
                Alert.alert('Código inválido', 'Nenhuma família encontrada com este código.')
                return false
            }

            await familiaService.adicionarMembro(familia.id, usuario as Usuario)
            await usuarioService.atualizarFamiliaId(uid, familia.id)
            return true
        } catch (err) {
            console.error('Erro ao entrar na família:', err)
            setError('Não foi possível entrar na família.')
            Alert.alert('Erro', 'Não foi possível entrar na família. Tente novamente.')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        error,
        criarFamilia,
        editarFamilia,
        excluirFamilia,
        adicionarMembro,
        removerMembro,
        sairDaFamilia,
        buscarPorCodigo,
        entrarEmFamilia,
    }
}
