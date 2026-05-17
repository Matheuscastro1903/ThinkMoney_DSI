

import { GoogleGenerativeAI } from '@google/generative-ai';
import { THINK_MONEY_SYSTEM_PROMPT } from '../constants/prompt';

// ! força a não ser undifined
export const API_KEY: string = process.env.EXPO_PUBLIC_API_KEY!;

const iaInstancia = new GoogleGenerativeAI(API_KEY);

export const modeloIA = iaInstancia.getGenerativeModel(
  { 
    
    model: "gemini-2.5-flash", 
    systemInstruction: THINK_MONEY_SYSTEM_PROMPT 
  }, 
  { apiVersion: "v1beta" } 
);