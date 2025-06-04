from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db_connection

avaliacoes_bp = Blueprint('avaliacoes', __name__)

@avaliacoes_bp.route('/receitas/<int:receita_id>/avaliacoes', methods=['POST'])
@jwt_required()
def avaliar_receita(receita_id):
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO avaliacoes (receita_id, usuario_id, nota, comentario) VALUES (%s, %s, %s, %s)", (
        receita_id, get_jwt_identity(), data['nota'], data.get('comentario')
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'msg': 'Avaliação registrada'}), 201
