# Technical Roadmap

> Projeto: Service API

Este documento descreve todo o plano de desenvolvimento da aplicação.

Cada fase deverá ser concluída completamente antes do início da próxima.

Nenhuma etapa deverá ser ignorada.

---

# Objetivos do Roadmap

O roadmap possui quatro objetivos principais.

- orientar o desenvolvimento;
- organizar o aprendizado;
- evitar retrabalho;
- manter a evolução do projeto previsível.

Ao final de cada fase, a aplicação deverá permanecer funcional.

---

# Fluxo Geral

```text
Planejamento

↓

Bootstrap

↓

Infraestrutura

↓

Arquitetura

↓

Autenticação

↓

Usuários

↓

Serviços

↓

Tasks

↓

Notes

↓

Dashboard

↓

Redis

↓

Testes

↓

Refatoração

↓

Deploy

↓

Versão 1.0
```

---

# BLOCO 1

## Fundação

Objetivo:

Construir toda infraestrutura necessária antes da implementação da primeira regra de negócio.

---

# FASE 0 [x]

Planejamento

## Objetivo

Definir toda arquitetura.

## Entregáveis

- README
- Overview
- Engineering Handbook
- Technical Roadmap
- Development Log
- Arquitetura
- Banco

## Checklist

- [x] Escopo definido
- [x] Stack definida
- [x] Arquitetura definida
- [x] Documentação criada

## Critério de conclusão

Toda decisão arquitetural documentada.

---

# FASE 1 [x]

Bootstrap

## Objetivo

Criar a estrutura inicial do projeto.

## Tecnologias

Node

NPM

Git

TypeScript

## Entregáveis

- package.json
- tsconfig
- eslint
- prettier
- editorconfig
- gitignore

## Conceitos

Package Manager

Scripts

Aliases

Strict Mode

ESM

CJS

## Checklist

- [x] Projeto criado
- [x] TypeScript funcionando
- [x] Scripts configurados
- [x] Lint funcionando
- [x] Formatação funcionando

---

# FASE 2 [...]

Docker

## Objetivo

Containerizar toda aplicação.

## Tecnologias

Docker

Docker Compose

PostgreSQL

Redis

## Entregáveis

Dockerfile

docker-compose.yml

Volumes

Network

Environment

## Conceitos

Container

Imagem

Build

Compose

Volumes

Networks

Bind Mount

Health Check

## Checklist

- [ ] API sobe via Docker
- [ ] PostgreSQL conectado
- [ ] Redis conectado
- [ ] Hot Reload funcionando
- [ ] Persistência validada

---

# FASE 3

Arquitetura

Objetivo

Criar estrutura definitiva da aplicação.

## Entregáveis

Controllers

Services

Repositories

Middlewares

Config

Shared

Modules

DTOs

Schemas

## Checklist

- [ ] Estrutura criada
- [ ] Alias configurados
- [ ] Padrão de módulos definido

---

# BLOCO 2

Core

Objetivo

Implementar todas regras de negócio.

---

FASE 4

Autenticação

↓

FASE 5

Users

↓

FASE 6

Services

↓

FASE 7

Tasks

↓

FASE 8

Notes

Cada uma dessas fases possuirá o mesmo formato:

Objetivo

Conceitos

Tecnologias

Endpoints

Regras

Checklist

Review

O que aprendi

---

# BLOCO 3

Infraestrutura

FASE 9

Dashboard

↓

FASE 10

Redis

↓

FASE 11

Performance

---

# BLOCO 4

Qualidade

FASE 12

Jest

↓

FASE 13

Integração

↓

FASE 14

Cobertura

↓

FASE 15

Refatoração

---

# BLOCO 5

Produção

FASE 16

Deploy

↓

Render

↓

Neon

↓

Upstash

↓

Versão 1.0
