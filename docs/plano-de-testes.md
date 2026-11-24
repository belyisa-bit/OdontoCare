# Plano de Testes do OdontoCare

> Responsável: Gaby Rodrigues
> Última atualização: 23/11/2026
> Versão: 1.0

## 1. Objetivo

Garantir que o OdontoCare funcione conforme os requisitos (autenticação, agendamento e navegação), encontrando erros antes da entrega.

## 2. Escopo

**Será testado**
- Cadastro, login e sessão do usuário (token JWT)
- Proteção das rotas privadas (API e front-end)
- Criação, listagem e consulta de agendamentos, incluindo regras de horário
- Listagem, filtro e busca de dentistas via API e banco de dados
- Navegação, menu responsivo e lembretes

**Não será testado**
- Desempenho e carga
- Integração com PostgreSQL (os testes usam H2 em memória)
- Tratamentos via API (ainda não existem endpoints)
- Cancelamento e remarcação de agendamentos (funcionalidade ainda não existe)

## 3. Tipos de teste

| Tipo | O que cobre | Ferramenta | Onde fica |
|------|-------------|-----------|-----------|
| Integração (back-end) | Auth, segurança e agendamentos pela API | JUnit + Spring Boot Test (MockMvc) | `backend/src/test/java` |
| Unitário (front-end) | Serviços e páginas | Vitest | arquivos `*.spec.ts` em `frontend/src/app` |
| Ponta a ponta (E2E) | Fluxos reais no navegador | Playwright | `frontend/e2e` |
| Funcional manual | Fluxo completo com back e front rodando | Navegador | casos da seção 6 |
| Análise estática | Padrão de código | ESLint + Prettier | `npm run lint` |

### Testes automatizados que já existem

**Back-end** (`backend/src/test/java/com/clinicaodonto/api/`)

| Classe | Verifica |
|--------|----------|
| `AuthIntegrationTest` | Cadastro com sucesso, 409 para e-mail duplicado, 401 sem token, 401 para login inválido |
| `AuthAndBookingSecurityIntegrationTest` | Códigos de status de cadastro/login, rejeição de token inválido ou expirado em `/me`, e que o usuário só lista e lê os próprios agendamentos |
| `AuthPersistenceTests` | A conta cadastrada continua existindo após reiniciar a aplicação |
| `DentistaIntegrationTest` | Dentistas iniciais persistidos e endpoints públicos de lista e detalhe |
| `ClinicaOdontoApiApplicationTests` | O contexto da aplicação sobe (`contextLoads`) |

**Front-end**
- Unitários: `auth.service`, `http-auth.gateway`, `notifications.service`, `dentistas.service` e páginas (home, dentistas, detalhes, agendamentos, app).
- E2E (Playwright): `app.spec.ts` (menu, rotas, sino de lembretes, acessibilidade por teclado), `auth.spec.ts` (login, cadastro, requisitos de senha, token expirado, logout entre abas) e `dentistas.spec.ts` (filtro, busca sem acento, erro e nova tentativa, fotos).

## 4. Ambiente de teste

| Item | Configuração |
|------|--------------|
| Java / Maven | Java 25, Maven (versão do `pom.xml`) |
| Node / npm | Versões compatíveis com o `package.json` (Angular 22) |
| Banco nos testes do back | H2 em memória, recriado a cada execução (`src/test/resources/application.properties`) |
| `JWT_SECRET` nos testes | Já tem valor padrão no arquivo de teste |
| Navegadores E2E | Instalados via Playwright (`npx playwright install`) |
| Dados de teste | Fictícios. Nunca usar CPF, nome ou telefone reais de pacientes |

## 5. Como executar

```bash
# Back-end (a partir da pasta backend/)
mvn test

# Front-end (a partir da pasta frontend/)
npm ci
npm run lint            # ESLint, tipagem dos E2E e Prettier
npm run test:unit       # Vitest
npx playwright install  # só na primeira vez
npm run test:e2e        # Playwright
# ou tudo junto:
npm test
```

## 6. Casos de teste manuais e de API

Pré-requisito: back-end rodando em `:8080` (com `JWT_SECRET`) e front-end em `:4200`.

### 6.1 Autenticação

| ID | Cenário | Passos | Resultado esperado | Status |
|----|---------|--------|--------------------|--------|
| CT01 | Cadastro válido | Em `/cadastro`, informar nome, e-mail e senha forte (ex.: `Teste@123`) | Conta criada (201) e usuário entra na sessão | ⬜ |
| CT02 | E-mail duplicado | Cadastrar o mesmo e-mail duas vezes | Segundo cadastro retorna 409 com mensagem específica | ⬜ |
| CT03 | Senha fraca | Cadastrar com senha `abc123` | Erro 400 de validação; a tela mostra os requisitos pendentes | ⬜ |
| CT04 | E-mail inválido | Cadastrar com `joao@` | Erro 400 "Formato de e-mail inválido" | ⬜ |
| CT05 | Login válido | Em `/login`, informar credenciais corretas | Entra no sistema e volta ao destino que tentava acessar | ⬜ |
| CT06 | Login inválido | Informar senha errada | 401 e mensagem de erro; a senha não fica no formulário | ⬜ |
| CT07 | Rota privada sem login | Acessar `/agendamentos` deslogado | Redireciona para `/login` preservando o destino | ⬜ |
| CT08 | API sem token | `GET /api/agendamentos` sem cabeçalho `Authorization` | 401 | ⬜ |
| CT09 | Token expirado/inválido | `GET /api/auth/me` com token adulterado | 401 | ⬜ |
| CT10 | Logout | Sair da conta | Sessão limpa; páginas privadas voltam a pedir login | ⬜ |

