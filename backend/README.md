# FitCooker - Backend

Back-end em Python + Flask + MySQL para o site FitCooker, um sistema de receitas saudáveis com cadastro, avaliações e categorias.

---

## Tecnologias Utilizadas

- Python 3
- Flask
- Flask-JWT-Extended
- MySQL
- MySQL Connector Python
- dotenv
- Flask-CORS

---

## Estrutura do Projeto

fitcooker_backend/
│
├── app.py                 # Ponto de entrada do servidor Flask
├── db.py                  # Conexão com o banco de dados MySQL
├── .env.example           # Variáveis de ambiente (modelo)
├── requirements.txt       # Dependências do projeto
│
├── config/
│   └── config.py          # Carregamento de variáveis de ambiente
│
├── routes/
│   ├── auth.py            # Rotas de autenticação
│   ├── receitas.py        # Rotas de receitas
│   ├── ingredientes_etapas.py # Rotas de ingredientes e etapas
│   ├── avaliacoes.py      # Rotas de avaliações
│   └── categorias.py      # Rotas de categorias
│
└── schema.sql             # Script SQL para criação do banco de dados

---

## Pré-requisitos

- Python 3.8+
- MySQL Server
- MySQL Workbench (opcional)

---

##  Como rodar o projeto

1. Clone o repositório
2. Crie o banco de dados MySQL chamado `Fitcooker`
3. Execute o script `schema.sql` para criar as tabelas
4. Crie um arquivo `.env` com as variáveis:

DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=bd12  
DB_NAME=Fitcooker  
SECRET_KEY=sua-chave-secreta  
JWT_SECRET_KEY=chave-jwt-muito-secreta

5. Instale as dependências:

pip install -r requirements.txt

6. Rode a aplicação:

python app.py

---

## Rotas protegidas com JWT

Use o token de acesso retornado no login (/login) para acessar rotas protegidas, enviando no header:

Authorization: Bearer <seu_token_aqui>

---

## Principais Endpoints

Verbo | Rota | Protegido? | Descrição  
------|------|------------|-----------  
POST  | /register                     | Não | Cadastra um novo usuário  
POST  | /login                        | Não | Realiza login e retorna token  
GET   | /receitas                     | Sim | Lista todas as receitas  
POST  | /receitas                     | Sim | Cria uma nova receita  
POST  | /receitas/<id>/ingredientes  | Sim | Adiciona ingrediente à receita  
POST  | /receitas/<id>/etapas        | Sim | Adiciona etapa de preparo  
POST  | /receitas/<id>/avaliacoes    | Sim | Avalia uma receita  
GET   | /categorias                  | Não | Lista todas as categorias  
POST  | /categorias                  | Sim | Cria nova categoria  

---

## Autor

Feito com 💚 para o projeto FitCooker.  
Organizado por você com suporte do ChatGPT.
