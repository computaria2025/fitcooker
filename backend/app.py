from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes.auth import auth_bp
from routes.receitas import receitas_bp
from routes.ing_etapas import ing_etapas_bp
from routes.avaliacoes import avaliacoes_bp
from routes.categorias import categorias_bp
from config.config import load_env

app = Flask(__name__)
CORS(app)
load_env(app)

jwt = JWTManager(app)

# Rotas
app.register_blueprint(auth_bp)
app.register_blueprint(receitas_bp)
app.register_blueprint(ing_etapas_bp)
app.register_blueprint(avaliacoes_bp)
app.register_blueprint(categorias_bp)

if __name__ == '__main__':
    app.run(debug=True)