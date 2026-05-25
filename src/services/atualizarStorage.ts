import { supabase } from './supabase';

const BUCKET_NAME = 'metas_fotos'; 


export async function atualizarImagemSupabase(
  idImagem: string, 
  arquivoConvertido: ArrayBuffer, 
  mimeType: string = 'image/jpeg'//indica qual tipo deve ser explicitamente 
) {

  const nomeArquivoComExtensao = `${idImagem}.jpg`;
  try {
    // Envia o arquivo para o bucket
    const { error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(nomeArquivoComExtensao, arquivoConvertido, {
        contentType: mimeType,
        upsert: true
      });

    if (error) throw error;

    //resgata a URL pública para atualizar o visual do app instantaneamente
    const { data: urlData } = supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(idImagem);

    return {
      idImagem,
      publicUrl: urlData.publicUrl,
      sucesso: true
    };
  } catch (error) {
    console.error("Erro ao fazer upload no Supabase:", error);
    return {
      idImagem: null,
      sucesso: false,
      publicUrl: null
    };
  }
}