# 📄 Plano de Testes de Performance - API ShortBeyond

## Histórico de Revisões

| Versão | Data                  | Autor(es)    | Descrição da Revisão      |
| :----- | :-------------------- | :----------- | :------------------------ |
| 1.0    | 27 de outubro de 2025 | Danilo Melin | Criação do Plano de Teste |

---

## 1. Objetivos

### 1.1 Objetivo Geral

Validar a performance, escalabilidade e estabilidade da API ShortBeyond sob diferentes cargas de trabalho, garantindo que atenda aos requisitos de performance estabelecidos.

### 1.2 Objetivos Específicos

* Verificar tempo de resposta dos endpoints principais
* Validar capacidade de processamento simultâneo
* Identificar gargalos de performance
* Testar comportamento sob cenários de erro

---

## 2. Escopo dos Testes

### 2.1 Endpoints Incluídos

| Endpoint           | Método | Função               | Prioridade |
| :----------------- | :----- | :------------------- | :--------- |
| /health            | GET    | Health check         | Alta       |
| /api/auth/register | POST   | Cadastro de usuários | Alta       |
| /api/auth/login    | POST   | Autenticação         | Alta       |
| /api/links         | POST   | Criação de links     | Alta       |
| /api/links         | GET    | Listagem de links    | Média      |

### 2.2 Cenários de Teste

* Cenários de Sucesso: Fluxos normais de operação
* Cenários de Erro: Validações e tratamentos de erros
* Cenários Mistos: Simulação de uso real com sucessos e falhas

### 2.3 Fora do Escopo

* Testes de segurança (penetração)
* Testes funcionais detalhados

---

## 3. Estratégia de Testes

### 3.1 Tipos de Teste
  
| Tipo        | Objetivo            | Duration | ArrivalRate  |
| :---------- | :------------------ | :------- | :----------- |
| Smoke Test  | Verificação básica  | 30s      | 1-2 req/s    |
| Load Test   | Carga normal        | 60s      | 5-10 req/s   |
| Stress Test | Limite da aplicação | 60s      | 15-25 req/   |
| Spike Test  | Picos de tráfego    | 30s      | 1→50→1 req/s |

### 3.2 Abordagem

* Testes isolados: Cada endpoint testado separadamente
* Testes integrados: Fluxos completos de usuário
* Progressão gradual: Aumento incremental de carga
* Cenários realistas: Proporção de sucessos/erros baseada em dados reais

---

## 4. Ambiente de Teste

### 4.1 Configuração

* URL Base: `http://localhost:3333`
* Ferramenta: Artillery
* SO: Linux/macOS/Windows
* Node.js: v20+

### 4.2 Estrutura de Arquivos

``` text
performance/
├── tests/
│   ├── health.yaml
│   ├── cadastro.yaml
│   ├── login.yaml
│   └── links.yaml
├── data/
│   └── usuarios.csv
├── reports/
└── scripts/
└── run-all-tests.sh
```

### 4.3 Dados de Teste

* Usuários: 50 usuários pré-cadastrados
* Emails únicos: Gerados com UUID
* Senhas: Padronizadas para teste

---

## 5. Cenários de Teste Detalhados

### 5.1 Health Check (`tests/health.yaml`)

* **Objetivo:** Verificar disponibilidade da API

```yaml
config:
  target: "http://localhost:3333"
  phases:
    - name: "health-check"
      duration: 30
      arrivalRate: 5
scenarios:
  - name: "Health Check"
    flow:
      - get:
          url: "/health"
          expect:
            - statusCode: 200
            - equals: ["shortbeyond-api", "{{ service }}"]
            - equals: ["healthy", "{{ status }}"]
```

**Critérios de Aceitação:**

* ✅ 100% de sucessos (status 200)
* ✅ Tempo de resposta p95 \< 50ms
* ✅ 0% de erros [cite: 51]

### 5.2 Cadastro de Usuários (`tests/cadastro.yaml`)

* **Objetivo:** Testar o cadastro com cenários de sucesso e e-mail duplicado.

```yaml
config:
  target: "http://localhost:3333/api"
  phases:
    - name: "cadastros"
      duration: 45
      arrivalRate: 3
  defaults:
    headers:
      Content-Type: "application/json"
scenarios:
  - name: "Cadastro com Sucesso"
    weight: 80
    flow:
      - post:
          url: "/auth/register"
          json:
            name: "Usuario {{ $uuid }}"
            email: "usuario-{{ $uuid }}@teste.com"
            password: "senha123"
          expect:
            - statusCode: 201
            - hasProperty: "user"
            - match:
                json: "$.message"
                value: "Usuário cadastrado com sucesso!"
  - name: "Email Duplicado"
    weight: 20
    flow:
      - post:
          url: "/auth/register"
          json:
            name: "Usuario Teste"
            email: "duplicado@teste.com"
            password: "senha123"
          expect:
            - statusCode: 400
            - hasProperty: "message"
            - match:
                json: "$.message"
                value: "Este e-mail já está em uso. Por favor, tente outro."
```

