import { modeloIA } from './aiConfig';

export async function ChatBotService(prompt: string): Promise<string> {
  try {
    
    //resultado da chamada da ia
    const result = await modeloIA.generateContent(prompt);
    
    //filtrando só o que é realmente resposta e tirando o protocolo
    const response = await result.response;
    
    //extraindo o texto
    const text = response.text(); 

    //retorna o texto
    return text;

  } catch (error: any) {
    //debugar
    console.error("DETALHES DO ERRO:", error);
    console.error("STATUS DA RESPOSTA:", error?.status);
    console.error("MENSAGEM:", error?.message);
    
    // Fallback amigável para o usuário no app
    return "Ops! Tive um problema de conexão. Podemos tentar de novo?";
  }
}
/*
Estrutura de uma requisição básica dessa api

{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Como economizar 100 reais?"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 1,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 8192,
    "responseMimeType": "text/plain"
  },
  "safetySettings": [
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
  ]
}
  
Estrutura de json de resposta

{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Para economizar 100 reais, tente reduzir gastos fixos como assinaturas que você não usa ou troque marcas famosas por marcas próprias no mercado."
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0,
      "safetyRatings": [
        {
          "category": "HARM_CATEGORY_HARASSMENT",
          "probability": "NEGLIGIBLE"
        },
        {
          "category": "HARM_CATEGORY_HATE_SPEECH",
          "probability": "NEGLIGIBLE"
        }
      ]
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 12,
    "candidatesTokenCount": 35,
    "totalTokenCount": 47
  }
}


*/