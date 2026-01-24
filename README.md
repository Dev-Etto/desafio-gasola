# Projeto Desafio Gasola

Este projeto é uma aplicação full-stack composta por um backend em **AdonisJS** e um frontend em **React (Vite)**, desenvolvida para o desafio técnico.

## Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) e o npm instalados.

O projeto utiliza a versão do Node definida no arquivo `.nvmrc`. Recomendamos o uso do **nvm** (Node Version Manager) para garantir a compatibilidade.

```bash
# Na raiz do projeto, defina a versão correta do Node
nvm use
```
*Caso não tenha o nvm, verifique o arquivo `.nvmrc` para instalar a versão manual (v20.18.1).*

## Configuração Inicial

### 1. Variáveis de Ambiente

Antes de iniciar, é necessário configurar as variáveis de ambiente.

**Backend:**
Navegue até a pasta `back-end`, copie o arquivo de exemplo e crie o seu arquivo `.env`:

```bash
cd back-end
cp .env.example .env
```
*Certifique-se de que as variáveis no `.env` (como porta e conexão com banco) estejam corretas para o seu ambiente local.*

**Frontend:**
O frontend, por padrão, já possui configurações para rodar localmente, mas verifique se existe algum arquivo `.env.example` ou configurações necessárias na pasta `front-end` caso deseje alterar portas.

### 2. Instalação das Dependências

Na raiz do projeto, execute o comando abaixo para instalar todas as dependências (raiz, backend e frontend):

```bash
npm run install:all
```

### 3. Banco de Dados

O projeto utiliza scripts facilitadores para configurar o banco de dados (rodar migrações e seeds). Execute na raiz:

```bash
# Rodar as migrações (criar tabelas)
npm run db:migrate

# Popular o banco de dados (seeds)
npm run db:seed
```

## Como Rodar

Para iniciar a aplicação (backend e frontend simultaneamente), execute na raiz:

```bash
npm run dev
```

## Acessando o Projeto

Após iniciar, a aplicação estará disponível nos seguintes endereços por padrão:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:3001](http://localhost:3001)

## Estrutura

- `back-end/`: API e lógica do servidor (AdonisJS).
- `front-end/`: Interface do usuário (React + Vite).
