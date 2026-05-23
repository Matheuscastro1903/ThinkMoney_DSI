import { supabase } from "./supabase";



export async function buscarUrlDaImagem(idImagem: string) {
  //pedimos ao Storage para gerar a URL pública baseada no ID da imagem
  const { data } = supabase
    .storage
    .from('metas_fotos') 
    .getPublicUrl(`${idImagem}.jpg`);

  // Isso devolve um link no formato: "https://[projeto].supabase.co/storage/v1/object/public/..."
  return data.publicUrl; 
}