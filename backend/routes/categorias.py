from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from db import get_db_connection

categorias_bp = Blueprint('categorias', __name__)

@categorias_bp.route('/categorias', methods=['GET'])
def listar_categorias():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categorias")
    categorias = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(categorias)

@categorias_bp.route('/categorias', methods=['POST'])
@jwt_required()
def criar_categoria():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO categorias (nome) VALUES (%s)", (data['nome'],))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'msg': 'Categoria criada'}), 201
