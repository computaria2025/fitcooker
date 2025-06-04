from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
# Remova as importações de werkzeug.security e db, pois não vamos usar o banco agora
# from werkzeug.security import generate_password_hash, check_password_hash # Comentado/Removido
# from db import get_db_connection # Comentado/Removido

auth_bp = Blueprint('auth', __name__)

# Lista temporária para simular usuários cadastrados (apenas para teste)
mock_users_db = []

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha') # No teste, não vamos hashear nem salvar

    if not nome or not email or not senha:
        return jsonify({'msg': 'Nome, email e senha são obrigatórios'}), 400

    # Simula verificação se o email já existe
    if any(user['email'] == email for user in mock_users_db):
        return jsonify({'msg': 'Este email já está cadastrado'}), 409 # Conflict

    # Simula o cadastro
    new_user = {"id": len(mock_users_db) + 1, "nome": nome, "email": email, "senha_mock": senha}
    mock_users_db.append(new_user)
    print(f"Usuário mockado registrado: {new_user}")
    print(f"Base de usuários mockada: {mock_users_db}")

    return jsonify({'msg': 'Usuário registrado com sucesso (mock)!'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha_recebida = data.get('senha')

    if not email or not senha_recebida:
        return jsonify({'msg': 'Email e senha são obrigatórios'}), 400

    # Procura o usuário na lista mockada
    user_found = None
    for user in mock_users_db:
        if user['email'] == email:
            user_found = user
            break
    
    print(f"Tentativa de login para: {email}")
    print(f"Base de usuários mockada: {mock_users_db}")
    print(f"Usuário encontrado: {user_found}")


    # Simula a verificação de senha (comparação direta para o mock)
    if user_found and user_found['senha_mock'] == senha_recebida:
        # No backend real, você usaria o ID do usuário do banco
        # Para o mock, podemos usar o ID mockado ou o email
        access_token = create_access_token(identity=user_found['id']) # ou user_found['email']
        print(f"Login mock bem-sucedido para: {email}, token gerado.")
        return jsonify(token=access_token, user_info={"id": user_found['id'], "nome": user_found['nome'], "email": user_found['email']}), 200
    
    print(f"Falha no login mock para: {email}. Credenciais inválidas.")
    return jsonify({'msg': 'Credenciais inválidas (mock)'}), 401