import {
  collection, doc, addDoc, setDoc, updateDoc,
  getDocs, query, where, increment, Timestamp
} from 'firebase/firestore'
import { db } from './firebaseConfig'
import { auth } from './firebaseConfig'
import { arrayUnion } from 'firebase/firestore'
import { getDoc, deleteDoc } from 'firebase/firestore'
import { loginUsuario } from "./authService"
// ─────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────

interface Familia {
  codigo: string
  adminId: string
  numeroMembros: number
  membros: string[]
  criadoEm: Timestamp
}

interface GastoFamiliar {
  uid: string
  categoria: string
  data: Timestamp
  descricao: string
  valor: number
  criadoEm: Timestamp
}

interface MetaFamiliar {
  descricao: string
  valorTotal: number
  valorPoupado: number
  dataLimite: string
  contribuicoes: Record<string, number>
  criadoEm: Timestamp
}

// ─────────────────────────────────────────
// HELPER — gera código tipo "FAM-8X2K"
// ─────────────────────────────────────────

function gerarCodigo(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const parte = (n: number) =>
    Array.from({ length: n }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  return `FAM-${parte(4)}`
}

// ─────────────────────────────────────────
// ETAPA 1 — CRIAR FAMÍLIA
// ─────────────────────────────────────────

async function criarFamilia(): Promise<string> {
  console.log('\n📋 ETAPA 1 — Criando família...')

  // Pega o usuário logado
  const user = auth.currentUser
  if (!user) throw new Error('Nenhum usuário logado. Faça login antes.')

  const codigo = gerarCodigo()

  const ref = await addDoc(collection(db, 'familias'), {
    codigo,
    adminId: user.uid,
    numeroMembros: 1,            // começa com 1 (só o criador)
    membros: [user.uid],         // só o criador no array
    criadoEm: Timestamp.now()
  } as Familia)

  console.log('✅ Família criada!')
  console.log(`   ID:             ${ref.id}`)
  console.log(`   Código:         ${codigo}`)
  console.log(`   Admin:          ${user.uid}`)
  console.log(`   Número membros: 1`)

  return ref.id
}

// ─────────────────────────────────────────
// ETAPA 2 — CRIAR GASTO DA FAMÍLIA
// ─────────────────────────────────────────

async function criarGasto(
  familiaId: string,
  dados: {
    uid: string
    categoria: string
    descricao: string
    valor: number
  }
): Promise<void> {
  console.log('\n💸 ETAPA 2 — Criando gasto familiar...')

  await addDoc(collection(db, 'familias', familiaId, 'gastos'), {
    uid: dados.uid,
    categoria: dados.categoria,
    data: Timestamp.now(),
    descricao: dados.descricao,
    valor: dados.valor,
    criadoEm: Timestamp.now()
  } as GastoFamiliar)

  console.log('✅ Gasto criado!')
  console.log(`   UID membro: ${dados.uid}`)
  console.log(`   Categoria:  ${dados.categoria}`)
  console.log(`   Descrição:  ${dados.descricao}`)
  console.log(`   Valor:      R$ ${dados.valor.toFixed(2)}`)
}

// ─────────────────────────────────────────
// ETAPA 3 — CRIAR META DA FAMÍLIA
// ─────────────────────────────────────────

async function criarMeta(
  familiaId: string,
  dados: {
    descricao: string
    valorTotal: number
    dataLimite: string
    contribuicoes: Record<string, number>   // { uid: valor }
  }
): Promise<void> {
  console.log('\n🎯 ETAPA 3 — Criando meta familiar...')

  // Calcula o valorPoupado como soma das contribuições
  const valorPoupado = Object.values(dados.contribuicoes)
    .reduce((acc, val) => acc + val, 0)

  await addDoc(collection(db, 'familias', familiaId, 'metas'), {
    descricao: dados.descricao,
    valorTotal: dados.valorTotal,
    valorPoupado,
    dataLimite: dados.dataLimite,
    contribuicoes: dados.contribuicoes,
    criadoEm: Timestamp.now()
  } as MetaFamiliar)

  console.log('✅ Meta criada!')
  console.log(`   Descrição:     ${dados.descricao}`)
  console.log(`   Valor total:   R$ ${dados.valorTotal.toFixed(2)}`)
  console.log(`   Valor poupado: R$ ${valorPoupado.toFixed(2)}`)
  console.log(`   Data limite:   ${dados.dataLimite}`)
  console.log('   Contribuições:')
  Object.entries(dados.contribuicoes).forEach(([uid, valor]) => {
    console.log(`     ${uid} → R$ ${valor.toFixed(2)}`)
  })
}

// ─────────────────────────────────────────
// ETAPA 4 — ADICIONAR MEMBRO A FAMÍLIA
// ─────────────────────────────────────────




/**
 * Adiciona um novo membro à família e incrementa o contador.
 */
async function adicionarMembro(familiaId: string, novoMembroUid: string): Promise<void> {
  console.log(`\n👤 Adicionando membro ${novoMembroUid} à família...`)

  const familiaRef = doc(db, 'familias', familiaId)

  await updateDoc(familiaRef, {
    membros: arrayUnion(novoMembroUid),
    numeroMembros: increment(1)
  })

  console.log('✅ Membro adicionado com sucesso!')
}

// -----------------------
//.  ETAPA 5 - EDITAR GASTOS
// -----------------------


/**
 * Edita um gasto existente.
 */
async function editarGasto(familiaId: string, gastoId: string, novosDados: Partial<GastoFamiliar>): Promise<void> {
  const gastoRef = doc(db, 'familias', familiaId, 'gastos', gastoId)
  await updateDoc(gastoRef, novosDados)
  console.log('✅ Gasto atualizado!')
}

/**
 * Exclui um gasto, mas apenas se o usuário logado for o dono do registro.
 */
async function excluirGasto(familiaId: string, gastoId: string): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new Error('Usuário não autenticado.')

  const gastoRef = doc(db, 'familias', familiaId, 'gastos', gastoId)
  const snap = await getDoc(gastoRef)

  if (!snap.exists()) throw new Error('Gasto não encontrado.')

  const dadosGasto = snap.data() as GastoFamiliar

  // Verificação de segurança: Só o dono do UID pode deletar
  if (dadosGasto.uid !== user.uid) {
    throw new Error('Permissão negada: Você não é o dono deste registro de gasto.')
  }

  await deleteDoc(gastoRef)
  console.log('🗑️ Gasto excluído com sucesso!')
}

