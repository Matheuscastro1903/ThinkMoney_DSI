import { supabase } from "./supabase";


//o objetivo dessa função é fire and forget
//não é essencial pois a outra imagem já vai ter sido adicionaoda,seria apenas
//detalhe de performance
export async function deletarImagemSupabase(idImagem: string): Promise<void> {
  try {
    if (!idImagem) return;

    
    const nomeArquivoComExtensao = `${idImagem}.jpg`;

    
    await supabase.storage
      .from('metas_fotos')
      .remove([nomeArquivoComExtensao]);
      
    console.log(`[Sucesso Técnico] Imagem ${nomeArquivoComExtensao} deletada do Storage.`);
    
  } catch (error) {
    console.warn(`[Aviso Técnico] Não foi possível deletar a imagem antiga ${idImagem}:`, error);
  }
}