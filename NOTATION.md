# ANOTACÕES E REGRAS DO DESAFIO

Criar um jogo de forca, usando front react e backend node + adonis
•⁠ ⁠⁠usar as libs auxiliaries do adonis quando necessário( japa, auth, vine,…)
•⁠ ⁠⁠o front nao deve saber a resposta correta
•⁠ ⁠⁠implementação: poder adivinhar uma palavra; implementar testes no backend
•⁠ ⁠⁠o layout acima é um design sugerido.
•⁠ ⁠⁠Extras: contagem de pontos, poder solicitar dicas, ranking de usuários , seleção de tema de palavras

## Fluxo de Jogo (Modo Arcade)

### 1. Início e Identificação
- **Tela Inicial**: Campo para inserir `Nickname`.
- **Botões**: [JOGAR] | [RANKING].
- **Lógica**:
  - Ao clicar em Jogar, o sistema busca ou cria o usuário pelo `nickname`.
  - Inicia-se uma **Sessão de Jogo**. Pontuação inicial: 0.

### 2. Loop de Gameplay (Rodadas)
- **Rodada 1**: Sorteia palavra -> Joga.
  - **Vitória**:
    - Pontos da rodada são somados à pontuação da sessão.
    - Exibe modal: "Você venceu! Pontuação: X".
    - Botão: [PRÓXIMA PALAVRA] (Mantém a pontuação e inicia nova rodada com dificuldade/palavra nova).
  - **Derrota (Game Over)**:
    - Vidas chegam a 0.
    - Fim da Sessão.
    - Tela de Game Over é exibida.

### 3. Sistema de Pontuação e Ranking
- **Pontuação**: Baseada em dificuldade da palavra e vidas restantes (ex: `(letras_unicas * 10) + (vidas * 5)`).
- **Ranking (High Score)**:
  - O modelo `User` deve armazenar o `high_score` (recorde pessoal).
  - Ao fim da sessão (Game Over), compara-se `Sessão.pontuação` com `User.high_score`.
  - Se `Sessão > Recorde`: Atualiza o recorde do usuário no banco.

### 4. Tela de Game Over & Ranking
- Exibe:
  - Pontuação Final da Sessão.
  - Mensagem ("Novo Recorde!" se aplicável).
  - **Tabela de Ranking**: Top 10 jogadores (Nick + High Score).
- **Ações**:
  - [JOGAR NOVAMENTE]: Reinicia sessão do zero (Score 0).
  - [MENU INICIAL]: Volta para tela de login.

---

## Planejamento de Implementação

### Fase 1: Configuração Inicial e Infraestrutura
- [x] Inicializar repositório Git.
- [x] Configurar `.gitignore` raiz.
- [x] Inicializar projeto Backend (AdonisJS).
- [x] Inicializar projeto Frontend (React + Vite + Styled Components).
- [x] Configurar linting e formatação.
- [x] Configurar `concurrently` para rodar o backend e frontend juntos.
- [x] Adicionar `.nvmrc` para especificar versão do Node.js.

### Fase 2: Backend - Core (AdonisJS)
- [x] Configurar Banco de Dados (SQLite para dev).
- [x] Criar Migrations e Models:
  - `User`: `username` e `high_score` (Novo campo necessário).
  - `Game`: Estado da partida atual.
  - `Word`: Palavras e Dicas.
  - `Category`: Temas.
- [x] Implementar Seeders.
- [x] **Infraestrutura Real-time (Socket.io)**.
- [x] **Rota de Autenticação/Criação de Usuário**.
- [x] **Lógica de Jogo**: Início, chutes, validação.
- [x] **Adaptação para Modo Arcade**:
  - [x] Atualizar `User` para ter `high_score`.
  - [x] Lógica para calcular pontuação ao vencer.
  - [x] Rota/Lógica para buscar Ranking (`GET /ranking`).

### Fase 3: Frontend - Interface (React)
- [ ] Configurar **Styled Components** e Estilos Globais.
- [ ] **Contexto de Jogo**: Gerenciar estado da sessão (Pontuação acumulada).
- [ ] Telas:
  - **Home**: Input de Nick e Menu.
  - **Game**: Forca, Teclado, HUD de Pontos/Vidas.
  - **Win Modal**: Resumo e botão "Próxima".
  - **Game Over/Ranking**: Lista de recordes e ações de replay.

### Fase 4: Extras
- [ ] Implementar Dicas.
