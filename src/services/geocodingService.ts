export interface Coordenadas {
  latitude: number;
  longitude: number;
}

const BASE = "https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=1";
const HEADERS = { "User-Agent": "ThinkMoney-App/1.0", "Accept-Language": "pt-BR" };

async function buscarNominatim(params: string): Promise<Coordenadas | null> {
  try {
    const res = await fetch(`${BASE}&${params}`, { headers: HEADERS });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.length) return null;
    return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export interface EnderecoViaCep {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
  erro?: boolean;

}

export async function buscarEnderecoPorCep(cep: string): Promise<EnderecoViaCep | null> {
  const cepLimpo = cep.replace(/\D/g, '')
  if (cepLimpo.length !== 8) return null 
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    if (!res.ok) return null 
    const data: EnderecoViaCep = await res.json()
    if (data.erro) return null
    return data 
  } catch {
    return null 
  }


}

export async function geocodificarEndereco(
  logradouro: string,
  numero: string,
  bairro: string,
  cidade: string,
  cep: string,
): Promise<Coordenadas | null> {
  const cepLimpo = cep.replace(/\D/g, "");

  // Tentativa 1: endereço completo com número (query livre — mais precisa para BR)
  if (logradouro && numero && cidade) {
    const partes = [logradouro, numero, bairro, cidade, 'Brasil'].filter(Boolean);
    const q = encodeURIComponent(partes.join(', '));
    const r1 = await buscarNominatim(`q=${q}`);
    if (r1) return r1;
  }

  // Tentativa 2: sem número (caso o número não esteja indexado)
  if (logradouro && cidade) {
    const partes = [logradouro, bairro, cidade, 'Brasil'].filter(Boolean);
    const q = encodeURIComponent(partes.join(', '));
    const r2 = await buscarNominatim(`q=${q}`);
    if (r2) return r2;
  }

  // Tentativa 3: só pelo CEP
  if (cepLimpo.length === 8) {
    const r3 = await buscarNominatim(`postalcode=${cepLimpo}&country=br`);
    if (r3) return r3;
  }

  // Fallback: bairro e cidade
  if (bairro && cidade) {
    const q = encodeURIComponent(`${bairro}, ${cidade}, Brasil`);
    return buscarNominatim(`q=${q}`);
  }

  return null;
}
