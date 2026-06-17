import {useState} from "react"
import {buscarEnderecoPorCep } from "@/src/services/geocodingService"

export function useEndereco (inicial?: Partial<{ cep: string; logradouro: string; bairro: string; cidade: string; numero: string }>) {
  const [cep, setCepState] = useState(inicial?.cep ?? '')
  const [logradouro, setLogradouro] = useState(inicial?.logradouro ?? '')
  const [bairro, setBairro] = useState(inicial?.bairro ?? '')
  const [cidade, setCidade] = useState(inicial?.cidade ?? '')
  const [numero, setNumero] = useState(inicial?.numero ?? '')
  const [buscando, setBuscando] = useState(false)
  const [erroCep, setErroCep] = useState<string | null>(null)

  async function setCep(valor: string) {
    const limpo = valor.replace(/\D/g, '').slice(0,8)
    setCepState(limpo)
    setErroCep(null)

    if (limpo.length === 8) {
        setBuscando(true)
        const endereco = await buscarEnderecoPorCep(limpo)
        setBuscando(false)
        if (endereco) {
            setLogradouro(endereco.logradouro)
            setBairro(endereco.bairro)
            setCidade(endereco.localidade)


        } else {
            setErroCep("CEP não encontrado")
        }
    }

    

  }
    function inicializar(valores: { cep: string; logradouro: string; bairro: string; cidade: string; numero: string }) {
    setCepState(valores.cep ?? '')
    setLogradouro(valores.logradouro ?? '')
    setBairro(valores.bairro ?? '')
    setCidade(valores.cidade ?? '')
    setNumero(valores.numero ?? '')
    }

  return {
    cep, setCep, logradouro, setLogradouro, bairro, setBairro, cidade, setCidade, numero, setNumero, buscando, erroCep, inicializar 
  } 

}