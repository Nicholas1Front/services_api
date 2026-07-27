# Engineering Handbook

> **Projeto:** Service API
>
> **Versão:** 1.0
>
> **Objetivo:** Definir os padrões de engenharia, arquitetura, organização e desenvolvimento utilizados durante toda a construção da Service API.

---

# 1. Sobre o Projeto

A Service API é uma API REST desenvolvida com fins educacionais e profissionais.

Embora tenha como principal objetivo o aprendizado de tecnologias modernas do ecossistema Node.js, sua arquitetura será construída seguindo padrões utilizados em aplicações corporativas.

Todo o desenvolvimento será guiado por princípios de engenharia de software, priorizando organização, escalabilidade, manutenção e legibilidade.

Este documento define como o projeto deve ser desenvolvido.

Nenhuma funcionalidade deverá ser implementada ignorando os padrões descritos neste guia.

---

# 2. Objetivos

Durante o desenvolvimento deste projeto, os seguintes objetivos deverão ser alcançados:

- Dominar TypeScript
- Aprender Docker e Docker Compose
- Aprender Redis
- Aprender Jest e testes automatizados
- Construir uma API organizada e escalável
- Escrever código limpo e de fácil manutenção
- Aplicar boas práticas utilizadas pelo mercado
- Aprender a tomar decisões de arquitetura
- Entender os motivos por trás de cada tecnologia utilizada

O objetivo não é apenas finalizar uma API funcional, mas compreender profundamente cada decisão tomada durante seu desenvolvimento.

---

# 3. Filosofia do Projeto

Este projeto seguirá alguns princípios fundamentais.

## Aprender antes de implementar

Nenhuma tecnologia será adicionada apenas porque "é comum utilizar".

Antes da implementação será compreendido:

- qual problema ela resolve;
- por que foi escolhida;
- quais alternativas existem;
- quando não utilizá-la.

---

## Simplicidade primeiro

A solução mais simples que resolve corretamente o problema será sempre priorizada.

Complexidade será adicionada apenas quando existir uma necessidade real.

---

## Evolução incremental

O projeto será construído em pequenas etapas.

Cada módulo deverá estar completamente funcional antes do início do próximo.

---

## Código explicável

Todo código escrito deve conseguir ser explicado pelo próprio desenvolvedor.

Copiar código sem entender seu funcionamento não faz parte deste projeto.

---

## Refatoração constante

Sempre que uma melhoria significativa for identificada, ela será discutida antes da implementação.

Refatorar faz parte do desenvolvimento.

---

# 4. Princípios de Engenharia

Toda decisão deverá respeitar os seguintes princípios.

## Legibilidade

Código é escrito para pessoas.

A leitura deve ser simples.

---

## Manutenibilidade

Novas funcionalidades devem ser adicionadas sem necessidade de alterar módulos já estáveis.

---

## Baixo acoplamento

Cada módulo deve conhecer apenas o necessário para executar sua responsabilidade.

---

## Alta coesão

Cada arquivo deve possuir uma responsabilidade bem definida.

---

## Escalabilidade

Mesmo sendo um projeto de estudo, sua arquitetura deverá permitir crescimento futuro.

---

## Testabilidade

Toda regra de negócio deverá ser escrita pensando em testes automatizados.

---

## Reutilização

Duplicação de código deverá ser evitada sempre que possível.

---

# 5. Arquitetura

Inicialmente será utilizada uma arquitetura em camadas.

```text
Controller
        │
        ▼
Service
        │
        ▼
Repository
        │
        ▼
Database
```

Cada camada possui uma responsabilidade específica.

## Controller

Responsável apenas por:

- receber requisições;
- validar entrada;
- chamar Services;
- devolver respostas HTTP.

Não deverá conter regra de negócio.

---

## Service

Local onde toda regra de negócio será implementada.

É a camada mais importante da aplicação.

---

## Repository

Responsável exclusivamente pela comunicação com o banco de dados.

Não deverá conter regras de negócio.

---

## Database

Responsável pelo acesso ao PostgreSQL através do Prisma ORM.

---

# 6. Organização do Projeto

