# AgroTracker

Sistema móvel para gestão e rastreabilidade do ciclo de vida animal. O projeto permite gerenciar fazendas, membros da equipe, animais, eventos de manejo e identificação por QR Code ou número identificador.

O sistema é composto por uma aplicação móvel em React Native com Expo e uma API backend em Node.js, Express e TypeScript. No MVP, os dados são persistidos localmente em arquivos JSON no backend.

## Tecnologias

- Frontend: React Native, Expo, Expo Router, TypeScript, Axios, AsyncStorage e Expo Camera.
- Backend: Node.js, Express, TypeScript, bcryptjs e persistência local em JSON.
- Testes: Vitest, Supertest e coverage-v8.

## Estrutura do Projeto

```text
agrotracker 2.0/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   └── modules/
│   │       ├── animal/
│   │       ├── auth/
│   │       ├── event/
│   │       ├── fazenda/
│   │       └── membership/
│   ├── data/
│   ├── package.json
│   └── vitest.config.ts
│
├── frontend/
│   ├── app/
│   ├── src/
│   │   ├── core/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── .env.example
│   ├── package.json
│   └── vitest.config.ts
│
└── docs/
```

## Funcionalidades

- Cadastro e autenticação de usuários.
- Criação e listagem de fazendas.
- Associação automática do criador da fazenda como administrador.
- Gestão de membros, convites e papéis de acesso.
- Cadastro, edição e consulta de animais.
- Identificação de animais por QR Code ou número identificador.
- Registro e consulta de eventos de manejo.
- Controle de Fazenda Ativa na aplicação móvel.

## Requisitos

- Node.js instalado.
- npm instalado.
- Expo Go no dispositivo físico, ou ambiente Android/iOS configurado.
- Dispositivo e computador na mesma rede, caso o app seja executado em um celular físico.

## Configuração

Instale as dependências do backend:

```bash
cd backend
npm install
```

Instale as dependências do frontend:

```bash
cd frontend
npm install
```

Crie o arquivo de ambiente do frontend a partir do exemplo:

```bash
cd frontend
copy .env.example .env.development
```

No arquivo `frontend/.env.development`, configure o endereço da API:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3333
EXPO_PUBLIC_APP_NAME=AgroTracker
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_APP_ENV=development
```

Exemplo em rede local:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.105:3333
```

Use o IP da máquina onde o backend está rodando. Em dispositivo físico, `localhost` não aponta para o computador, e sim para o próprio celular.

## Executando o Backend

```bash
cd backend
npm run dev
```

Por padrão, a API é executada na porta `3333`.

Principais rotas:

```text
POST /auth/register
POST /auth/login
GET  /fazendas
POST /fazendas
GET  /animals
POST /animals
GET  /events
POST /events
```

## Executando o Frontend

Em outro terminal:

```bash
cd frontend
npm start
```

Depois, use o Expo Go no celular ou escolha uma das opções exibidas no terminal para abrir em Android, iOS ou web.

## Testes

Executar testes do frontend:

```bash
cd frontend
npm test
```

Executar testes do backend:

```bash
cd backend
npm test
```

Executar verificação de tipos dos testes do backend:

```bash
cd backend
npm run test:typecheck
```

Executar testes com cobertura:

```bash
cd frontend
npm test -- --coverage
```

```bash
cd backend
npm test -- --coverage
```

Na última execução validada, o projeto apresentou:

- Frontend: 18 suítes e 117 testes aprovados.
- Backend: 12 suítes e 38 testes aprovados.
- Total: 30 suítes e 155 testes aprovados.

## Arquivos que Devem Subir para o GitHub

- Código-fonte do backend em `backend/src/`.
- Código-fonte do frontend em `frontend/src/` e `frontend/app/`.
- Arquivos de configuração do projeto, como `package.json`, `package-lock.json`, `tsconfig.json` e `vitest.config.ts`.
- Documentação em `docs/`, quando fizer parte da entrega.
- `README.md`.
- `.gitignore`.
- `frontend/.env.example`.
- Arquivos JSON vazios em `backend/data/*.json`, mantendo apenas `[]` como conteúdo inicial.

## Arquivos que Não Devem Subir

- `node_modules/`.
- `.expo/`.
- `coverage/`, `backend/coverage/` e `frontend/coverage/`.
- Arquivos temporários, como `tmp_*.txt` e `tmp_*/`.
- Relatórios locais como `depcheck-*.json`.
- Arquivos de ambiente reais, como `.env`, `.env.development` e `.env.production`.
- Dados reais de execução dentro de `backend/data/*.json`, como usuários, e-mails, sessões, tokens e dados de teste.

Os arquivos JSON em `backend/data/` devem permanecer no repositório apenas como estruturas vazias (`[]`). Durante a execução local, o backend pode preencher esses arquivos com dados de uso e teste.

## Observações de Entrega

Antes de publicar o repositório, confira se não existem dados pessoais, tokens, senhas, arquivos de cobertura ou arquivos temporários incluídos no commit. Também é recomendado executar os testes do frontend e do backend para garantir que o sistema esteja em estado válido para entrega.
