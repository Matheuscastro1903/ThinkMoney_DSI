import { supabase } from "./supabase";

interface ResultadoUpload {
  sucesso: boolean;
  erro?: any;
}

export async function StorageService(idImagem: string, arquivoConvertido: ArrayBuffer): Promise<ResultadoUpload> {
  //definindo o nome final do arquivo em relação ao id gerado que estará no firebase
  const caminhoNoBucket = `${idImagem}.jpg`;

  const { error } = await supabase.storage //storage indica que não quer mexer na tabela,mas sim no "drive"
    .from('metas_fotos') //adicionar na parte de metas_fotos
    .upload(caminhoNoBucket, arquivoConvertido, {//upload da foto
      contentType: 'image/jpeg',//tipagem da foto
      upsert: true //caso exista algum com o mesmo nome sobrescrever(serve para quando for att)
    });
  
  //se o erro existir
  if (error) {
    return { sucesso: false, erro: error };
  }
  //se não retorna true
  return { sucesso: true };
}