A aplicação será organizada de forma modular.

Cada módulo deverá conter seus próprios componentes.

Exemplo:

```text
modules/

users/
tasks/
services/
notes/
dashboard/
auth/
```

Cada módulo poderá possuir:

```text
controller

service

repository

dto

schemas

routes

types

tests
```

Nenhum módulo deverá depender diretamente da implementação interna de outro módulo.

---

# 7. Stack Tecnológica

## Runtime

- Node.js

## Linguagem

- TypeScript

## Framework

- Express

## Banco de Dados

- PostgreSQL

## ORM

- Prisma

## Cache

- Redis

## Autenticação

- JWT
- Bcrypt

## Validação

- Zod

## Testes

- Jest
- Supertest

## Conteinerização

- Docker
- Docker Compose

## Qualidade

- ESLint
- Prettier

---

# 8. Ambientes

O projeto possuirá três ambientes.

## Development

Ambiente utilizado durante o desenvolvimento.

Executado localmente utilizando Docker Compose.

---

## Test

Ambiente utilizado para execução dos testes automatizados.

Possuirá banco de dados independente.

---

## Production

Ambiente hospedado em serviços gratuitos.

Infraestrutura prevista:

- API → Render
- PostgreSQL → Neon
- Redis → Upstash

---

# 9. Convenções

## Idioma

Código em inglês.

Documentação em português.

Commits em inglês.

---

## Nomeação

Classes:

```text
CreateUserService
```

Controllers:

```text
UserController
```

Repositories:

```text
UserRepository
```

DTOs:

```text
CreateUserDTO
```

Schemas:

```text
create-user.schema.ts
```

Interfaces:

```text
UserRepositoryInterface
```

Enums:

```text
UserRole
```

---

# 10. Fluxo Git

Branches principais.

```text
main

develop
```

Branches de funcionalidades.

```text
feature/auth

feature/users

feature/tasks

feature/docker

feature/cache
```

Correções.

```text
fix/auth

fix/tasks
```

---

# 11. Definition of Done

Uma funcionalidade somente será considerada concluída quando atender todos os critérios abaixo.

- Implementação concluída
- Regras de negócio implementadas
- Tratamento de erros realizado
- Validação implementada
- Testes escritos
- Testes aprovados
- Código revisado
- Documentação atualizada
- Lint sem erros

---

# 12. Pull Request Checklist

Antes de finalizar qualquer módulo.

- [ ] Código compila
- [ ] Lint executado
- [ ] Testes aprovados
- [ ] Tipagem correta
- [ ] Sem código duplicado
- [ ] Documentação atualizada
- [ ] Variáveis de ambiente revisadas
- [ ] Logs revisados
- [ ] Tratamento de erros implementado

---

# 13. Processo de Desenvolvimento

Toda funcionalidade seguirá obrigatoriamente o seguinte fluxo.

```text
Planejamento

        │

        ▼

Modelagem

        │

        ▼

Implementação

        │

        ▼

Testes

        │

        ▼

Refatoração

        │

        ▼

Documentação

        │

        ▼

Revisão

        │

        ▼

Merge
```

Nenhuma etapa deverá ser ignorada.

---

# 14. O Papel do Tech Lead

Durante todo o desenvolvimento deste projeto, cada decisão técnica será analisada antes da implementação.

O objetivo não será apenas fazer a aplicação funcionar, mas compreender:

- por que determinada solução foi escolhida;
- quais alternativas existiam;
- quais vantagens e desvantagens cada abordagem apresenta;
- como aquela decisão impacta a manutenção futura da aplicação.

A evolução do projeto será guiada por aprendizado incremental, revisão constante e melhoria contínua.

---

# 15. Visão de Longo Prazo

Ao final da primeira versão, a Service API deverá representar uma aplicação backend completa, contendo:

- autenticação;
- autorização;
- arquitetura modular;
- PostgreSQL;
- Redis;
- Docker;
- testes automatizados;
- documentação técnica;
- deploy em ambiente de produção.

Mais importante do que a quantidade de funcionalidades implementadas será a qualidade da arquitetura construída durante o processo.