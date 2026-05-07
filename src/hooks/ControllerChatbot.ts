//Contoller utilizado para controlar gestão de mensagens e respostas do chabot


import { ChatBotService } from "../services/chatbotService";


export async function ControllerChatBot(text:string){
    
    const  resultadoRequisicao = await ChatBotService(text)

    //RANDOM gera número aletaórido decimal entre 0 e 1
    //tostring irá juntar e mistrura números e letrar
    //slicee pega apeans a partir do 2 a 8 elemento para garantr
    const idResposta=Math.random().toString(36).slice(2,9)

    const apiestrutura={
        "id":idResposta,
        "text":resultadoRequisicao,
        "sender":"chatbot"
    }

    return apiestrutura
    


}