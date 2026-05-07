# AgroTracker - Resumo Tecnico

## Arquitetura do sistema

O AgroTracker e dividido em duas aplicacoes:

- `frontend/`: aplicativo mobile em React Native com Expo Router
- `backend/`: API REST em Node.js, Express e TypeScript

No frontend, a organizacao segue separacao por camadas:

- `core/`: configuracao, rotas, tema, utilitarios e cliente HTTP
- `data/`: APIs, repositories e mapeamentos
- `domain/`: entidades, contratos e casos de uso
- `presentation/`: telas, componentes e viewmodels

No backend, a estrutura segue modularizacao por contexto:

- `auth`
- `fazenda`
- `animal`
- `membership`
- `event`
- `audit`

## Padroes utilizados

- Clean Architecture simplificada no frontend e no backend
- MVVM no frontend:
  - `Screen -> ViewModel -> UseCase -> Repository -> API`
- Componentizacao reutilizavel em `src/presentation/components`
- Configuracao centralizada em `src/core`
- API client unico com timeout, retry e tratamento padronizado de erro

## Fluxo de autenticacao

1. O usuario realiza login ou cadastro no app.
2. O backend autentica as credenciais.
3. A sessao retorna token e dados do usuario.
4. O token e persistido no mobile com `AsyncStorage`.
5. O `AuthProvider` restaura a sessao ao abrir o app.
6. O `ApiClient` injeta automaticamente o token nas requisicoes autenticadas.

## Fluxo de autorizacao multi-tenant

O sistema e multi-tenant por fazenda.

- Cada usuario pertence a uma ou mais fazendas por meio do modulo `membership`
- Cada membership possui papel:
  - `ADMIN`
  - `FUNCIONARIO`
- O backend valida:
  - autenticacao
  - pertencimento a fazenda
  - se o membro esta ativo
  - permissoes por papel

Regras principais:

- `ADMIN`: gerencia fazenda, membros e convites
- `FUNCIONARIO`: pode operar animais e eventos, mas nao gerencia membros

## Modulos principais

- `Auth`: login, registro, sessao e usuario atual
- `Fazenda`: cadastro e listagem de propriedades
- `Animal`: cadastro, listagem, detalhe e exclusao
- `Event`: registro e consulta de manejos
- `Membership`: equipe, papeis, convites e ativacao
- `Audit`: historico, timeline e rastreabilidade de acoes

## Decisoes tecnicas

- Persistencia atual do backend usa arquivos JSON locais
- Essa escolha simplifica a demonstracao e reduz complexidade para o TCC
- A arquitetura ja foi preparada para futura troca por banco relacional ou NoSQL
- O acoplamento com infraestrutura foi mantido baixo por meio de repositories e use cases

## Estado atual para demonstracao

- frontend compilando sem erros
- lint limpo
- backend compilando
- permissoes alinhadas com `members/me`
- sem mocks ativos no painel principal
- UX padronizada com loading, erro, empty state e snackbar

## Evolucao futura recomendada

- substituir JSON por banco de dados
- trocar `MockTokenService` por JWT real
- adicionar testes automatizados
- introduzir observabilidade e logs estruturados