// ─────────────────────────────────────────
// EDITAR E EXCLUIR METAS
// ─────────────────────────────────────────

/**
 * Edita uma meta (ex: atualizar valor poupado ou descrição).
 */
async function editarMeta(familiaId: string, metaId: string, novosDados: Partial<MetaFamiliar>): Promise<void> {
  const metaRef = doc(db, 'familias', familiaId, 'metas', metaId)
  await updateDoc(metaRef, novosDados)
  console.log('✅ Meta atualizada!')
}

/**
 * Exclui uma meta familiar.
 */
async function excluirMeta(familiaId: string, metaId: string): Promise<void> {
  const metaRef = doc(db, 'familias', familiaId, 'metas', metaId)
  await deleteDoc(metaRef)
  console.log('🗑️ Meta removida!')
}





// ─────────────────────────────────────────
// SCRIPT PRINCIPAL — roda as 3 etapas
// ─────────────────────────────────────────


export async function testarFamilias(): Promise<void> {
  console.log('🔥 Iniciando teste de famílias...')

  try {

    await loginUsuario({
        email: 'teste123@gmail.com',
        senha: '123456'
    })
    const user = auth.currentUser
    if (!user) throw new Error('Nenhum usuário logado.')

        

    // ── ETAPA 1: criar família ──
    const familiaId = await criarFamilia()

    // ── ETAPA 2: criar gasto ──
    await criarGasto(familiaId, {
      uid: user.uid,
      categoria: 'Cachaça',
      descricao: 'Compras do mercado',
      valor: 250.00
    })

    // ── ETAPA 3: criar meta ──
    await criarMeta(familiaId, {
      descricao: 'Viagem em família',
      valorTotal: 10000.00,
      dataLimite: '2024-12-31',
      contribuicoes: {
        [user.uid]: 500.00    // usuário logado já contribui com R$ 500
      }
    })

    console.log('\n🎉 TODAS AS ETAPAS CONCLUÍDAS!')
    console.log('👉 Confira agora no console do Firebase.')

  } catch (error: any) {
    console.log('❌ Erro:', error.message)
  }
}

export async function testarNovasFuncoes(): Promise<void> {
  console.log('🧪 Iniciando Testes de Gerenciamento Familiar...');

  try {
    // 1. Login (Usando seu serviço existente)
    await loginUsuario({ email: 'teste123@gmail.com', senha: '123456' });
    const user = auth.currentUser;
    if (!user) throw new Error('Falha no login.');

    // 2. Criar uma nova família para o teste
    const familiaId = await criarFamilia();

    // 3. TESTE: Adicionar Membro
    // Simulando um UID de outro membro
    const novoMembroFake = "USER_ID_EXTERNO_123";
    await adicionarMembro(familiaId, novoMembroFake);

    // 4. TESTE: Criar e depois Editar um Gasto
    // Primeiro, precisamos do ID do gasto gerado pelo addDoc
    const gastoRef = await addDoc(collection(db, 'familias', familiaId, 'gastos'), {
      uid: user.uid,
      categoria: 'Alimentação',
      valor: 50.00,
      descricao: 'Lanche de teste',
      criadoEm: Timestamp.now()
    });
    
    console.log('📝 Editando o gasto recém-criado...');
    await editarGasto(familiaId, gastoRef.id, { valor: 75.50, descricao: 'Lanche com upgrade' });

    // 5. TESTE: Excluir Gasto (Dono do gasto)
    console.log('🗑️ Testando exclusão pelo proprietário...');
    await excluirGasto(familiaId, gastoRef.id);

    // 6. TESTE: Tentar excluir gasto de outro usuário (Deve falhar)
    console.log('🚫 Testando restrição de segurança (excluir gasto alheio)...');
    const gastoAlheioRef = await addDoc(collection(db, 'familias', familiaId, 'gastos'), {
      uid: "OUTRO_USUARIO_UID",
      categoria: 'Lazer',
      valor: 100.00,
      descricao: 'Não deve ser excluído por mim',
      criadoEm: Timestamp.now()
    });

    try {
      await excluirGasto(familiaId, gastoAlheioRef.id);
    } catch (err: any) {
      console.log(`✅ Sucesso no bloqueio: ${err.message}`);
    }

    // 7. TESTE: Criar e excluir uma Meta
    console.log('🎯 Testando fluxo de metas...');
    const metaRef = await addDoc(collection(db, 'familias', familiaId, 'metas'), {
      descricao: 'Reserva de Emergência',
      valorTotal: 5000,
      valorPoupado: 0,
      criadoEm: Timestamp.now()
    });
    await excluirMeta(familiaId, metaRef.id);

    console.log('\n✨ TODOS OS TESTES FORAM EXECUTADOS COM SUCESSO!');

  } catch (error: any) {
    console.error('❌ Falha durante os testes:', error.message);
  }
}