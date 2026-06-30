<div align="center">
  <img src="./src/assets/images/logothinkmoney.png" alt="ThinkMoney Logo" width="160" />

  # ThinkMoney

  ### Educação financeira e gestão familiar de gastos, em um só app

  ![Expo](https://img.shields.io/badge/Expo-~54.0-000020?logo=expo&logoColor=white)
  ![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)
  ![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?logo=supabase&logoColor=white)
  ![License](https://img.shields.io/badge/license-private-lightgrey)

</div>

---

## 📖 Sobre o projeto

**ThinkMoney** é um aplicativo mobile (Android, iOS e Web) construído com **React Native + Expo Router**, com foco em **educação financeira e organização do orçamento familiar**. A proposta é ajudar usuários a controlar gastos, definir metas, criar lembretes de pagamentos e tomar decisões financeiras mais conscientes, com o apoio de um **chatbot com Inteligência Artificial**.

O app também conta com um módulo de **mapa de risco financeiro**, alertando o usuário sobre zonas relevantes próximas à sua localização, além de uma área **família**, em que múltiplos integrantes podem compartilhar e acompanhar o orçamento em conjunto.

---

## ✨ Funcionalidades principais

- 🔐 **Autenticação** completa (cadastro, login, recuperação de senha, exclusão de conta)
- 🏠 **Home** com visão geral financeira do usuário
- 👨‍👩‍👧‍👦 **Módulo Família** — gestão compartilhada de orçamento entre membros da família
- 💸 **Gastos** — lançamento e acompanhamento de despesas
- 🎯 **Metas** — definição e acompanhamento de metas financeiras
- ⏰ **Lembretes** — sistema de controle de contas com filtros de status (Todos, Pendentes, Pagos)
- 🤖 **Chatbot com IA** (Google Generative AI) para tirar dúvidas e dar orientações financeiras
- 🗺️ **Mapa** — geolocalização e alertas de zonas de risco financeiro
- 📰 **Notícias** — conteúdo informativo sobre finanças
- ❓ **FAQ** — perguntas frequentes
- ⚙️ **Configurações de conta** — edição de perfil e exclusão de conta

> **Status:** o projeto encontra-se em desenvolvimento ativo. Novas funcionalidades e otimizações são integradas recorrentemente.

---

## 🛠️ Tecnologias utilizadas

| Categoria | Tecnologias |
|---|---|
| **Framework** | [React Native](https://reactnative.dev/) `0.81` + [Expo](https://expo.dev/) `~54` |
| **Roteamento** | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing) + React Navigation |
| **Linguagem** | TypeScript |
| **Backend / Dados** | [Firebase](https://firebase.google.com/) e [Supabase](https://supabase.com/) |
| **Inteligência Artificial** | [Google Generative AI](https://ai.google.dev/) (chatbot) |
| **Mapas e Localização** | `react-native-maps`, `expo-location` |
| **UI / UX** | `expo-linear-gradient`, `expo-image`, `react-native-reanimated`, `react-native-svg`, `react-native-circular-progress-indicator` |
| **Outros** | `expo-notifications`, `expo-image-picker`, `axios`, `react-native-mask-input` |

---

## 📁 Estrutura do projeto

```
ThinkMoney_DSI/
├── src/
│   ├── app/                     # Rotas (Expo Router)
│   │   ├── (auth)/              # Login, cadastro, recuperação de senha
│   │   ├── (tabs)/              # Navegação principal (Home, Família, Mapa, FAQ, Notícias)
│   │   ├── (details)/           # Telas de detalhe (Home, FAQ, Mapa)
│   │   └── config/               # Configurações de conta
│   ├── components/              # Componentes reutilizáveis (auth, tabs, details)
│   ├── services/                 # Integrações (Firebase, Supabase, IA, regras de negócio)
│   ├── hooks/                     # Hooks customizados
│   ├── models/                    # Tipagens/modelos de domínio
│   ├── constants/                 # Tema, prompts e constantes globais
│   ├── types/                      # Tipos TypeScript globais
│   ├── scripts/                    # Scripts utilitários
│   └── assets/                     # Imagens, ícones e sons
├── app.json                       # Configuração do Expo
├── package.json
└── tsconfig.json
```

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) `>= 18`
- [npm](https://www.npmjs.com/) (ou yarn/pnpm)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (opcional, pode ser usado via `npx`)
- App **Expo Go** no celular (para testes rápidos) ou um emulador Android/iOS configurado

---

## 🚀 Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/<seu-usuario>/ThinkMoney_DSI.git
cd ThinkMoney_DSI
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as credenciais necessárias para Firebase, Supabase e Google Generative AI:

```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

SUPABASE_URL=
SUPABASE_ANON_KEY=

GOOGLE_GENERATIVE_AI_API_KEY=
```

> ⚠️ Nunca versione o arquivo `.env`. Mantenha-o listado no `.gitignore`.

### 4. Inicie o projeto

```bash
npm start
```

Isso abrirá o **Metro Bundler** do Expo. No terminal (output) você encontrará as opções para abrir o aplicativo em:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Emulador Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Simulador iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) (aplicativo para testes em dispositivos físicos)

Ou rode diretamente em uma plataforma específica:

```bash
npm run android   # Executa no Android (emulador ou dispositivo)
npm run ios       # Executa no iOS (simulador ou dispositivo)
npm run web       # Executa no navegador
```

---

## 📜 Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento Expo |
| `npm run android` | Roda o app em um dispositivo/emulador Android |
| `npm run ios` | Roda o app em um dispositivo/simulador iOS |
| `npm run web` | Roda o app no navegador |
| `npm run lint` | Executa o linter (ESLint) no projeto |
| `npm run reset-project` | Reseta o projeto para o estado inicial (script utilitário) |

---

## 🧭 Padrão de rotas

O projeto utiliza o **Expo Router** com roteamento baseado em arquivos, organizado em grupos de rotas:

- `(auth)` — fluxo de autenticação (login, cadastro, recuperação de senha)
- `(tabs)` — navegação principal por abas (Home, Família, Mapa, FAQ, Notícias)
- `(details)` — telas de detalhamento acessadas a partir das abas
- `config` — telas de configuração e gerenciamento de conta

---

## 🤝 Contribuindo

1. Crie uma branch a partir da `main`: `git checkout -b feature/minha-feature`
2. Faça suas alterações e garanta que o lint está passando: `npm run lint`
3. Faça commit das mudanças seguindo um padrão claro de mensagens
4. Abra um Pull Request descrevendo o que foi feito e por quê

---

## 📚 Saiba mais

- [Documentação do Expo](https://docs.expo.dev/)
- [Tutorial de Introdução ao Expo](https://docs.expo.dev/tutorial/introduction/)
- [Documentação do Expo Router](https://docs.expo.dev/router/introduction/)
- [Documentação do Firebase](https://firebase.google.com/docs)
- [Documentação do Supabase](https://supabase.com/docs)

---

## 📄 Licença

Este projeto é de uso privado/acadêmico. Todos os direitos reservados.

---

<div align="center">
  Desenvolvido com 💙 pela equipe <strong>ThinkMoney</strong>
</div>
