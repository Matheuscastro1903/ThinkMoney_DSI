

import { GoogleGenerativeAI } from '@google/generative-ai';
import { THINK_MONEY_SYSTEM_PROMPT } from '../constants/prompt';

const API_KEY = "AIzaSyDsX_Suampr7Uh_kcbTTi033oO5_KJSZB0"; 
const iaInstancia = new GoogleGenerativeAI(API_KEY);

export const modeloIA = iaInstancia.getGenerativeModel(
  { 
    
    model: "gemini-2.5-flash", 
    systemInstruction: THINK_MONEY_SYSTEM_PROMPT 
  }, 
  { apiVersion: "v1beta" } 
);