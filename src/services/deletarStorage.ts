import { supabase } from "./supabase";


//o objetivo dessa função é fire and forget
//não é essencial pois a outra imagem já vai ter sido adicionaoda,seria apenas
//detalhe de performance
export async function deletarImagemSupabase(idImagem: string): Promise<void> {
  try {
    if (!idImagem) return;

    //remoção no bucket
    await supabase.storage.from('metas_fotos').remove([idImagem]);
    
  } catch (error) {
    
    console.warn(`[Aviso Técnico] Não foi possível deletar a imagem antiga ${idImagem}:`, error);
  }
}