**Critérios de Aceitação:**

* ✅ 80% cadastros com sucesso (status 201)
* ✅ 20% erros de email duplicado (status 409)
* ✅ Tempo de resposta p95 \< 500ms
* ✅ User retornado com sucesso no JSON

### 5.3 Login de Usuários (`tests/login.yaml`)

* **Objetivo:** Testar autenticação com credenciais válidas e inválidas.

```yaml
config:
  target: "http://localhost:3333/api"
  payload:
    path: "./data/usuarios.csv"
    fields: ["name", "email", "password"]
  phases:
    - name: "login-test"
      duration: 60
      arrivalRate: 4
  defaults:
    headers:
      Content-Type: "application/json"
scenarios:
  - name: "Login com Sucesso"
    weight: 70
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          expect:
            - statusCode: 200
            - hasProperty: "data.token"
            - match:
                json: "$.message"
                value: "Login realizado com sucesso"
  - name: "Senha Incorreta"
    weight: 30
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "{{ email }}"
            password: "senha-incorreta"
          expect:
            - statusCode: 401
            - hasProperty: "message"
            - match:
                json: "$.message"
                value: "Credenciais"
```

**Critérios de Aceitação:**

* ✅ 70% logins com sucesso (status 200) [cite: 64]
* ✅ 30% erros de autenticação (status 400) [cite: 65]
* ✅ Tempo de resposta p95 \< 400ms [cite: 66]
* ✅ Tokens JWT válidos retornados [cite: 67]

### 5.4 Spike Test (`tests/spike.yaml`)

* **Objetivo:** Testar CRUD de links com usuários autenticados.

```yaml
config:
  target: "http://localhost:3333/api"
  payload:
    path: "../data/usuarios.csv"
    fields: ["name", "email", "password"]
  phases:
    # Fase 1: Aquecimento
    - name: "warmup"
      duration: 30
      arrivalRate: 5
    # Fase 2: Rampa gradual
    - name: "ramp-up"
      duration: 20
      arrivalRate: 5
      rampTo: 20
    # Fase 3: PICO
    - name: "spike"
      duration: 30
      arrivalRate: 100
    # Fase 4: Queda súbita
    - name: "drop"
      duration: 10
      arrivalRate: 100
      rampTo: 10
    # Fase 5: Recuperação
    - name: "recovery"
      duration: 10
      arrivalRate: 5
  defaults:
    headers:
      Content-Type: "application/json"
scenarios:
  - name: "Criar Link"
    weight: 50
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            json: "$.data.token"
            as: "authToken"
          expect:
            - statusCode: 200
      - post:
          url: "/links"
          json:
            original_url: "[https://instgram.com/papitoqa](https://instgram.com/papitoqa)"
            title: "Instagram do Papito"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 201
            - hasProperty: "data.short_url"
  - name: "Listar Links"
    weight: 30
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            json: "$.data.token"
            as: "authToken"
      - get:
          url: "/links"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 200
            - hasProperty: "data"
  - name: "Fluxo Completo"
    weight: 20
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            json: "$.data.token"
            as: "authToken"
      - post:
          url: "/links"
          json:
            original_url: "httpsG://[instgram.com/papitoqa](https://instgram.com/papitoqa)"
            title: "Instagram do Papito"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 201
      - get:
          url: "/links"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 200
```

**Critérios de Aceitação - Teste de Pico:**

* ✅ Taxa de sucesso ≥ 95% em todas as fases
* ✅ Taxa de sucesso ≥ 90% durante o pico (100 req/s)
* ✅ Latência p95 ≤ 300ms (fora do pico)
* ✅ Latência p95 ≤ 2s (durante o pico)
* ✅ Sistema se recupera em ≤ 30s após o pico
* ✅ Erros 5xx ≤ 3% durante o pico
* ✅ Sem crashes ou indisponibilidade total

---

## 6. Comandos de Execução

```bash
# Testes
npx artillery run performance/tests/health.yaml --output performance/reports/health.json
npx artillery run performance/tests/cadastro.yaml --output performance/reports/cadastro.json
npx artillery run performance/tests/login.yaml --output performance/reports/login.json
npx artillery run performance/tests/spike.yaml --output performance/reports/spike.json
```
