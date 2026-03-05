# 🎯 Desafio Gasola — Jogo da Forca Full Stack

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![AdonisJS](https://img.shields.io/badge/AdonisJS-6.x-5A45FF?logo=adonisjs&logoColor=white)](https://adonisjs.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?logo=socket.io&logoColor=white)](https://socket.io)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?logo=sqlite&logoColor=white)](https://sqlite.org)

> Aplicação Full Stack de um **Jogo da Forca** no estilo Arcade, onde o objetivo do jogador é descobrir palavras por tema, acumular pontos e alcançar o ranking global.  
> O front-end **nunca conhece a resposta correta** — toda a lógica de validação vive no back-end, comunicada em tempo real via **WebSocket**.

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Regras do Jogo](#-regras-do-jogo)
- [Pré-requisitos e Instalação](#-pré-requisitos-e-instalação)
- [Configuração de Variáveis de Ambiente](#-configuração-de-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Documentação de API](#-documentação-de-api)
- [Eventos WebSocket](#-eventos-websocket)
- [Testes](#-testes)
- [Padrões de Código](#-padrões-de-código)
- [Como Contribuir](#-como-contribuir)

---

## 🛠 Tecnologias

### Back-end
| Tecnologia | Versão | Função |
|---|---|---|
| **AdonisJS** | 6.x | Framework MVC Node.js para a API REST |
| **Lucid ORM** | 21.x | ORM para modelos e migrations |
| **Socket.io** | 4.x | Comunicação em tempo real (eventos de jogo) |
| **VineJS** | 3.x | Validação de inputs |
| **SQLite** | — | Banco de dados (ambiente de desenvolvimento) |
| **Japa** | 4.x | Framework de testes |
| **TypeScript** | 5.8 | Tipagem estática |

### Front-end
| Tecnologia | Versão | Função |
|---|---|---|
| **React** | 19.x | Biblioteca de UI |
| **Vite** | 7.x | Bundler e servidor de desenvolvimento |
| **Styled Components** | 6.x | CSS-in-JS para estilização |
| **Socket.io Client** | 4.x | Conexão com o servidor de WebSocket |
| **Axios** | 1.x | Cliente HTTP para a API REST |
| **TypeScript** | 5.9 | Tipagem estática |

---

## 🏗 Arquitetura

O projeto é um **monorepo** com dois pacotes independentes orquestrados pela raiz.

```
desafio-gasola/
├── back-end/         # API AdonisJS
│   ├── app/
│   │   ├── constants/    # Constantes globais (mensagens, events do socket)
│   │   ├── controllers/  # Camada magra: delega para Services
│   │   ├── dtos/         # Data Transfer Objects (formatação de resposta)
│   │   ├── enums/        # Enumeradores de domínio
│   │   ├── exceptions/   # Exceções customizadas
│   │   ├── middleware/   # Middlewares globais
│   │   ├── models/       # Lucid Models (User, Game, Word, Category)
│   │   ├── services/     # Regras de negócio (GameService, RankingService, Ws)
│   │   ├── utils/        # Utilitários (ex: safeExec para sockets)
│   │   └── validators/   # Schemas de validação com VineJS
│   ├── database/
│   │   ├── migrations/   # Histórico de schema via migrations
│   │   └── seeders/      # Carga inicial de dados (palavras e categorias)
│   ├── start/
│   │   ├── routes.ts     # Definição das rotas HTTP
│   │   └── socket.ts     # Definição dos eventos WebSocket
│   └── tests/functional/ # Testes funcionais com Japa
│
└── front-end/        # SPA React + Vite
    └── src/
        ├── components/   # Componentes reutilizáveis de UI
        ├── constants/    # Strings e constantes de UI centralizadas
        ├── contexts/     # Contextos React (sessão de jogo)
        ├── hooks/        # Custom Hooks (useGameLogic, useSocket, useRanking…)
        ├── pages/        # Páginas: Home, Game, Ranking
        ├── services/     # Clientes HTTP (Axios) e Socket
        ├── styles/       # Estilos globais com Styled Components
        └── utils/        # Funções utilitárias puras
```

### Decisões Arquiteturais

- **Service Layer (Back-end)**: Controllers são magros — delegam toda regra de negócio ao `GameService` e `RankingService`.
- **Custom Hooks (Front-end)**: Lógicas de estado e efeitos complexos são extraídas para hooks (`useGameLogic`, `useGameControl`, `useSocket`), mantendo os componentes focados em renderização.
- **DTO Pattern**: As respostas da API e dos eventos de socket são sempre formatadas pelo `GameResponseDto`, garantindo contrato estável entre as camadas.
- **Real-time First**: A lógica de jogo (chutes e dicas) é processada via **WebSocket**. A API REST é utilizada para operações de criação (`POST /games`) e consulta (`GET /ranking`).

---

## 🎮 Regras do Jogo

1. O jogador informa um **nickname** para iniciar ou recuperar seu perfil.
2. Uma nova partida é criada e uma palavra aleatória (com categoria) é sorteada pelo servidor.
3. O frontend exibe apenas o **comprimento da palavra** e a **categoria** — nunca as letras.
4. O jogador chuta letras via **WebSocket**. O servidor valida e retorna o estado atualizado.
5. **Vitória**: Todas as letras reveladas → pontos calculados → botão "Próxima Palavra".
6. **Derrota (Game Over)**: Vidas chegam a 0 → sessão encerrada → ranking exibido.
7. **Pontuação**: `(letras_únicas × 10) + (vidas_restantes × 5)`.
8. O `high_score` pessoal é atualizado se a pontuação da sessão superar o recorde.

---

## ⚙️ Pré-requisitos e Instalação

### Pré-requisitos

- **Node.js** `>= 22.x` (veja `.nvmrc`)
- **npm** `>= 10.x`

> Recomendamos o uso do [nvm](https://github.com/nvm-sh/nvm) para gerenciar a versão do Node.

```bash
nvm use
```

### Instalação

**1. Clone o repositório:**

```bash
git clone <url-do-repositorio>
cd desafio-gasola
```

**2. Instale todas as dependências (raiz + back-end + front-end):**

```bash
npm run install:all
```

**3. Configure as variáveis de ambiente:**

```bash
# Back-end
cp back-end/.env.example back-end/.env

# Front-end
cp front-end/.env.example front-end/.env
```

Edite os arquivos `.env` conforme necessário (veja a seção abaixo).

**4. Gere a APP_KEY do AdonisJS:**

```bash
cd back-end
node ace generate:key
```

Cole o valor gerado em `back-end/.env` na variável `APP_KEY`.

**5. Execute as migrations e popule o banco:**

```bash
# A partir da raiz do projeto
npm run db:migrate
npm run db:seed
```

**6. Inicie o projeto:**

```bash
npm run dev
```

O back-end estará disponível em `http://localhost:3001` e o front-end em `http://localhost:3000`.

---

## 🔑 Configuração de Variáveis de Ambiente

### `back-end/.env`

| Variável | Padrão | Descrição |
|---|---|---|
| `TZ` | `UTC` | Timezone da aplicação |
| `PORT` | `3001` | Porta do servidor HTTP |
| `HOST` | `localhost` | Host do servidor |
| `LOG_LEVEL` | `info` | Nível de log (debug, info, warn, error) |
| `APP_KEY` | — | **Obrigatório.** Chave de criptografia do AdonisJS |
| `NODE_ENV` | `development` | Ambiente de execução |
| `DB_CONNECTION` | `sqlite` | Driver do banco de dados |
| `CORS_ORIGIN` | `*` | Origens permitidas pelo CORS |

### `front-end/.env`

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_PORT` | `3000` | Porta do servidor de desenvolvimento |
| `VITE_API_URL` | `http://localhost:3001` | URL base da API back-end |

---

## 📜 Scripts Disponíveis

### Raiz do Projeto

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia back-end e front-end simultaneamente |
| `npm run build` | Gera o build de produção de ambos |
| `npm run test` | Executa os testes funcionais do back-end |
| `npm run lint` | Verifica lint em ambos os pacotes |
| `npm run lint:fix` | Corrige erros de lint automaticamente |
| `npm run install:all` | Instala dependências de todos os pacotes |
| `npm run db:migrate` | Executa as migrations pendentes |
| `npm run db:seed` | Popula o banco com dados iniciais |

### Back-end (`/back-end`)

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor com HMR via `node ace serve --hmr` |
| `npm run build` | Compila TypeScript para `/build` |
| `npm run start` | Inicia o build de produção |
| `npm run test` | Executa testes com Japa |
| `npm run typecheck` | Verifica tipos sem emitir arquivos |
| `npm run migration:run` | Aplica migrations pendentes |
| `npm run migration:rollback` | Reverte a última migration |
| `npm run migration:refresh` | Reverte e reaplicar todas migrations |
| `npm run db:seed` | Executa os seeders |
| `npm run format` | Formata código com Prettier |

### Front-end (`/front-end`)

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor Vite |
| `npm run build` | Gera build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Verifica lint com ESLint |
| `npm run lint:fix` | Corrige erros de lint automaticamente |

---

## 📡 Documentação de API

> **Base URL:** `http://localhost:3001`

### `POST /games` — Criar nova partida

Cria uma nova partida para o jogador e retorna as informações iniciais.

**Request Body:**
```json
{
  "username": "string",
  "sessionId": "string (UUID)"
}
```

**Response `201 Created`:**
```json
{
  "gameId": 42,
  "username": "jogador123",
  "wordLength": 7,
  "category": "Animais",
  "remainingLives": 6,
  "lettersGuessed": [],
  "status": "in_progress"
}
```

---

### `GET /ranking` — Ranking global

Retorna o Top 10 de jogadores com maiores pontuações (`high_score`).

**Response `200 OK`:**
```json
[
  { "username": "campeao", "highScore": 480 },
  { "username": "jogador2", "highScore": 350 }
]
```

---

> **Nota:** O endpoint `POST /games/:id/guess` existe na rota HTTP, mas a lógica principal de chutes foi migrada para WebSocket (`GUESS` event). ⚠️ [TODO: remover endpoint HTTP de guess em uma refatoração futura]

---

## 🔌 Eventos WebSocket

A conexão Socket.io é estabelecida com o mesmo servidor do back-end (`http://localhost:3001`).

### Eventos emitidos pelo **Client → Server**

| Evento | Payload | Descrição |
|---|---|---|
| `join_game` | `{ gameId: number }` | Entra na sala da partida e recebe o estado atual |
| `guess` | `{ gameId: number, letter: string }` | Envia uma letra para ser validada |
| `request_hint` | `{ gameId: number }` | Solicita uma dica para a palavra atual |

### Eventos emitidos pelo **Server → Client**

| Evento | Payload | Descrição |
|---|---|---|
| `game_update` | `GameResponseDto` | Atualização completa do estado do jogo |
| `error` | `{ message: string }` | Mensagem de erro de validação ou de servidor |

### Estrutura do `GameResponseDto`

```typescript
{
  gameId: number
  wordMask: string        // ex: "_ _ _ _ _" ou "C _ S _"
  remainingLives: number
  lettersGuessed: string[]
  status: 'in_progress' | 'won' | 'lost'
  sessionScore: number
  isWin?: boolean
  isLoss?: boolean
  targetWord?: string     // Revelada apenas ao perder
  hint?: string           // Preenchida se dica foi solicitada
  message?: string
  guessed?: boolean
}
```

---

## 🧪 Testes

Os testes são funcionais (end-to-end da API) e escritos com o framework **Japa**.

```bash
# A partir da raiz
npm run test

# A partir do /back-end
npm run test
```

**Suítes de teste disponíveis:**

| Arquivo | Cobertura |
|---|---|
| `games.spec.ts` | Criação de partida, fluxo de chutes, vitória e derrota |
| `game_score.spec.ts` | Cálculo e persistência de pontuação |
| `arcade_mode.spec.ts` | Fluxo completo do Modo Arcade (múltiplas rodadas) |
| `socket.spec.ts` | Eventos WebSocket (join, guess, hint) |

> ⚠️ **TODO**: Configurar instância de banco de dados dedicada para testes (isolamento de `development` e `test`).

---

## 📐 Padrões de Código

Este projeto adota um conjunto rigoroso de padrões de qualidade:

- **TypeScript Estrito**: Uso obrigatório de tipagem explícita. O uso de `any` é proibido.
- **SOLID & Clean Code**: Controllers magros, Service Layer para regras de negócio, DRY via abstrações.
- **DTO Pattern**: Respostas de API sempre formatadas por classes DTO dedicadas.
- **Nomenclatura**: Booleanos com prefixo de verbo (`isWin`, `isLoss`, `hintUsed`), nomes descritivos.
- **Imutabilidade**: Preferência por `map`, `filter`, `reduce` no front-end.
- **Early Return**: Padrão adotado no front-end para evitar aninhamento de condicionais.
- **Linting**: ESLint configurado nos dois pacotes com plugins específicos (`@adonisjs/eslint-config` no back-end, `react-hooks` no front-end).

---

## 🤝 Como Contribuir

1. **Faça um fork** do repositório e crie seu branch a partir de `main`:

   ```bash
   git checkout -b feat/minha-funcionalidade
   ```

2. **Padrão de nomenclatura de branches:**
   - `feat/` — Nova funcionalidade
   - `fix/` — Correção de bug
   - `refactor/` — Refatoração sem mudança de comportamento
   - `test/` — Adição ou modificação de testes
   - `docs/` — Atualização de documentação

3. **Commit**: Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

   ```bash
   git commit -m "feat: adiciona seleção de tema no início da partida"
   ```

4. **Antes de abrir um PR**:
   - Execute `npm run lint` e corrija qualquer erro.
   - Execute `npm run test` e garanta que todos os testes passem.
   - Execute `npm run typecheck` (no back-end) para validar os tipos.

5. **Abra um Pull Request** para a branch `main` com uma descrição clara das mudanças.

---

## 🗺 Roadmap

- [ ] Dockerizar a aplicação (back-end + front-end + banco).
- [ ] Criar instância de banco de dados isolada para testes.
- [ ] Travar versões de dependências (`package-lock.json` auditado).
- [ ] Remover endpoint HTTP `POST /games/:id/guess` (redundante com Socket).
- [ ] Remover repetição de código identificada na aplicação.
