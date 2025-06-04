from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from db import get_db_connection

ing_etapas_bp = Blueprint('ingredientes_etapas', __name__)

@ing_etapas_bp.route('/receitas/<int:receita_id>/ingredientes', methods=['POST'])
@jwt_required()
def adicionar_ingrediente(receita_id):
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO ingredientes (receita_id, nome, quantidade) VALUES (%s, %s, %s)", (
        receita_id, data['nome'], data['quantidade']
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'msg': 'Ingrediente adicionado'}), 201

@ing_etapas_bp.route('/receitas/<int:receita_id>/etapas', methods=['POST'])
@jwt_required()
def adicionar_etapa(receita_id):
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO etapas (receita_id, descricao, ordem) VALUES (%s, %s, %s)", (
        receita_id, data['descricao'], data['ordem']
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'msg': 'Etapa adicionada'}), 201
