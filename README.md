# 🦷 OdontoCare

<div align="center">

![Project Status](https://img.shields.io/badge/STATUS-CONCLU%C3%8DDO-success?style=for-the-badge)
![Java](https://img.shields.io/badge/JAVA-25-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/SPRING%20BOOT-3.5.6-6DB33F?style=for-the-badge&logo=springboot)
![Angular](https://img.shields.io/badge/ANGULAR-22-DD0031?style=for-the-badge&logo=angular)
![Ionic](https://img.shields.io/badge/IONIC-9-3880FF?style=for-the-badge&logo=ionic)

![Backend](https://img.shields.io/badge/BACKEND-REST%20API-6DB33F?style=flat-square)
![Frontend](https://img.shields.io/badge/FRONTEND-ANGULAR%20%2B%20IONIC-DD0031?style=flat-square)
![Database](https://img.shields.io/badge/DATABASE-H2%20%7C%20POSTGRESQL-4169E1?style=flat-square)
![Security](https://img.shields.io/badge/SECURITY-JWT-222222?style=flat-square)

# 🦷 OdontoCare

### Tecnologia e cuidado em um só lugar!

Plataforma web desenvolvida para auxiliar na gestão de uma clínica odontológica, oferecendo recursos para consulta de dentistas, gerenciamento de agendamentos e administração de informações dos usuários.

**Projeto acadêmico desenvolvido para a disciplina de Códigos de Alta Performance - Mobile.**

[📂 Repositório](https://github.com/belyisa-bit/OdontoCare) • [📖 Documentação](docs/)

</div>

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Objetivos](#-objetivos)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura-do-projeto)
- [Stack tecnológica](#-stack-tecnológica)
- [Estrutura do repositório](#-estrutura-do-repositório)
- [Autenticação e segurança](#-autenticação-e-segurança)
- [Rotas do frontend](#-rotas-do-frontend)
- [Backend e API REST](#-backend-e-api-rest)
- [Banco de dados](#-banco-de-dados)
- [Como executar localmente](#-como-executar-localmente)
- [Configuração de ambiente](#-configuração-de-ambiente)
- [Testes](#-testes)
- [Tecnologias e ferramentas](#-tecnologias-e-ferramentas)
- [Documentação](#-documentação)
- [Equipe](#-equipe)
- [Licença](#-licença)

---

## 📌 Sobre o projeto

O **OdontoCare** é uma aplicação web desenvolvida com o objetivo de oferecer uma solução digital para o gerenciamento de atividades relacionadas a uma clínica odontológica.

A aplicação integra um frontend desenvolvido com Angular e Ionic a um backend desenvolvido em Java com Spring Boot, utilizando uma API REST para comunicação entre as camadas.

O sistema possui funcionalidades voltadas à experiência dos usuários, permitindo acessar informações sobre dentistas, consultar detalhes dos profissionais e trabalhar com agendamentos mediante autenticação.

A arquitetura foi organizada com separação entre frontend, backend e documentação, favorecendo a manutenção e evolução do código.

## 🎯 Objetivos

- Desenvolver uma aplicação web utilizando tecnologias modernas.
- Implementar uma arquitetura separando frontend e backend.
- Desenvolver uma API REST utilizando Spring Boot.
- Implementar autenticação e controle de acesso.
- Trabalhar com persistência de dados utilizando JPA.
- Integrar Angular/Ionic com os serviços do backend.
- Aplicar conceitos de desenvolvimento de software, segurança e organização de projetos.

---

## ⚙️ Funcionalidades

### 👤 Usuários e autenticação

- Cadastro de usuários.
- Login na aplicação.
- Autenticação baseada em JWT.
- Proteção de rotas que exigem autenticação.
- Gerenciamento de perfil.

### 🦷 Dentistas

- Visualização da página de dentistas.
- Consulta das informações dos profissionais.
- Acesso à página de detalhes de um dentista.
- Navegação entre listagem e detalhes dos profissionais.

### 📅 Agendamentos

- Acesso à área de agendamentos.
- Proteção da funcionalidade por autenticação.
- Integração com os serviços disponibilizados pelo backend.

### 🏠 Navegação e informações

- Página inicial.
- Página sobre o projeto.
- Navegação entre páginas da aplicação.
- Redirecionamento para a página inicial em rotas não encontradas.

---

## 🏗️ Arquitetura do projeto

O OdontoCare utiliza uma arquitetura dividida em duas aplicações principais:

```text
                    ┌──────────────────────┐
                    │       USUÁRIO        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FRONTEND        │
                    │                      │
                    │   Angular + Ionic    │
                    │                      │
                    │  Pages / Services    │
                    │  Guards / Routes     │
                    └──────────┬───────────┘
                               │
                         HTTP / JSON
                               │
                               ▼
                    ┌──────────────────────┐
                    │       BACKEND        │
                    │                      │
                    │      Spring Boot     │
                    │                      │
                    │ Controllers          │
                    │ Services             │
                    │ Repositories         │
                    │ Security / JWT       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      DATABASE        │
                    │                      │
                    │     H2 / PostgreSQL  │
                    └──────────────────────┘
```

### Frontend

Responsável pela interface e interação com o usuário.

- Renderização das páginas.
- Navegação entre funcionalidades.
- Comunicação HTTP com o backend.
- Controle de rotas protegidas.
- Exibição das informações retornadas pela API.

### Backend

Responsável pelas regras de negócio e processamento das solicitações.

- Disponibilização de endpoints REST.
- Processamento das requisições HTTP.
- Validação dos dados.
- Autenticação e autorização.
- Persistência das informações.
- Comunicação com o banco de dados.

### Banco de dados

Responsável pelo armazenamento das informações utilizadas pela aplicação.

---

## 💻 Stack tecnológica

### Backend

| Tecnologia | Utilização |
|---|---|
| Java 25 | Linguagem de programação |
| Spring Boot 3.5.6 | Framework backend |
| Spring Web | Desenvolvimento da API REST |
| Spring Data JPA | Persistência e acesso aos dados |
| Hibernate | ORM |
| Spring Security | Segurança e autorização |
| JWT | Autenticação por tokens |
| Maven | Gerenciamento de dependências |
| Lombok | Redução de código repetitivo |
| H2 | Banco de dados para execução local |
| PostgreSQL | Banco de dados relacional |

### Frontend

| Tecnologia | Utilização |
|---|---|
| Angular 22 | Framework frontend |
| Ionic 9 | Componentes de interface |
| TypeScript 6 | Linguagem de programação |
| SCSS | Estilização |
| HTML5 | Estrutura das páginas |
| RxJS | Programação reativa |
| Ionicons | Biblioteca de ícones |

### Testes e qualidade

| Ferramenta | Utilização |
|---|---|
| JUnit / Spring Boot Test | Testes do backend |
| Vitest | Testes unitários do frontend |
| Playwright | Testes end-to-end |
| ESLint | Análise estática |
| Prettier | Padronização de código |

---

## 📁 Estrutura do repositório

```text
OdontoCare/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/clinicaodonto/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   ├── home/
│   │   │   └── pages/
│   │   │
│   │   ├── assets/
│   │   ├── environments/
│   │   ├── theme/
│   │   └── main.ts
│   │
│   ├── e2e/
│   ├── angular.json
│   └── package.json
│
├── docs/
├── .gitignore
├── LICENSE
└── README.md
```

### Organização das pastas

| Diretório | Responsabilidade |
|---|---|
| `backend/` | Código-fonte da API |
| `backend/src/main/` | Implementação principal do backend |
| `backend/src/main/resources/` | Arquivos de configuração |
| `backend/src/test/` | Testes automatizados do backend |
| `frontend/` | Aplicação Angular/Ionic |
| `frontend/src/app/` | Componentes, páginas e funcionalidades |
| `frontend/src/assets/` | Recursos estáticos |
| `frontend/src/environments/` | Configurações por ambiente |
| `frontend/e2e/` | Testes de ponta a ponta |
| `docs/` | Documentação técnica |

---

## 🔐 Autenticação e segurança

A aplicação utiliza Spring Security em conjunto com JSON Web Token (JWT) para implementar autenticação.

O fluxo de autenticação contempla:

1. O usuário realiza o login pela interface.
2. O frontend envia as credenciais para o backend.
3. O backend processa a autenticação.
4. Após a autenticação, o token JWT é utilizado para identificar o usuário nas requisições protegidas.
5. O frontend utiliza um Auth Guard para restringir o acesso às rotas protegidas.

### Rotas protegidas

- `/dentistas/:id`
- `/agendamentos`
- `/perfil`

### Rotas públicas

- `/home`
- `/dentistas`
- `/sobre`
- `/login`
- `/cadastro`

---

## 🧭 Rotas do frontend

| Rota | Página | Acesso |
|---|---|---|
| `/home` | Página inicial | Público |
| `/dentistas` | Listagem de dentistas | Público |
| `/dentistas/:id` | Detalhes do dentista | Autenticado |
| `/agendamentos` | Agendamentos | Autenticado |
| `/sobre` | Sobre o projeto | Público |
| `/perfil` | Perfil do usuário | Autenticado |
| `/login` | Login | Público |
| `/cadastro` | Cadastro | Público |

O frontend utiliza Angular Router com carregamento de componentes sob demanda (Lazy Loading).

---

## 🔌 Backend e API REST

O backend é desenvolvido utilizando Spring Boot e disponibiliza serviços HTTP para integração com o frontend.

### Organização em camadas

| Camada | Responsabilidade |
|---|---|
| Controller | Receber e responder às requisições HTTP |
| Service | Implementar regras de negócio |
| Repository | Acessar e persistir os dados |
| Entity | Representar as entidades do banco |
| DTO | Transportar dados entre as camadas |
| Security | Gerenciar autenticação e proteção dos recursos |

### Comunicação

A comunicação entre frontend e backend ocorre por meio de requisições HTTP, utilizando JSON como formato de troca de dados.

O backend está configurado para iniciar na porta `8080`.

```text
http://localhost:8080
```

---

## 🗄️ Banco de dados

O projeto possui suporte ao H2 e PostgreSQL.

### H2

Utilizado na configuração de desenvolvimento local.

- Banco de dados relacional.
- Persistência em arquivo.
- Integração com Spring Data JPA.
- Configuração pelo Spring Boot.

### PostgreSQL

O projeto também possui dependência do driver PostgreSQL, permitindo utilizar esse banco em outros ambientes.

| Variável | Descrição |
|---|---|
| `DB_URL` | URL de conexão |
| `DB_DRIVER` | Driver JDBC |
| `DB_USERNAME` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |

---

## 🚀 Como executar localmente

### Pré-requisitos

- Java JDK 25.
- Maven.
- Node.js.
- Git.
- Angular CLI.

### 1. Clonar o repositório

```bash
git clone https://github.com/belyisa-bit/OdontoCare.git
cd OdontoCare
```

### 2. Executar o backend

```bash
cd backend
```

Configure a variável JWT no PowerShell:

```powershell
$env:JWT_SECRET="sua-chave-secreta-forte"
```

Execute:

```bash
mvn spring-boot:run
```

Backend disponível em:

```text
http://localhost:8080
```

### 3. Executar o frontend

Abra outro terminal:

```bash
cd OdontoCare/frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm start
```

Frontend disponível em:

```text
http://localhost:4200
```

### 4. Acessar a aplicação

Com os dois serviços em execução, acesse o frontend pelo navegador.

---

## 🔧 Configuração de ambiente

| Variável | Valor padrão |
|---|---|
| `DB_URL` | `jdbc:h2:file:./data/odontocare;MODE=PostgreSQL;DB_CLOSE_ON_EXIT=FALSE` |
| `DB_DRIVER` | `org.h2.Driver` |
| `DB_USERNAME` | `sa` |
| `DB_PASSWORD` | Vazio |
| `JWT_SECRET` | Obrigatória |
| `JWT_EXPIRATION_MS` | `3600000` |
| `H2_CONSOLE_ENABLED` | `false` |

**Importante:** não publique credenciais, senhas ou chaves secretas no GitHub.

---

## 🧪 Testes

### Backend

```bash
cd backend
mvn test
```

### Frontend

Testes unitários:

```bash
cd frontend
npm run test:unit
```

Testes end-to-end:

```bash
npm run test:e2e
```

Análise de qualidade:

```bash
npm run lint
```

---

## 🛠️ Tecnologias e ferramentas

- [IntelliJ IDEA](https://www.jetbrains.com/idea/) — Desenvolvimento backend.
- [Visual Studio Code](https://code.visualstudio.com/) — Desenvolvimento frontend.
- [Git](https://git-scm.com/) — Controle de versão.
- [GitHub](https://github.com/) — Hospedagem e colaboração.
- [Postman](https://www.postman.com/) — Testes de API.
- [Maven](https://maven.apache.org/) — Gerenciamento de dependências.

---

## 📚 Documentação

A documentação complementar está organizada no diretório:

```text
docs/
```

Podem ser consultados materiais como:

- Documentação da arquitetura.
- Diagramas de funcionamento.
- Modelagem de dados.
- Fluxos de autenticação.
- Evidências de testes.
- Documentação da API.

## Equipe

| Integrante | Matrícula | Principais contribuições |
|---|---|---|
| Isabelle Victória | 01808806 | Estruturação do projeto, modelagem e desenvolvimento do backend |
| Gabrielly Carneiro | 01797929 | Componentes de layout e configuração de rotas |
| Geovanna Almeida | 01815451 | Criação de páginas no frontend |
| Josinaldo Xavier | 01823400 | Apoio geral no desenvolvimento |
| Gabriela Sabino | 01660021 | Hooks e services de dados do frontend e backend |

---

## Uso de inteligência artificial

Ferramentas de IA foram usadas como apoio ao planejamento, modelagem, revisão de código, organização de tarefas e documentação.

- **ChatGPT** — planejamento, divisão de tarefas e revisão de lógica.
- **Google Gemini Pro** — modelagem de dados e revisão de trechos de código.
- **Claude (Anthropic)** — organização do backlog, dados fictícios, exemplos de endpoints e documentação.

---

## 📄 Licença

Este projeto está disponibilizado sob a licença **MIT**.

Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

---

<div align="center">

<badge>CONCLUÍDO</badge>

**🦷 OdontoCare — Tecnologia a serviço do cuidado odontológico.**

Projeto acadêmico desenvolvido com dedicação e aprendizado contínuo.

</div>
