# FitCooker: Sua Plataforma Completa de Receitas e Nutrição 🍳💪

![FitCooker Home Page](https://i.imgur.com/kY8p2k8.png)

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-%2361DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-%23646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-%233178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50-darkgreen?logo=supabase)](https://supabase.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-%2306B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

**FitCooker** é uma plataforma web moderna e interativa, desenhada para entusiastas da culinária e da vida saudável. Crie, descubra e compartilhe receitas, com cálculo automático de macronutrientes, interaja com uma comunidade de chefs e organize sua jornada para uma alimentação melhor.

### ✨ [Acesse o Projeto Online (se disponível)](https://SEU_LINK_AQUI)

---

## 📋 Índice

* [🌟 Sobre o Projeto](#-sobre-o-projeto)
    * [Principais Funcionalidades](#-principais-funcionalidades)
    * [Construído Com](#-construído-com)
* [🚀 Começando](#-começando)
    * [Pré-requisitos](#-pré-requisitos)
    * [Instalação e Configuração](#-instalação-e-configuração)
* [📂 Estrutura do Projeto](#-estrutura-do-projeto)
* [🤝 Contribuições](#-contribuições)
* [📧 Contato](#-contato)

---

## 🌟 Sobre o Projeto

O FitCooker foi criado para resolver a dificuldade de encontrar e gerenciar receitas que se alinham a objetivos de saúde e fitness. A plataforma oferece ferramentas para que qualquer pessoa, de chefs experientes a cozinheiros de primeira viagem, possa não apenas preparar pratos deliciosos, mas também entender seu valor nutricional de forma automática e intuitiva.

### 🔥 Principais Funcionalidades

* **👨‍🍳 Gestão de Receitas:** Crie, edite e compartilhe suas receitas com um formulário completo e intuitivo.
* **📊 Cálculo Automático de Nutrientes:** Ao adicionar ingredientes, os macronutrientes (calorias, proteínas, carboidratos, gorduras) são calculados automaticamente.
* **🌐 Comunidade Interativa:** Siga seus chefs favoritos, salve receitas, avalie e comente nos pratos que você experimentou.
* **🔍 Busca e Filtros Avançados:** Encontre receitas por nome, ingredientes, categorias, dificuldade, tempo de preparo e mais.
* **🛠️ Ferramentas Fitness:** Calculadoras de IMC, Macronutrientes e Conversor de Unidades para auxiliar no seu planejamento.
* **👤 Perfil de Usuário:** Acompanhe suas estatísticas, receitas criadas, favoritas e sua atividade na comunidade.
* **🔐 Autenticação Segura:** Sistema completo de login, cadastro e recuperação de senha utilizando Supabase Auth.
* **📱 Design Responsivo:** Experiência otimizada para desktop, tablets e smartphones.

### 🛠️ Construído Com

Esta seção lista as principais tecnologias e bibliotecas que dão vida ao FitCooker.

| Tecnologia | Descrição |
| :--- | :--- |
| **Framework Principal** | |
| [React](https://react.dev/) | Biblioteca principal para a construção da interface de usuário. |
| [Vite](https://vitejs.dev/) | Ferramenta de build moderna e ultra-rápida para o desenvolvimento frontend. |
| [TypeScript](https://www.typescriptlang.org/) | Superset do JavaScript que adiciona tipagem estática ao código. |
| **Backend & Banco de Dados** | |
| [Supabase](https://supabase.io/) | Plataforma open-source que oferece banco de dados Postgres, autenticação, armazenamento e APIs. |
| **Estilização e UI** | |
| [Tailwind CSS](https://tailwindcss.com/) | Framework CSS utility-first para estilização rápida e consistente. |
| [shadcn/ui](https://ui.shadcn.com/) | Coleção de componentes de UI reusáveis e acessíveis. |
| [Framer Motion](https://www.framer.com/motion/) | Biblioteca para criar animações fluidas e complexas. |
| **Gerenciamento de Dados e Estado** | |
| [React Query](https://tanstack.com/query/latest) | Gerenciamento de estado de servidor, cache, e sincronização de dados. |
| [React Router](https://reactrouter.com/) | Para gerenciamento de rotas na aplicação. |
| [React Hook Form](https://react-hook-form.com/) | Gerenciamento de formulários performático e flexível. |

---

## 🚀 Começando

Para rodar o projeto localmente, siga os passos abaixo.

### ✅ Pré-requisitos

* **Node.js**: Versão 18.x ou superior. ([Baixe aqui](https://nodejs.org/))
* **npm** ou **yarn**: Gerenciador de pacotes.
* **Supabase Account**: Você precisará de uma conta gratuita no [Supabase](https://supabase.com/).
* **Supabase CLI**: Para aplicar as migrações do banco de dados. ([Guia de instalação](https://supabase.com/docs/guides/cli/getting-started))

### ⚙️ Instalação e Configuração

1.  **Clone o repositório:**
    ```sh
    git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
    cd SEU_REPOSITORIO
    ```

2.  **Instale as dependências:**
    ```sh
    npm install
    ```

3.  **Configure o Supabase:**
    * Acesse sua conta no [Supabase](https://supabase.com/) e crie um novo projeto.
    * No painel do seu projeto, vá para **Project Settings > API**.
    * Copie o **Project URL** e a **Project API Key (anon public)**.

4.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo `.env` na raiz do projeto.
    * Adicione as chaves do Supabase que você copiou:
        ```env
        VITE_SUPABASE_URL=https://SEU_URL_DO_PROJETO.supabase.co
        VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
        ```

5.  **Aplique as Migrações do Banco de Dados:**
    * Faça o login na CLI do Supabase:
        ```sh
        supabase login
        ```
    * Vincule seu projeto local ao projeto remoto:
        ```sh
        supabase link --project-ref SEU_ID_DO_PROJETO
        ```
        (Você encontra o `project-ref` na URL do seu painel Supabase: `https://app.supabase.com/project/SEU_ID_DO_PROJETO`)
    * Envie as migrações para criar as tabelas no seu banco de dados:
        ```sh
        supabase db push
        ```
    * **Observação:** As políticas de segurança (RLS) e os triggers já estão incluídos nas migrações e serão aplicados automaticamente.

6.  **Inicie o servidor de desenvolvimento:**
    ```sh
    npm run dev
    ```

7.  Abra seu navegador e acesse `http://localhost:8080` (ou a porta indicada no terminal) para ver o projeto em ação!

---

## 📂 Estrutura do Projeto

A estrutura de pastas foi organizada para facilitar a manutenção e escalabilidade do projeto.

```
/
├── public/                # Arquivos estáticos
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── add-recipe/    # Componentes da página de adicionar receita
│   │   ├── home/          # Componentes da página inicial pública
│   │   ├── layout/        # Componentes de layout (Navbar, Footer)
│   │   ├── recipe/        # Componentes de detalhes de receita
│   │   └── ui/            # Componentes de UI genéricos (shadcn)
│   ├── hooks/             # Hooks customizados
│   ├── integrations/      # Integrações com serviços externos (Supabase)
│   ├── lib/               # Funções utilitárias
│   ├── pages/             # Componentes de página (rotas)
│   └── types/             # Definições de tipos TypeScript
├── supabase/
│   └── migrations/        # Migrações do banco de dados SQL
├── .env.example           # Exemplo de variáveis de ambiente
├── package.json
└── README.md
```

---

## 🤝 Contribuições

Contribuições são o que tornam a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito bem-vinda**.

1.  **Faça um Fork** do projeto.
2.  Crie uma nova Branch (`git checkout -b feature/FuncionalidadeIncrivel`).
3.  Faça o **Commit** de suas alterações (`git commit -m 'Adiciona FuncionalidadeIncrivel'`).
4.  Faça o **Push** para a Branch (`git push origin feature/FuncionalidadeIncrivel`).
5.  Abra um **Pull Request**.

---

## 📧 Contato

Ígor Tavares Rocha

* **LinkedIn**: [igortrocha](https://www.linkedin.com/in/igor-roch4/)
* **GitHub**: [https://github.com/igorr0cha](https://github.com/igorr0cha)
* **Email**: [igort10rocha@gmail.com](mailto:igort10rocha@gmail.com)

Link do Projeto: [fitcooker-project](https://github.com/igorr0cha/fitcooker-v3)
