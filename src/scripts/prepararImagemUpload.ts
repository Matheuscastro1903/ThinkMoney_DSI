import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';



export interface ResultadoConversao {
  sucesso: boolean;
  uriOriginal: string;
  arquivoConvertido: ArrayBuffer | null;
  erro?: string;
}

export async function prepararImagemParaUpload(uriLocal: string): Promise<ResultadoConversao> {
  try {
    //fetch serve para entender como está organizado o file]
    //essa string de file está vindo do próprio urilocal que vem da imagem
    //vai até o endereço local e entrega o que tem lá
    const resposta = await fetch(uriLocal);

    //arrayBuffer() pega a resposta e transforma os pixels da foto em um pacote de dados crus (uma sequência de bytes). É esse formato binário universal que o 
    // servidor do Supabase exige para conseguir salvar o arquivo lá no banco de dados.
    const arrayBuffer = await resposta.arrayBuffer();

    return {
      sucesso: true,
      uriOriginal: uriLocal,
      arquivoConvertido: arrayBuffer
    };

  } catch (error) {
    console.error("Erro ao ler a imagem da memória:", error);
    
    return {
      sucesso: false,
      uriOriginal: uriLocal,
      arquivoConvertido: null,
      erro: "Falha ao processar o arquivo da imagem local."
    };
  }
}