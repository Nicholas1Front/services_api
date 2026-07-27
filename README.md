# 🚀 Service API

> A modern REST API built to simulate an internal company management system while exploring real-world backend engineering practices.

---

## 📖 About

**Service API** is a backend application designed as a long-term learning project.

Instead of building a simple CRUD application, this project simulates the workflow of a real company where administrators manage services, assign tasks to employees, and organize internal communication through notes.

The project focuses on learning modern backend technologies while following software engineering principles commonly adopted by professional teams.

---

## 🎯 Goals

* Learn **TypeScript** in a real-world project
* Master **Docker** and **Docker Compose**
* Explore **Redis** for caching and session management
* Write automated tests with **Jest**
* Build a scalable and maintainable REST API
* Practice clean architecture and software design principles
* Simulate real business rules and workflows
* Produce production-quality documentation

---

## 🏗 Project Overview

The API simulates a company environment.

### Main Modules

* 🔐 Authentication
* 👥 Users
* 📁 Services
* ✅ Tasks
* 📝 Notes
* 📊 Dashboard

Administrators can create services and assign tasks to employees.

Employees can update the status of their own tasks while administrators maintain full control over the system.

Notes are polymorphic and can be attached to:

* Users
* Services
* Tasks

---

## ⚙️ Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

### Cache

* Redis

### Authentication

* JWT
* Bcrypt

### Validation

* Zod

### Testing

* Jest
* Supertest

### DevOps

* Docker
* Docker Compose

### Code Quality

* ESLint
* Prettier

---

## 📂 Documentation

Project documentation lives inside the **docs/** directory.

Current documentation includes:

* Engineering Handbook
* Project Overview
* Technical Roadmap
* Development Log

Additional technical documents will be added during development.

---

## 🚧 Current Status

Project initialization.

Documentation and architecture planning are currently in progress.

---

## 📌 Roadmap

* [x] Project planning
* [x] Engineering handbook
* [x] Technical roadmap
* [ ] Bootstrap project
* [ ] Docker environment
* [ ] Authentication
* [ ] Users module
* [ ] Services module
* [ ] Tasks module
* [ ] Notes module
* [ ] Dashboard
* [ ] Redis
* [ ] Automated tests
* [ ] Production deployment

---

## 🎓 Learning Focus

This repository is intentionally built as a learning journey.

Every technology introduced into the project is carefully studied before implementation.

The goal is not only to make the application work, but also to understand the reasoning behind each architectural decision.

---

## 📄 License

This project is available under the MIT License.
