import { toBuyListService, ResumoListaCompra } from "@/src/services/buyList";
import {ProdutoCompra,ListaCompra } from "../models/lista";

export interface RespostaControllerListas {
  sucesso: boolean;
  mensagem: string | unknown
  dados?: ResumoListaCompra[];
}

export interface RespostaControllerListaUnica {
  sucesso: boolean;
  mensagem: string | unknown;
  dados?: any; //dados que vão vir é o objeto json
}

export interface ProdutoCompraProps {
  id:string
  nome: string;
  quantidade: number;
  valor: number; 
  comprado: boolean;
}

export async function ControllerBuscarResumoListas(
  userId: string | undefined | null
): Promise<RespostaControllerListas> {
  
  
  //Se o ID vier vazio, ele nem aciona o banco de dados.
  if (!userId || userId.trim() === '') {
    return {
      sucesso: false,
      mensagem: "Usuário não autenticado. Faça login novamente."
    };
  }

  try {
    
    const resposta = await toBuyListService.buscarResumoListas(userId);

    // 3. Tratamento da Resposta do Serviço
    if (resposta.sucesso && resposta.dados) {
      return resposta;

    } else {
      
      return {
        sucesso: false,
        mensagem: String(resposta.mensagem) || "Não foi possível carregar suas listas."
      };
    }

  } catch (error) {
    //trata falhas não programadas
    return {
      sucesso: false,
      mensagem: "Erro inesperado ao conectar com o servidor. Tente novamente."
    };
  }
}




export async function ControllerBuscarListaPorId(
  userId: string | undefined | null,
  idLista: string | undefined | null
): Promise<RespostaControllerListaUnica> {
  
  //segurança caso o id venha vazio
  if (!userId || userId.trim() === '') {
    return {
      sucesso: false,
      mensagem: "Usuário não autenticado. Faça login novamente."
    };
  }

  //verifica se o id da lista veio
  if (!idLista || idLista.trim() === '') {
    return {
      sucesso: false,
      mensagem: "O identificador da lista não foi fornecido."
    };
  }

  try {

    
    const resposta = await toBuyListService.buscarListaPorId(userId, idLista);

    
    if (resposta.sucesso && resposta.dados) {
      return resposta; //Repassa o objeto intacto para a Tela

    } else {
      return {
        sucesso: false,
        mensagem: String(resposta.mensagem) || "Não foi possível carregar os detalhes desta lista."
      };
    }

  } catch (error) {
    //tratamento de erros inesperados
    return {
      sucesso: false,
      mensagem: "Erro inesperado ao conectar com o servidor. Tente novamente."
    };
  }
}


export async function ControllerAtualizarLista(
  userId: string | undefined | null,
  idLista: string | undefined | null,
  dadosBasicos: { titulo: string; categoria: string; descricao?: string; localCompra: string },
  produtos: ProdutoCompra[] 
): Promise<RespostaControllerListas> {
  
  if (!userId || !idLista) {
    return { sucesso: false, mensagem: "Dados de autenticação inválidos." };
  }

  try {
    
    //cria um aarray com cada produto instanciado e vai adicionando no formato
    //que o firestore recebe
    const produtosProntosProBanco = produtos.map((prod) => {
      
      const instanciaReal = new ProdutoCompra(
        prod.id, 
        prod.nome, 
        Number(prod.quantidade) || 0, 
        Number(prod.valor) || 0, 
        prod.comprado
      );
      
      //agora que todos são uma classe usa o método para transformar no formtato
      //desejado pelo firebase
      return instanciaReal.toFirestore();
    });

    // 3. Enviamos o pacote perfeito pro Service
    const resposta = await toBuyListService.atualizarLista(
      userId, 
      idLista, 
      dadosBasicos, 
      produtosProntosProBanco
    );

    return resposta;

  } catch (error) {
    console.error("Erro no Controller:", error);
    return {
      sucesso: false,
      mensagem: "Erro inesperado ao processar os dados da lista."
    };
  }
}

export interface RespostaControllerExclusao {
  sucesso: boolean;
  mensagem: string | unknown;
}

export async function ControllerExcluirLista(
  userId: string | undefined | null,
  idLista: string | undefined | null
): Promise<RespostaControllerExclusao> {
  
  //validação de usuário
  if (!userId || userId.trim() === '') {
    return {
      sucesso: false,
      mensagem: "Usuário não autenticado. Faça login novamente."
    };
  }

  //validação de lista
  if (!idLista || idLista.trim() === '') {
    return {
      sucesso: false,
      mensagem: "O identificador da lista não foi fornecido."
    };
  }

  try {
    
    const resposta = await toBuyListService.excluirLista(userId, idLista);

    
    return resposta;

  } catch (error) {
    
    return {
      sucesso: false,
      mensagem: "Erro inesperado ao tentar excluir a lista. Verifique sua conexão e tente novamente."
    };
  }

}


export async function ControllerCriarLista(
  userId: string | undefined | null,
  dadosBasicos: { titulo: string; categoria: string; descricao?: string; localCompra: string },
  produtos: ProdutoCompra[] 
): Promise<RespostaControllerListas> { 
  
  if (!userId || userId.trim() === '') {
    return { sucesso: false, mensagem: "Usuário não autenticado. Faça login novamente." };
  }

  try {
    // 1. Transformando o JSON da tela em instâncias reais de ProdutoCompra
    const produtosInstanciados = produtos.map((prod) => {
      return new ProdutoCompra(
        prod.id, 
        prod.nome, 
        Number(prod.quantidade) || 0, 
        Number(prod.valor) || 0, 
        prod.comprado
      );
    });

    // 2. Instanciando a classe seguindo rigorosamente a ordem posicional do construtor
    const novaLista = new ListaCompra(
      dadosBasicos.titulo,              //titulo (string)
      dadosBasicos.categoria,           //categoria 
      0,                                //totalCompra 
      false,                            //listaFinalizada 
      produtosInstanciados,             //produtos 
      dadosBasicos.localCompra || "",   //localCompra 
      undefined,                        //id (opcional - passamos undefined para poder acessar os próximos parâmetros)
      dadosBasicos.descricao,           //descricao 
      undefined,                        //dataPrazo 
      undefined                         //criadoEm 
    );

    
    const pacotePerfeitoProFirebase = novaLista.toFirestore();

    // 4. Enviando o pacote unificado para o Service
    const resposta = await toBuyListService.criarLista(userId, pacotePerfeitoProFirebase);
    
    return resposta;

  } catch (error) {
    console.error("Erro no Controller ao criar lista:", error);
    return {
      sucesso: false,
      mensagem: "Erro inesperado ao salvar sua nova lista. Tente novamente."
    };
  }
}