# Service API

## Overview

Service API é uma API REST desenvolvida com foco em aprendizado de tecnologias modernas do ecossistema Node.js.

O projeto simula o funcionamento interno de uma empresa onde administradores gerenciam serviços, tarefas e colaboradores de diferentes departamentos.

Embora tenha como objetivo principal o aprendizado, a arquitetura será construída seguindo boas práticas utilizadas em aplicações reais, incluindo separação por camadas, autenticação, autorização, testes automatizados, cache e conteinerização.

---

# Objetivos

O projeto tem como principais objetivos:

- Aprender TypeScript em um projeto real
- Aprender Docker e Docker Compose
- Aprender Redis na prática
- Construir uma API organizada e escalável
- Aplicar princípios de Clean Architecture
- Implementar autenticação e autorização
- Escrever testes automatizados com Jest
- Simular regras de negócio de uma empresa
- Criar uma base sólida para futuras aplicações maiores

---

# Contexto

A aplicação representa uma empresa fictícia.

Existem usuários com diferentes funções dentro da organização.

Os administradores podem criar serviços e delegar tarefas aos colaboradores.

Cada colaborador pode acompanhar suas tarefas e atualizar o progresso conforme trabalha.

Também será possível criar notas relacionadas a:

- Usuários
- Serviços
- Tarefas

Esse comportamento permite reutilizar uma única entidade de notas através de um relacionamento polimórfico.

---

# Principais funcionalidades

## Usuários

- Cadastro
- Login
- Atualização
- Exclusão
- Controle de permissões
- Perfil do usuário

---

## Serviços

Representam projetos ou demandas da empresa.

Exemplos:

- Desenvolvimento de Website
- Landing Page
- Sistema ERP
- API Financeira

Cada serviço possui:

- título
- descrição
- prioridade
- status
- prazo
- responsável pela criação

---

## Tarefas

Cada serviço possui diversas tarefas.

As tarefas podem ser atribuídas a um usuário específico.

Cada usuário poderá visualizar apenas as tarefas que possui acesso.

O responsável pela tarefa poderá alterar seu status durante o desenvolvimento.

---

## Notas

Sistema único de observações.

Uma nota poderá estar relacionada a:

- uma tarefa
- um serviço
- um usuário

Utilizando:

entity_type

entity_id

Exemplo:

TASK → 15

SERVICE → 8

USER → 4

---

## Dashboard

A API disponibilizará informações resumidas para dashboards.

Exemplos:

- quantidade de usuários
- serviços ativos
- tarefas concluídas
- tarefas pendentes
- quantidade de notas

Essas informações serão cacheadas utilizando Redis.

---

# Papéis (Roles)

Inicialmente existirão os seguintes papéis:

- ADMIN
- DEVELOPER
- DESIGNER
- MARKETING
- QA
- FINANCE

Novos papéis poderão ser adicionados futuramente.

---

# Stack

## Backend

- Node.js
- Express.js
- TypeScript

---

## Banco de Dados

- PostgreSQL
- Prisma ORM

---

## Cache

Redis

Será utilizado para:

- cache de consultas
- cache do dashboard
- armazenamento de Refresh Tokens
- Rate Limiting

---

## Autenticação

- JWT Access Token
- Refresh Token
- Bcrypt

---

## Validação

- Zod

---

## Testes

- Jest
- Supertest

---

## Conteinerização

- Docker
- Docker Compose

---

## Ferramentas

- ESLint
- Prettier
- Git
- GitHub

---

# Estrutura da aplicação

A aplicação seguirá arquitetura em camadas.

Exemplo:

Controller

↓

Service

↓

Repository

↓

Database

Toda regra de negócio ficará concentrada na camada de Service.

---

# Objetivos de aprendizado

Durante o desenvolvimento serão praticados:

- TypeScript avançado
- Docker
- Docker Compose
- Redis
- Prisma
- PostgreSQL
- Autenticação JWT
- Refresh Tokens
- Testes automatizados
- Cache
- Arquitetura em camadas
- Organização de projetos Node.js
- Tratamento de erros
- Boas práticas de API REST

---

# Escopo da primeira versão

A primeira versão da API contemplará:

✅ Autenticação

✅ Usuários

✅ Serviços

✅ Tarefas

✅ Notas

✅ Dashboard

✅ Cache com Redis

✅ Testes automatizados

Após a conclusão da versão inicial, novas funcionalidades poderão ser adicionadas sem necessidade de reestruturar a arquitetura.