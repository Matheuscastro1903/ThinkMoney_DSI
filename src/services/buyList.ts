import { collection, addDoc, Timestamp,query, orderBy, getDocs  } from 'firebase/firestore';
import { db } from './firebaseConfig';


export interface ListaCompra {
  titulo: string;
  criadoEm: Timestamp;
  categoria: string;
  dataPrazo?: Date | null;
  totalCompra: number;
  descricao?: string;
  listaFinalizada: boolean; //status global para ver se todos os produtos já foram comprados
}

export interface ProdutoCompra {
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
  
  /**
   * Função oficial para criar uma nova lista de compras no Firebase
   */
  async criarLista(userId: string, dadosBasicos: { 
      titulo: string; 
      categoria: string; 
      descricao?: string;
      localCompra:string 
    }, 
    produtos: ProdutoCompra[]): Promise<respostaApi> {
    try {

      console.log("Iniciando a criação da lista no Firebase...");

      //irá passar por cada valor da lista produto e irá somar a variável total que está 
      //atribuindo seu valor ao valorTotalCalculado
      const valorTotalCalculado = produtos.reduce((total, produto) => total + Number(produto.valor), 0);
      
      

      //Verifica se todos os produtos foram comprados (se a lista estiver vazia, retorna false)
      //se a lista tiver 1000000 e de primeira aparecer um false,ele já vai pro false
      const todosComprados = produtos.length > 0 
        ? produtos.every((produto) => produto.comprado) 
        : false;

     
      const listaPayload: ListaCompra = {
        titulo: dadosBasicos.titulo,
        categoria: dadosBasicos.categoria,
        descricao: dadosBasicos.descricao,
        totalCompra: valorTotalCalculado,
        listaFinalizada: todosComprados,
        criadoEm: Timestamp.now(), //Gera a data exata do servidor do Google
      };

      //Acessa a coleção e salva a Capa da lista
      const listasRef = collection(db, 'usuarios', userId, 'listasCompras');

      // adicionando o documento de listasCompras,ficando assim
      /**
       
      listasCompras {
            "xj7B9LpM20Kqz": {
            "titulo": "Compras da Semana (Script)",
            "criadoEm": "8 de junho de 2026"
            }
            }
       */
      const novaListaDoc = await addDoc(listasRef, listaPayload);

      console.log(" Capa da lista criada com ID:", novaListaDoc.id);

      //Acessa a subcoleção "produtos" da lista recém-criada
      const produtosRef = collection(db, 'usuarios', userId, 'listasCompras', novaListaDoc.id, 'produtos');

      //Salva cada produto dentro da subcoleção listaCompras
      for (const produto of produtos) {
        await addDoc(produtosRef, produto);
      }

      console.log(" Lista e produtos cadastrados com sucesso!");
      
      return {sucesso:true,
              mensagem:"Sua lista de compras foi cadastrada!"

      }

    } catch (error) {
      console.error("❌ Erro ao criar a lista:",error);
      return {sucesso:false,
              mensagem:error

      }
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

  
}

export const toBuyListService = new ToBuyListService();