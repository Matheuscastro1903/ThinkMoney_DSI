import { toBuyListService, ResumoListaCompra } from "@/src/services/buyList";


export interface RespostaControllerListas {
  sucesso: boolean;
  mensagem: string | unknown
  dados?: ResumoListaCompra[];
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