import { Lembrete } from '@/src/models/Lembrete'
import { LembretesService } from '@/src/services/lembretesService'

type Resultado = { sucesso: boolean; mensagem: string }

type FormLembrete = {
  nomeGasto: string
  categoria: string
  valor: string
  vencimento: Date | null
  descricao?: string
}

export class LembretesController {
  private service: LembretesService

  constructor(private userId: string) {
    this.service = new LembretesService(userId)
  }

  async criar(form: FormLembrete): Promise<Resultado> {
    try {
      if (!form.nomeGasto || !form.categoria || !form.valor || !form.vencimento) {
        return { sucesso: false, mensagem: 'Preencha todos os campos obrigatórios.' }
      }

      const lembrete = new Lembrete(
        form.nomeGasto.trim(),
        form.categoria,
        form.vencimento.toISOString().split('T')[0],
        parseFloat(form.valor.replace(',', '.')),
        'PENDENTE',
        form.descricao?.trim(),
      )

      await this.service.criarLembrete(lembrete.toFirestore())
      return { sucesso: true, mensagem: 'Lembrete criado com sucesso.' }
    } catch {
      return { sucesso: false, mensagem: 'Erro ao criar lembrete. Tente novamente.' }
    }
  }

  async buscar(): Promise<{ sucesso: boolean; mensagem: string; dados: Lembrete[] }> {
    try {
      const dados = await this.service.buscarLembretes()
      return { sucesso: true, mensagem: '', dados }
    } catch {
      return { sucesso: false, mensagem: 'Erro ao buscar lembretes.', dados: [] }
    }
  }

  async atualizar(id: string, form: Partial<FormLembrete>): Promise<Resultado> {
    try {
      if (!id) return { sucesso: false, mensagem: 'ID do lembrete inválido.' }

      const dados: Record<string, any> = {}
      if (form.nomeGasto) dados.nomeGasto = form.nomeGasto.trim()
      if (form.categoria) dados.categoria = form.categoria
      if (form.valor) dados.valor = parseFloat(form.valor.replace(',', '.'))
      if (form.vencimento) dados.vencimento = form.vencimento.toISOString().split('T')[0]
      if (form.descricao !== undefined) dados.descricao = form.descricao.trim()

      await this.service.atualizar(id, dados)
      return { sucesso: true, mensagem: 'Lembrete atualizado com sucesso.' }
    } catch {
      return { sucesso: false, mensagem: 'Erro ao atualizar lembrete. Tente novamente.' }
    }
  }

  async deletar(id: string): Promise<Resultado> {
    try {
      if (!id) return { sucesso: false, mensagem: 'ID do lembrete inválido.' }
      await this.service.deletar(id)
      return { sucesso: true, mensagem: 'Lembrete deletado com sucesso.' }
    } catch {
      return { sucesso: false, mensagem: 'Erro ao deletar lembrete. Tente novamente.' }
    }
  }

  async alterarStatus(id: string, statusAtual: 'PENDENTE' | 'PAGO'): Promise<Resultado> {
    try {
      if (!id) return { sucesso: false, mensagem: 'ID do lembrete inválido.' }
      const novoStatus = statusAtual === 'PAGO' ? 'PENDENTE' : 'PAGO'
      await this.service.atualizar(id, { status: novoStatus })
      return { sucesso: true, mensagem: novoStatus }
    } catch {
      return { sucesso: false, mensagem: 'Erro ao alterar status. Tente novamente.' }
    }
  }
}
