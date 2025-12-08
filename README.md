# 🥗 FitCooker - Sua Jornada Culinária Saudável

<div align="center">

</div>

FitCooker é uma plataforma completa voltada para a alimentação saudável e engajamento comunitário. Mais do que um simples repositório de receitas, é uma rede social culinária que combina compartilhamento de pratos, ferramentas avançadas de análise nutricional e interação entre cozinheiros amadores e profissionais.

🔗 **Acesse o projeto online:** [fit-cooker.lovable.app](https://fit-cooker.lovable.app)

---

## 🚀 Funcionalidades Principais

### 🍳 Gestão de Receitas Avançada

- **Criação Detalhada:** Editor completo de receitas com suporte a upload de imagens (capa e galeria), categorização, tempo de preparo, dificuldade e porções.
- **Informações Nutricionais:** Cálculo automático e exibição de macros (proteínas, carboidratos, gorduras) e calorias por porção.
- **Filtros Inteligentes:** Busca refinada por ingredientes, restrições alimentares (vegano, sem glúten, etc.) e categorias.
- **Interatividade:** Sistema de avaliações (estrelas), favoritos e histórico de visualização.

### 🤝 Rede Social & Comunidade

- **Perfil do Cozinheiro:** Página de perfil personalizada com foto, bio e estatísticas do usuário (receitas criadas, seguidores).
- **Sistema de Seguidores:** Siga outros chefs e acompanhe suas novas criações no feed.
- **Comentários:** Sistema robusto de comentários em receitas para feedback, dúvidas e dicas.
- **Gamificação:** Rankings e destaques para os cozinheiros mais ativos e receitas mais populares.

### 🧮 Ferramentas de Saúde (Health Tools)

O FitCooker integra ferramentas essenciais para quem busca um estilo de vida saudável:

- **Calculadora de IMC:** Avaliação rápida do Índice de Massa Corporal com classificação oficial.
- **Calculadora de Macros:** Estimativa de necessidades diárias de macronutrientes baseada em objetivos (perda de peso, ganho de massa, manutenção).
- **Conversor de Unidades Culinárias:** Facilita a adaptação de medidas (xícaras para gramas, colheres para ml).
- **Calculadora de Nutrientes:** Análise detalhada de ingredientes individuais usando bases de dados confiáveis (USDA/OpenFoodFacts).

### 🔐 Segurança e Autenticação

- **Login Seguro:** Autenticação gerenciada via Supabase (Email/Senha e provedores sociais).
- **Proteção de Dados (RLS):** Implementação rigorosa de Row Level Security no PostgreSQL, garantindo que usuários só possam modificar ou deletar seus próprios dados.
- **Gestão de Sessão:** Controle de acesso a rotas protegidas e persistência de login.

---

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando as tecnologias mais modernas e performáticas do ecossistema JavaScript/TypeScript.

### Frontend

- **React 18:** Biblioteca principal para construção de interfaces reativas.
- **TypeScript:** Tipagem estática para maior segurança, autocompletar inteligente e manutenibilidade.
- **Vite:** Build tool de última geração para desenvolvimento ultrarrápido (HMR instantâneo).
- **Tailwind CSS:** Framework utility-first para estilização ágil e responsiva.
- **Shadcn UI:** Coleção de componentes de UI reutilizáveis, acessíveis e customizáveis (baseados em Radix UI).
- **TanStack Query (React Query):** Gerenciamento poderoso de estado assíncrono, cache e sincronização de dados.
- **React Router Dom:** Roteamento dinâmico para Single Page Application (SPA).
- **Zod + React Hook Form:** Validação de esquemas robusta e gerenciamento de formulários complexos.
- **Recharts:** Biblioteca para visualização de dados (gráficos de macros e estatísticas).
- **Lucide React:** Biblioteca de ícones leve e moderna.

### Backend & Infraestrutura (BaaS)

- **Supabase:** Plataforma Backend-as-a-Service open-source.
- **PostgreSQL:** Banco de dados relacional robusto.
- **Auth:** Autenticação e gestão de usuários.
- **Storage:** Armazenamento de arquivos (imagens de receitas e avatares).
- **Edge Functions:** Lógica de backend serverless para operações sensíveis (ex: deleção de conta).
- **Bun:** Runtime JavaScript moderno utilizado para gerenciamento de pacotes e scripts (evidenciado pelo bun.lockb).

### Qualidade de Código & Testes

- **Vitest:** Framework de testes unitários de alta performance (compatível com a API do Jest).
- **ESLint:** Linter para padronização e detecção de erros no código.

---

## 📂 Estrutura do Projeto

A arquitetura do projeto segue padrões de modularização para facilitar a escalabilidade e manutenção.

```bash
src/
├── __tests__/          # Testes unitários e de integração
├── components/         # Componentes React modularizados
│   ├── add-recipe/     # Componentes do fluxo de criação de receitas (Wizard)
│   ├── ferramentas/    # Calculadoras de saúde e conversores
│   ├── home/           # Componentes da página inicial
│   ├── layout/         # Estrutura global (Navbar, Footer, Sidebar)
│   ├── recipe/         # Componentes de visualização e interação com receitas
│   ├── recipes/        # Listagens e filtros de receitas
│   └── ui/             # Componentes base do Design System (Shadcn)
├── data/               # Dados estáticos e mocks para desenvolvimento
├── hooks/              # Custom Hooks (Lógica de negócio encapsulada)
│   ├── useAuth.tsx     # Contexto e lógica de autenticação
│   ├── useRecipes.tsx  # Hooks para CRUD de receitas
│   ├── useUserStats.tsx # Hooks para estatísticas do usuário
│   └── ...
├── integrations/       # Configuração de serviços externos (Cliente Supabase)
├── lib/                # Funções utilitárias e helpers (utils.ts)
├── pages/              # Páginas da aplicação (Roteamento)
├── services/           # Camada de serviço (ex: Processamento de Ingredientes)
└── types/              # Definições de tipos TypeScript globais
supabase/
├── migrations/         # Scripts SQL para versionamento do esquema do banco
└── functions/          # Edge Functions (Deno/Node)
```

---

## 🚀 Instalação e Execução

Siga os passos abaixo para rodar o projeto em seu ambiente local.

### Pré-requisitos

- **Node.js (v18+)** ou **Bun (v1.0+)** instalado.
- Uma conta no **Supabase** (para obter as chaves de API).

### Passo a Passo

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/fitcooker.git
   cd fitcooker
   ```

2. **Instale as dependências**

   Utilizando npm:
   ```bash
   npm install
   ```

   Ou preferencialmente com Bun (recomendado):
   ```bash
   bun install
   ```

3. **Configuração de Variáveis de Ambiente**

   Crie um arquivo `.env` na raiz do projeto e preencha com suas credenciais do Supabase:

   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-publica
   ```

4. **Execute o servidor de desenvolvimento**

   ```bash
   npm run dev
   # ou
   bun run dev
   ```

5. **Acesse a aplicação**

   Abra o navegador em `http://localhost:8080` (ou a porta indicada no terminal).

---

## 🧪 Rodando os Testes

Para garantir a integridade das funcionalidades principais e cálculos nutricionais:

```bash
# Rodar testes uma vez
npm run test

# Rodar em modo watch (desenvolvimento)
npm run test:watch
```

---

## 🔒 Segurança (RLS & Policies)

Este projeto utiliza PostgreSQL Row Level Security (RLS) para proteção granular de dados.

- **Leitura:** A maioria das receitas é pública, mas dados sensíveis de usuário são restritos.
- **Escrita:** Usuários só podem criar registros vinculados ao seu `auth.uid()`.
- **Edição/Exclusão:** Políticas estritas garantem que apenas o autor da receita ou do comentário possa modificá-lo.

---

## 🤝 Contribuição

Contribuições são muito bem-vindas! Se você deseja melhorar o FitCooker:

1. Faça um **Fork** do projeto.
2. Crie uma **Branch** para sua feature (`git checkout -b feature/NovaFeature`).
3. **Commit** suas mudanças (`git commit -m 'feat: Adiciona NovaFeature'`).
4. **Push** para a Branch (`git push origin feature/NovaFeature`).
5. Abra um **Pull Request**.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<p align="center">
  Desenvolvido com 💚 e código limpo pela equipe FitCooker.
</p>
