# Automação de Testes de API - Projeto ShortBeyond

Este repositório contém um projeto de automação de testes de API desenvolvido com **Playwright**. O projeto foi criado como parte do Bootcamp **Playwright Além da Interface** da TestBeyond.

O objetivo é demonstrar as melhores práticas na automação de testes para uma API REST, cobrindo validações de contrato, regras de negócio e fluxos de usuário.

---

## 🛠️ <a name="tech-stack"></a> Tecnologias Utilizadas

* **Framework de Testes:** [Playwright](https://playwright.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/) / [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
* **Ambiente de Execução:** [Node.js](https://nodejs.org/) (v22.x)
* **Gerenciador de Pacotes:** [npm](https://www.npmjs.com/)
* **Ambiente da API:** [Podman](https://podman.io/) (para orquestração de contêineres)
* **Editor de Código:** [Visual Studio Code](https://code.visualstudio.com/)

---

## 🚀 Começando

Siga os passos abaixo para configurar seu ambiente de desenvolvimento e executar os testes.

### 1. Pré-requisitos: Configuração do Ambiente

Esta seção garante que você tenha todo o ambiente configurado corretamente antes de rodar o projeto. A instalação dessas ferramentas é um pré-requisito fundamental para evitar dores de cabeça.

<details><summary><strong>Clique para expandir o Guia de Instalação de Ferramentas Essenciais</strong></summary>

---

#### 📦 Node.js (v22.19.0)

Base do nosso ambiente de desenvolvimento, acompanhado do **npm** (gerenciador de pacotes).

**📥 Windows:**

* Baixe e instale a partir do site oficial: [Node.js v22.19.0](https://nodejs.org/dist/v22.19.0/node-v22.19.0-x64.msi)

**🐧 Linux (Ubuntu/Debian) / 🍎 Mac (via NVM):**

```bash
# Instalar NVM (Node Version Manager)
curl -o- [https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh](https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh) | bash

# Importante: Feche e reabra o terminal ou execute o comando abaixo para ativar o NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instalar e usar a versão correta do Node.js
nvm install 22
nvm use 22
nvm alias default 22
```

**🔍 Verificação:**

```bash
node -v   # Deve retornar: v22.x.x
npm -v    # Deve retornar: 10.x.x
```

---

#### 🔧 Git e Git Bash

Ferramenta fundamental para controle de versão. No Windows, o **Git Bash** será nossa interface de linha de comando padrão.

**📥 Windows:**

1. Baixe e instale o [Git for Windows](https://gitforwindows.org/).
2. Durante a instalação, na etapa **“Select Components”**, marque a opção para adicionar o **Git Bash ao perfil do Windows Terminal**.
3. Mantenha as opções padrão nas demais etapas.

**🐧 Linux (Ubuntu/Debian):**

```bash
sudo apt update && sudo apt install git -y
```

**⚙️ Configuração Inicial (todos os sistemas):**

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

---

#### 📝 Visual Studio Code

Nosso editor de código padrão. Leve, rápido e com um ecossistema de extensões excelente.

* **Download:** [Visual Studio Code](https://code.visualstudio.com/)
* **Extensões Recomendadas:** Material Icon Theme, One Dark Pro, Prettier - Code formatter.

---
</details>

### 2. Rodando o Projeto

Com o ambiente configurado, siga os passos abaixo no seu terminal.

**1. Clone o repositório:**

```bash
git clone [https://github.com/seu-usuario/shortbeyond.git](https://github.com/seu-usuario/shortbeyond.git)
cd shortbeyond
```

**2. Suba o ambiente da API com Podman:**
> Este comando utiliza o arquivo `shortbeyond.yaml` para orquestrar e iniciar os contêineres da API que será testada.

```bash
podman play kube shortbeyond.yaml
```

**3. Instale as dependências do projeto:**
> Este comando lê o arquivo `package.json` e baixa todas as bibliotecas necessárias, incluindo o Playwright.

```bash
npm install
```

---

## 🧪 Executando os Testes

**1. Rodar todos os testes de API:**

```bash
npx playwright test
```

**2. Visualizar o relatório de testes:**
> Este comando iniciará um servidor web local para que você possa navegar pelo relatório HTML detalhado da última execução.

```bash
npx playwright show-report
```