### 6.2 Agendamentos

Dados válidos de referência: CPF `12345678901` (11 dígitos), telefone `81999999999`, data futura.

| ID | Cenário | Passos | Resultado esperado | Status |
|----|---------|--------|--------------------|--------|
| CT11 | Agendamento válido | Criar agendamento em dia futuro às `09:00` | 201, status `PENDENTE` | ⬜ |
| CT12 | Data no passado | Criar com data/hora passada | 400 "Escolha uma data e horário futuros" | ⬜ |
| CT13 | Horário fora do expediente | Criar às `13:00` ou `18:00` | 400 "Horário fora do funcionamento da clínica" | ⬜ |
| CT14 | Intervalo inválido | Criar às `09:15` | 400 "Horário fora do funcionamento da clínica" | ⬜ |
| CT15 | Limites do expediente | Criar às `08:00`, `11:30`, `14:00` e `17:30` | Todos aceitos (201) | ⬜ |
| CT16 | Horário ocupado | Criar duas vezes no mesmo dia/hora (mesmo dentista) | Segundo retorna 409 "Este horário já está ocupado" | ⬜ |
| CT17 | Mesmo horário, dentistas diferentes | Criar no mesmo horário com dentistas distintos | Ambos aceitos | ⬜ |
| CT18 | CPF inválido | Enviar CPF `123` ou com letras | 400 "CPF deve conter 11 dígitos numéricos" | ⬜ |
| CT19 | Campos obrigatórios vazios | Enviar nome, telefone ou tratamento em branco | 400 com a lista `errors` por campo | ⬜ |
| CT20 | Dentista inexistente | Enviar `dentistaId` que não existe | 404 "Dentista não encontrado" | ⬜ |
| CT21 | Listar próprios agendamentos | Usuário A cria e lista | Só os agendamentos de A, em ordem de data | ⬜ |
| CT22 | Isolamento entre usuários | Usuário B acessa `GET /api/agendamentos/{id}` de A | 404 | ⬜ |
| CT23 | Disponibilidade | `GET /api/agendamentos/disponibilidade?data=AAAA-MM-DD` | Lista os horários ocupados do dia | ⬜ |
| CT24 | Cancelado libera horário | Agendamento `CANCELADO` no horário X; tentar criar em X | Aceito, pois cancelados são ignorados | ⬜ |

### 6.3 Dentistas e navegação

| ID | Cenário | Passos | Resultado esperado | Status |
|----|---------|--------|--------------------|--------|
| CT25 | Filtro por especialidade | Na Home, escolher uma especialidade | `/dentistas` mostra só os dentistas dela | ⬜ |
| CT26 | Busca sem acento | Buscar "ortodontia" e "ortodôntia" | Mesmos resultados | ⬜ |
| CT27 | Sem resultados | Buscar um termo inexistente | Mensagem de nenhum resultado e opção de limpar | ⬜ |
| CT28 | Detalhes do dentista | Abrir `/dentistas/:id` logado | Mostra os dados do dentista | ⬜ |
| CT29 | Rota inexistente | Acessar `/qualquer-coisa` | Redireciona para `/home` | ⬜ |
| CT30 | Menu no celular | Reduzir a largura da tela e usar o menu | Navega e o menu fecha após a escolha | ⬜ |

Legenda: ⬜ não executado · ✅ passou · ❌ falhou

## 7. Critérios de aceitação

- 100% dos testes automatizados passam (`mvn test` e `npm test`).
- Todos os casos de CT01 a CT24 (autenticação e agendamento) passam.
- Nenhum bug crítico de segurança ou de dados em aberto.
- `npm run lint` sem avisos.

## 8. Registro de bugs

| ID | Descrição | Caso relacionado | Gravidade | Responsável | Status |
|----|-----------|------------------|-----------|-------------|--------|
| BUG01 | (exemplo) descrever o problema, os passos e o resultado obtido | CT0X | Alta / Média / Baixa | A definir | Aberto |

## 9. Cronograma

| Atividade | Início | Fim |
|-----------|--------|-----|
| Executar testes automatizados e corrigir falhas | A definir | A definir |
| Executar casos manuais (6.1 a 6.3) | A definir | A definir |
| Corrigir bugs e reexecutar | A definir | A definir |

## 10. Riscos e lacunas

| Risco / lacuna | Impacto | Mitigação |
|----------------|---------|-----------|
| Sem testes de unidade para `AgendamentoService` | Regras de horário só são validadas manualmente/por API | Adicionar testes cobrindo CT11 a CT17 |
| Logout só local, token vale até expirar | Token roubado continua válido | Reduzir validade ou criar lista de revogação |
| Sem CI | Falhas só aparecem se alguém rodar os testes | Criar workflow no GitHub Actions rodando `mvn test` e `npm test` |
| Banco de produção (PostgreSQL) não testado | Diferenças de comportamento em produção | Testar com PostgreSQL antes da entrega |
