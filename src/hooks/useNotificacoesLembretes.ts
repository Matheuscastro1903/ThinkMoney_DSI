import { useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { auth } from '@/src/services/firebaseConfig'
import { LembretesService } from '@/src/services/lembretesService'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

async function solicitarPermissao(): Promise<boolean> {
  if (Platform.OS === 'web') return false

  const { status: existente } = await Notifications.getPermissionsAsync()
  if (existente === 'granted') return true

  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

async function agendarNotificacoesLembretes(userId: string) {
  const temPermissao = await solicitarPermissao()
  if (!temPermissao) return

  // Cancela notificações antigas de lembretes antes de reagendar
  const agendadas = await Notifications.getAllScheduledNotificationsAsync()
  for (const n of agendadas) {
    if (n.content.data?.tipo === 'lembrete') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier)
    }
  }

  const service = new LembretesService(userId)
  const lembretes = await service.buscarLembretes()

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  for (const lembrete of lembretes) {
    if (lembrete.status === 'PAGO') continue

    const vencimento = new Date(lembrete.vencimento + 'T00:00:00')
    const diffDias = Math.round(
      (vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDias !== 0 && diffDias !== 1 && diffDias !== 2) continue

    const valorFormatado = lembrete.valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    const mensagens = {
      0: { title: '🚨 Lembrete vence hoje!', body: `${lembrete.nomeGasto} vence hoje — ${valorFormatado}` },
      1: { title: '⚠️ Lembrete vence amanhã!', body: `${lembrete.nomeGasto} vence amanhã — ${valorFormatado}` },
      2: { title: '⏰ Lembrete vencendo em breve!', body: `${lembrete.nomeGasto} vence em 2 dias — ${valorFormatado}` },
    }

    const { title, body } = mensagens[diffDias as 0 | 1 | 2]

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { tipo: 'lembrete', id: lembrete.id },
      },
      trigger: null,
    })
  }
}

export function useNotificacoesLembretes() {
  useEffect(() => {
    const usuario = auth.currentUser
    if (!usuario) return

    agendarNotificacoesLembretes(usuario.uid)
  }, [])
}
