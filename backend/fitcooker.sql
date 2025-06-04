-- Usuários do sistema
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorias de receitas (Ex: Fitness, Vegetariana, Sobremesa)
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- Receitas criadas pelos usuários
CREATE TABLE receitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    tempo_preparo INT, -- em minutos
    porcoes INT,
    imagem_principal VARCHAR(255),
    id_usuario INT,
    id_categoria INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);

-- Ingredientes de cada receita
CREATE TABLE ingredientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Relação entre ingredientes e receitas (com quantidade e unidade)
CREATE TABLE receita_ingredientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_receita INT,
    id_ingrediente INT,
    quantidade DECIMAL(10,2),
    unidade VARCHAR(20),
    FOREIGN KEY (id_receita) REFERENCES receitas(id) ON DELETE CASCADE,
    FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id)
);

-- Etapas do preparo da receita
CREATE TABLE passos_receita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_receita INT,
    ordem INT,
    descricao TEXT,
    FOREIGN KEY (id_receita) REFERENCES receitas(id) ON DELETE CASCADE
);

-- Avaliações feitas pelos usuários
CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_receita INT,
    id_usuario INT,
    nota INT CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_receita) REFERENCES receitas(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

