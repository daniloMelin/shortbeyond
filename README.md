# 🚀 Automação de Testes de API & Performance - ShortBeyond

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![Artillery](https://img.shields.io/badge/Artillery-00d7a0?style=for-the-badge&logo=artillery&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Podman](https://img.shields.io/badge/Podman-892CA0?style=for-the-badge&logo=podman&logoColor=white)

Este repositório contém uma estratégia completa de qualidade para a API **ShortBeyond**, desenvolvida durante os Bootcamps da **TestBeyond**. O projeto vai além do teste funcional, integrando testes de carga para garantir escalabilidade.

---

## 🏗️ 1. Arquitetura de Testes Funcionais (Playwright)

Para garantir manutenção e escalabilidade, o projeto foge do básico e implementa padrões avançados de engenharia de testes:

* **Service Layer (Camada de Serviços):** Adaptação do padrão *Page Objects* para APIs. Os testes não chamam a API diretamente, mas sim métodos encapsulados (ex: `user.create()`), tornando o código limpo.
* **Factories & Faker:** Geração dinâmica de massa de dados para evitar conflitos de unicidade (ex: e-mails duplicados).
* **Custom Fixtures:** Injeção de dependências nativa do Playwright, permitindo instanciar serviços automaticamente nos testes.
* **Global Setup:** Orquestração do ambiente para garantir que o banco de dados e o token de autenticação estejam prontos antes da execução.

---

## ⚡ 2. Testes de Performance (Artillery)

Além de funcionar, a API precisa aguentar pressão. Foi realizada uma bateria de testes de performance focada em identificar gargalos.

### 📊 Resultados da Análise

| Tipo de Teste  | Objetivo               | Cenário                    | Resultado (P95) | Status          |
| -------------- | ---------------------- | -------------------------- | --------------- | --------------- |
| **Smoke Test** | Validar saúde da API   | Endpoint `/health`         | **1ms**         | ✅ Aprovado      |
| **Load Test**  | Simular dia a dia      | Fluxos de Cadastro e Login | **< 70ms**      | ✅ Aprovado      |
| **Spike Test** | Simular pico repentino | Carga súbita de 100 req/s  | **8000ms**      | 🔴 Falha Crítica |

### ⚠️ Insights Críticos: O Caos do Spike Test

Durante o teste de pico (Spike), a aplicação colapsou, revelando vulnerabilidades de infraestrutura:

* **Latência Explosiva:** O tempo de resposta saltou de 70ms para **8 segundos**.
* **Indisponibilidade:** Foram registrados **106 Timeouts**.
* **Taxa de Erro:** 7.55% das requisições falharam.
* **Conclusão Técnica:** O sistema necessita urgentemente de implementação de **Rate Limiting** e otimização de queries no Banco de Dados para suportar picos de tráfego.

---

## 🛠️ Tecnologias Utilizadas

* **Frameworks:** [Playwright](https://playwright.dev/) (Funcional) & [Artillery](https://www.artillery.io/) (Performance)
* **Linguagem:** TypeScript / JavaScript
* **Runtime:** Node.js (v22.x)
* **Infraestrutura:** Podman (Orquestração de contêineres da API)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter instalado: **Node.js (v22+)**, **Git** e **Podman**.

### 1. Configuração Inicial

```bash
# Clone o repositório
git clone [https://github.com/daniloMelin/shortbeyond.git](https://github.com/daniloMelin/shortbeyond.git)
cd shortbeyond

# Instale as dependências
npm install

# Suba o ambiente da API localmente com Podman
podman play kube shortbeyond.yaml
```

### 2\. Executando os Testes

**Testes Funcionais (Playwright):**

```bash
npx playwright test
```

*(Para ver o relatório: `npx playwright show-report`)*

**Testes de Performance (Artillery):**

```bash
# Executar Smoke Test
npm run test:perf:smoke

# Executar Spike Test (Cenário de Pico)
npm run test:perf:spike
```