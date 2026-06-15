import { collection, addDoc, Timestamp,query, orderBy, getDocs,doc,getDoc,deleteDoc,updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';


export interface ListaCompra {
  titulo: string;
  criadoEm: Timestamp;
  categoria: string;
  localCompra:string,
  dataPrazo?: Date | null;
  totalCompra: number;
  descricao?: string;
  listaFinalizada: boolean; //status global para ver se todos os produtos já foram comprados

}

export interface ProdutoCompra {
  id:string
  nome: string;
  quantidade: number;
  valor: number; 
  comprado: boolean;
}

// O <T = any> significa que o campo 'dados' pode receber qualquer formato,
// mas se não passarmos nada, ele aceita numa boa.
interface respostaApi<T = any> {
  sucesso: boolean;
  mensagem: string | unknown;
  dados?: T;
}

export interface ResumoListaCompra {
  id: string;
  titulo: string;
  categoria: string;
  totalCompra: number;
}


class ToBuyListService {
  
  
  async criarLista(
    userId: string, 
    pacoteCompleto: any //recebe o JSON inteiro gerado pelo toFirestore()
  ): Promise<respostaApi> {
    try {
      console.log("Iniciando a criação da lista no Firebase...");

      //desestrutura o pacote completo em duas partes     
      const { produtos, ...dadosBasicos } = pacoteCompleto;

      const valorTotalCalculado = produtos.reduce((total: any, produto: any) => 
        total + Number(produto.valor * (produto.quantidade || 1)), 0
      );

      //Verifica se todos os produtos foram comprados (se a lista estiver vazia, retorna false)
      //se a lista tiver 1000000 e de primeira aparecer um false, ele já vai pro false
      const todosComprados = produtos.length > 0 
        ? produtos.every((produto: any) => produto.comprado) 
        : false;

      //Monta o payload final que vai para o documento principal
      const listaPayload = {
        titulo: dadosBasicos.titulo,
        categoria: dadosBasicos.categoria,
        descricao: dadosBasicos.descricao,
        localCompra: dadosBasicos.localCompra,
        totalCompra: valorTotalCalculado,
        listaFinalizada: todosComprados,
        criadoEm: Timestamp.now(), //Gera a data exata do servidor do Google
      };

      //Acessa a coleção e salva os dados básicos
      const listasRef = collection(db, 'usuarios', userId, 'listasCompras');

      const novaListaDoc = await addDoc(listasRef, listaPayload);

      console.log(" Capa da lista criada com ID:", novaListaDoc.id);

      //Acessa a subcoleção "produtos" da lista recém-criada
      const produtosRef = collection(db, 'usuarios', userId, 'listasCompras', novaListaDoc.id, 'produtos');

      //Salva cada produto dentro da subcoleção produtos
      for (const produto of produtos) {
        await addDoc(produtosRef, produto);
      }

      console.log(" Lista e produtos cadastrados com sucesso!");
      
      return {
        sucesso: true,
        mensagem: "Sua lista de compras foi cadastrada!"
      };

    } catch (error) {
      console.error(" Erro ao criar a lista:", error);
      return {
        sucesso: false,
        mensagem: error
      };
    }
  }
  async buscarResumoListas(userId: string): Promise<respostaApi<ResumoListaCompra[]>> {
    try {
      console.log("Buscando listas de compras do usuário...");

      const q = query(
        collection(db, 'usuarios', userId, 'listasCompras'),
        orderBy('criadoEm', 'desc') 
      );

      const snapshot = await getDocs(q);
      
      //função pega apenas o necessário para mostrar na tela
      const listas = snapshot.docs.map((doc) => {
        const data = doc.data() as ListaCompra;
        
        return {
          id: doc.id,
          titulo: data.titulo,
          categoria: data.categoria,
          totalCompra: data.totalCompra
        };
      });

      console.log(` ${listas.length} listas encontradas.`);
      
      //Retorno no padrão de SUCESSO
      return {
        sucesso: true,
        mensagem: "Listas carregadas com sucesso!",
        dados: listas
      };

    } catch (error) {
      console.error(" Erro ao buscar as listas:", error);
      
      //Retorno no padrão de ERRO
      return {
        sucesso: false,
        mensagem: error
      };
    }
  }
  async buscarListaPorId(userId: string, idLista: string): Promise<respostaApi> {
  try {
    //pega as informações básicas da lista
    const docRef = doc(db, 'usuarios', userId, 'listasCompras', idLista);
    const docSnap = await getDoc(docRef);
    
    // Se existir as inf básica...
    if (docSnap.exists()) {
      const dadosDoBanco = docSnap.data();
      
      //abrimos a subcoleção para buscar os produtos dessa lista!
      const produtosRef = collection(db, 'usuarios', userId, 'listasCompras', idLista, 'produtos');
      const produtosSnap = await getDocs(produtosRef);
      
      //Transformamos os documentos do Firebase em um array legível
      const arrayDeProdutos = produtosSnap.docs.map(docProduto => {
        return {
          id: docProduto.id, // O ID real do documento do produto no banco
          ...docProduto.data()
        };
      });
      
      
      return {
        sucesso: true,
        mensagem: "Lista recuperada com sucesso.",
        dados: { 
          id: docSnap.id, 
          ...dadosDoBanco, 
          produtos: arrayDeProdutos 
        }
      };
      
    } else {
      
      return {
        sucesso: false,
        mensagem: "Nenhuma lista encontrada com este ID.",
      };
    }
       
  } catch (error) {
    console.error("Erro ao buscar a lista específica:", error);
    return {
      sucesso: false,
      mensagem: error instanceof Error ? error.message : "Erro desconhecido ao conectar com o banco de dados.",
    };
  }
}

  async excluirLista(userId: string, idLista: string): Promise<respostaApi> {
    try {
      console.log(`Iniciando exclusão da lista ${idLista}...`);

      //Primeiro, mapeamos a subcoleção de produtos
      const produtosRef = collection(db, 'usuarios', userId, 'listasCompras', idLista, 'produtos');
      const produtosSnap = await getDocs(produtosRef);

      //Deletamos todos os produtos PRIMEIRO. para não restar coleções zumbis
      //usar Promise.all para disparar todas as deleções ao mesmo tempo (Paralelo),
      //sendo mais rápido do que deletar um por um com um "for" normal.
      const deletarProdutosPromises = produtosSnap.docs.map((docProduto) => {
        return deleteDoc(docProduto.ref);
      });
      await Promise.all(deletarProdutosPromises);

      console.log(`${produtosSnap.size} produtos excluídos com sucesso.`);

      //pasta de produtos está vazia, deleta as informações básicas da Lista
      const listaRef = doc(db, 'usuarios', userId, 'listasCompras', idLista);
      await deleteDoc(listaRef);

      console.log("Capa da lista excluída com sucesso.");

      return {
        sucesso: true,
        mensagem: "Lista de compras apagada permanentemente."
      };

    } catch (error) {
      console.error("Erro ao excluir a lista:", error);
      return {
        sucesso: false,
        mensagem: error instanceof Error ? error.message : "Erro desconhecido ao tentar excluir a lista.",
      };
    }
  }
  
  async atualizarLista(userId: string, idLista: string,pacoteCompleto: any): Promise<respostaApi> {
    try {
      console.log(`Iniciando a atualização da lista ${idLista}...`);

      //Recalcula o valor total com base nos produtos atuais da tela
      
      const { produtos, ...dadosBasicos } = pacoteCompleto;

      const valorTotalCalculado = produtos.reduce((total:any, produto:any) => 
          total + Number(produto.valor * (produto.quantidade || 1)), 0
      );
      //Recalcula se todos os produtos foram marcados como comprados
      const todosComprados = produtos.length > 0 
        ? produtos.every((produto:any) => produto.comprado) 
        : false;

      //montagem do envelope para enviar
      const capaAtualizadaPayload = {
        titulo: dadosBasicos.titulo,
        categoria: dadosBasicos.categoria,
        descricao: dadosBasicos.descricao || "",
        localCompra: dadosBasicos.localCompra,
        totalCompra: valorTotalCalculado,
        listaFinalizada: todosComprados,
      };

      //Atualiza o documento principal  
      const listaRef = doc(db, 'usuarios', userId, 'listasCompras', idLista);
      await updateDoc(listaRef, capaAtualizadaPayload);

      console.log("Capa da lista atualizada com sucesso. Limpando produtos antigos...");

      
      const produtosRef = collection(db, 'usuarios', userId, 'listasCompras', idLista, 'produtos');
      //pega todas as subcoleções antigas
      const produtosAntigosSnap = await getDocs(produtosRef);

      //Deleta todos os produtos antigos para evitar duplicidade ou itens fantasmas
      const promisesDelecao = produtosAntigosSnap.docs.map(docProd => deleteDoc(docProd.ref));
      await Promise.all(promisesDelecao);

      console.log("Produtos antigos limpos. Inserindo os novos produtos da tela...");

      //Salva a nova configuração de produtos vinda da tela
      for (const produto of produtos) { 
        await addDoc(produtosRef, produto);
      }

      console.log("Lista e produtos atualizados com sucesso total!");

      return {
        sucesso: true,
        mensagem: "Sua lista de compras foi atualizada com sucesso!"
      };

    } catch (error) {
      console.error("Erro ao atualizar a lista de compras:", error);
      return {
        sucesso: false,
        mensagem: error instanceof Error ? error.message : "Erro desconhecido ao atualizar a lista.",
      };
    }
  }

  
}

export const toBuyListService = new ToBuyListService();


/* Retorno da função de retornar lista
{
  "sucesso": true,
  "mensagem": "Lista recuperada com sucesso.",
  "dados": {
    "id": "K7mP9xL2wQzR1aB5c", //id da lista
    "titulo": "Feira Mensal",
    "categoria": "alimentacao",
    "descricao": "Compras para a primeira semana de junho",
    "totalCompra": 145.50,
    "listaFinalizada": false,
    "criadoEm": {
      "seconds": 1718148867,
      "nanoseconds": 0
    },
    "produtos": [
      {
        "nome": "Arroz 5kg",
        "quantidade": 1,
        "valor": 28.90,
        "comprado": true
      },
      {
        "nome": "Café em pó",
        "quantidade": 2,
        "valor": 15.00,
        "comprado": false
      },
      {
        "nome": "Leite Integral",
        "quantidade": 12,
        "valor": 5.50,
        "comprado": false
      }
    ]
  }
}
*/