

import { GoogleGenerativeAI } from '@google/generative-ai';
import { THINK_MONEY_SYSTEM_PROMPT } from '../constants/prompt';

const API_KEY = "SUACHAVE"; 
const iaInstancia = new GoogleGenerativeAI(API_KEY);

export const modeloIA = iaInstancia.getGenerativeModel(
  { 
    
    model: "gemini-2.5-flash", 
    systemInstruction: THINK_MONEY_SYSTEM_PROMPT 
  }, 
  { apiVersion: "v1beta" } 
);