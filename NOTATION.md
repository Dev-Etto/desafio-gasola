# ANOTACÕES E REGRAS DO DESAFIO

Criar um jogo de forca, usando front react e backend node + adonis
•⁠ ⁠⁠usar as libs auxiliaries do adonis quando necessário( japa, auth, vine,…)
•⁠ ⁠⁠o front nao deve saber a resposta correta
•⁠ ⁠⁠implementação: poder adivinhar uma palavra; implementar testes no backend
•⁠ ⁠⁠o layout acima é um design sugerido.
•⁠ ⁠⁠Extras: contagem de pontos, poder solicitar dicas, ranking de usuários , seleção de tema de palavras

## Planejamento de Implementação

### Fase 1: Configuração Inicial e Infraestrutura

- [x] Inicializar repositório Git.
- [x] Configurar `.gitignore` raiz.
- [x] Inicializar projeto Backend (AdonisJS).
- [x] Inicializar projeto Frontend (React + Vite + Styled Components).
- [x] Configurar linting e formatação.
- [x] Configurar `concurrently` para rodar o backend e frontend juntos.
- [x] Adicionar `.nvmrc` para especificar versão do Node.js.

## Fase 2: Backend - Core (AdonisJS)

- [x] Configurar Banco de Dados (SQLite para dev).
- [x] Criar Migrations e Models:
  - `User`: Simples, apenas `username` (para Ranking).
  - `Game`: Estado do jogo (palavra, letras descobertas, **vidas restantes/erros**). Importante persistir a vida do jogador.
  - `Word`: Palavras e Dicas.
  - `Category`: Temas de palavras.
- [x] Implementar Seeders para popular palavras e categorias.
- [x] **Infraestrutura Real-time (Socket.io)**: Configurar serviço de WebSocket para comunicação em tempo real.
- [x] **Rota de Autenticação** (Simples para Ranking). // Decidido: Criação de usuário "on-the-fly" ao iniciar o jogo.
- [x] **Lógica do Jogo (Híbrido)**:
  - `POST /games`: Iniciar novo jogo (Setup via HTTP).
  - `Event: join_game`: Conectar na sala do jogo via Socket.
  - `Event: guess`: Chutar letras e receber estado atualizado via Socket (Gameplay).
- [x] **Testes (Japa)** (Requisito obrigatório):
  - Testar criação de jogo.
  - Testar lógica de chute e vitória/derrota (Adaptar para testar lógica, independente do transporte).
  - Testar validações.

## Fase 3: Frontend - Interface (React)

- [ ] Configurar **Styled Components** e Estilos Globais.
- [ ] Criar Componentes Visuais:
  - `LetterSlot`, `Keyboard`, `HangmanFigure`.
  - `HealthBar` (Barra de vida).
- [ ] Implementar Tela de Jogo:
  - Setup via API (`POST /games`).
  - Gameplay via WebSocket (`emit guess`, `on game_update`).

## Fase 4: Funcionalidades Extras

- [ ] Implementar Dicas.
- [ ] Implementar Ranking.
