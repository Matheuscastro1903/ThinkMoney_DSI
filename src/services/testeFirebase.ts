import { cadastrarUsuario, loginUsuario } from "./authService";
import { criarGasto } from './gastosService'
import { criarMeta } from './metasService'
import { criarLembrete } from './lembretesService'


export async function testarFirebase() {
  try {
    await cadastrarUsuario({
      nome: "User teste",
      email: "teste123@gmail.com",
      senha: "123456",
      dataNascimento: "2000-01-15",
    });
    console.log("✅ Usuário cadastrado!");

    console.log('🔐 Fazendo login...')
    const user = await loginUsuario({
      email: 'teste123@gmail.com',
      senha: '123456'
    })
    console.log('✅ Login feito! UID:', user.uid)

    await criarGasto(user.uid, {
      descricao: "Supermercado teste",
      valor: 150.0,
      data: "2024-03-10",
      categoria: "Alimentação",
      fixo: false,
    });
    console.log("✅ Gasto criado!");

    // ─────────────────────────────
    // 4. CRIAR META
    // ─────────────────────────────
    console.log("🎯 Criando meta...");
    await criarMeta(user.uid, {
      nomeObjetivo: "Viagem teste",
      valorTotal: 5000.0,
      dataLimite: "2024-12-31",
    });
    console.log("✅ Meta criada!");

    await criarLembrete(user.uid, {
      nomeGasto: 'Fatura teste',
      categoria: 'Cartão de Crédito',
      vencimento: '2024-03-20',
      valor: 350.00
    })
    console.log('✅ Lembrete criado!')
  } catch (error: any) {
    console.log("error:", error.code, error.message);
  }
}
