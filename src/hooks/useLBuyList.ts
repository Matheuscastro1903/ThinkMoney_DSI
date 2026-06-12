import { toBuyListService, ResumoListaCompra } from "@/src/services/buyList";


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