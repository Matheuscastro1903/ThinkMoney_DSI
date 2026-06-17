import { useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/src/services/firebaseConfig'
import usuarioService from '@/src/services/usuarioService'
import { Usuario } from '@/src/models/usuario'

/**
 * Hook base de autenticação e perfil.
 * Escuta o estado do Firebase Auth e carrega o perfil completo do usuário
 * (incluindo familiaId) do Firestore. É a fonte de familiaId para todos
 * os hooks do módulo família.
 */


export function useUsuarioLogado() {
    const [uid, setUid] = useState<string | null>(null)
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUid(null)
                setUsuario(null)
                setIsLoading(false)
                return
            }

            setUid(firebaseUser.uid)

            try {
                const dadosUsuario = await usuarioService.buscarDadosUsuario(firebaseUser.uid)
                setUsuario(dadosUsuario)
            } catch (error) {
                console.error('Erro ao carregar dados do usuário logado:', error)
                setUsuario(null)
            } finally {
                setIsLoading(false)
            }
        })

        return unsubscribe
    }, [])

    const refreshUsuario = useCallback(async () => {
        if (!uid) return 
        try {
            const dadosUsuario = await usuarioService.buscarDadosUsuario(uid)
            setUsuario(dadosUsuario)

        } catch (error) {
            console.error("Erro ao atualizar o usuário:", error)
        }
    }, [uid])

    return {
        uid,
        usuario,
        familiaId: usuario?.familia?.id ?? (usuario as any)?.familiaId ?? null,
        isLoading, 
        refreshUsuario,
    }


}
