ANOTACÕES E REGRAS DO DESAFIO.

Criar um jogo de forca, usando front react e backend node + adonis 
•⁠ ⁠⁠usar as libs auxiliaries do adonis quando necessário( japa, auth, vine,…) 
•⁠ ⁠⁠o front nao deve saber a resposta correta 
•⁠ ⁠⁠implementação: poder adivinhar uma palavra; implementar testes no backend 
•⁠ ⁠⁠o layout acima é um design sugerido. 
•⁠ ⁠⁠Extras: contagem de pontos, poder solicitar dicas, ranking de usuários , seleção de tema de palavras


# Planejamento de Implementação

## Fase 1: Configuração Inicial e Infraestrutura
- [x] Inicializar repositório Git.
- [x] Configurar `.gitignore` raiz.
- [x] Inicializar projeto Backend (AdonisJS).
- [x] Inicializar projeto Frontend (React + Vite + Styled Components).
- [x] Configurar linting e formatação.

## Fase 2: Backend - Core (AdonisJS)
- [ ] Configurar Banco de Dados (SQLite para dev).
- [ ] Criar Migrations e Models:
    - `User`: Simples, apenas `username` (para Ranking).
    - `Game`: Estado do jogo (palavra, letras descobertas, **vidas restantes/erros**). Importante persistir a vida do jogador.
    - `Word`: Palavras e Dicas.
    - `Category`: Temas de palavras.
- [ ] Implementar Seeders para popular palavras e categorias.
- [ ] **Rota de Autenticação** (Simples para Ranking).
- [ ] **Lógica do Jogo (Service/Controller)**:
    - `POST /games`: Iniciar novo jogo.
    - `POST /games/:id/guess`: Chutar uma letra.
- [ ] **Testes (Japa)** (Requisito obrigatório):
    - Testar criação de jogo.
    - Testar lógica de chute e vitória/derrota.
    - Testar validações.

## Fase 3: Frontend - Interface (React)
- [ ] Configurar **Styled Components** e Estilos Globais.
- [ ] Criar Componentes Visuais:
    - `LetterSlot`, `Keyboard`, `HangmanFigure`.
    - `HealthBar` (Barra de vida).
- [ ] Implementar Tela de Jogo e Integração com API.

## Fase 4: Funcionalidades Extras
- [ ] Implementar Dicas.
- [ ] Implementar Ranking.
