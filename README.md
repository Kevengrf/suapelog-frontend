# SuapeLog - Gestão de Logística Portuária (Frontend)

> Interface moderna e responsiva para o sistema de controle de acesso de caminhões do Porto de Suape. Este projeto foi desenvolvido como o frontend da plataforma SuapeLog, utilizando React, TypeScript e Vite.

**[Acesse a demonstração ao vivo aqui!](https://kevengrf.github.io/SEU-REPOSITORIO/)** <!-- Substitua pela sua URL do GitHub Pages -->

---

## ✨ Funcionalidades

*   **Dashboard Principal:** Visualização em tempo real dos principais indicadores (KPIs), como número de veículos no pátio e totais de entrada/saída.
*   **Relatório de BI Interativo:** Uma tela que simula um dashboard de Business Intelligence com gráficos de barra e dados atualizados dinamicamente.
*   **Design Responsivo (Mobile-First):** A interface se adapta perfeitamente a qualquer tamanho de tela, de desktops a celulares.
*   **Navegação Fluida:** Barra de navegação lateral em telas grandes e um menu "hambúrguer" animado em dispositivos móveis.
*   **Tabelas de Dados Inteligentes:** As tabelas de registros se transformam em "cards" em telas pequenas para melhor legibilidade.
*   **Tema Moderno:** Interface com um design limpo e profissional, utilizando uma paleta de cores verde e branco.

## 🚀 Tecnologias Utilizadas

*   **[React](https://reactjs.org/)** - Biblioteca para construção da interface de usuário.
*   **[TypeScript](https://www.typescriptlang.org/)** - Superset de JavaScript que adiciona tipagem estática.
*   **[Vite](https://vitejs.dev/)** - Ferramenta de build moderna e ultrarrápida.
*   **[Bootstrap](https://getbootstrap.com/)** - Framework CSS para estilização e responsividade.
*   **[Recharts](https://recharts.org/)** - Biblioteca de gráficos para React.
*   **[date-fns](https://date-fns.org/)** - Biblioteca para manipulação de datas em JavaScript.
*   **[React Icons](https://react-icons.github.io/react-icons/)** - Pacote com ícones populares.

---

## 🏁 Como Executar o Projeto

Siga os passos abaixo para rodar o projeto em sua máquina local.

**1. Clone o repositório:**
```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).

---

## 🚀 Deploy no GitHub Pages

Este projeto está pronto para ser publicado gratuitamente no GitHub Pages.

**1. Configure o `package.json`:**

Abra o arquivo `package.json` e adicione um campo `"homepage"` no topo, com a URL onde o site será hospedado. Substitua `SEU-USUARIO` e `SEU-REPOSITORIO` pelos seus dados:

```json
{
  "name": "suapelog-frontend",
  "private": true,
  "version": "0.0.0",
  "homepage": "https://SEU-USUARIO.github.io/SEU-REPOSITORIO/",
  // ... resto do arquivo
}
```

**2. Adicione os scripts de deploy:**

Ainda no `package.json`, dentro do objeto `"scripts"`, adicione as seguintes linhas:

```json
"scripts": {
  // ... outros scripts como "dev", "build", etc.
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
},
```

**3. Faça o deploy:**

Execute o seguinte comando no seu terminal. Ele irá compilar o projeto e enviar os arquivos para a branch `gh-pages` do seu repositório.

```bash
npm run deploy
```

**4. Configure o Repositório no GitHub:**

*   Vá para o seu repositório no GitHub.
*   Clique em **Settings** (Configurações).
*   No menu lateral, vá para **Pages**.
*   Na seção **Build and deployment**, em **Source**, selecione **Deploy from a branch**.
*   Em **Branch**, selecione `gh-pages` e a pasta `/ (root)`.
*   Clique em **Save**.

Aguarde alguns minutos e sua aplicação estará no ar na URL que você configurou no campo `homepage`!