from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db_connection

receitas_bp = Blueprint('receitas', __name__)

@receitas_bp.route('/receitas', methods=['GET'])
@jwt_required()
def listar_receitas():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM receitas")
    receitas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(receitas)

@receitas_bp.route('/receitas', methods=['POST'])
@jwt_required()
def adicionar_receita():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO receitas (titulo, descricao, categoria_id, usuario_id) VALUES (%s, %s, %s, %s)", (
        data['titulo'], data['descricao'], data['categoria_id'], get_jwt_identity()
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'msg': 'Receita adicionada com sucesso'}), 201
