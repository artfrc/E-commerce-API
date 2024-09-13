### --- Importaçẽs --- ###

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user,  current_user

# ------------------------------------------------------------------------------------------------------------------------------

### --- Configurando a aplicação Flask e o banco de dados da aplicação --- ###

app = Flask(__name__)
app.config['SECRET_KEY'] = "my_key_123"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'

# ------------------------------------------------------------------------------------------------------------------------------

# --- Configurando diferentes partes da sua aplicação Flask para gerenciar a autenticação de usuários, o banco de dados, e permitir requisições de diferentes origens (CORS). 

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
db = SQLAlchemy(app)
CORS(app)

# ------------------------------------------------------------------------------------------------------------------------------


### --- Criação das tabelas no banco de dados ###

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=True, unique=True)
    password = db.Column(db.String(80), nullable=True)
    cart = db.relationship('cartItem', backref='user', lazy=True) #backref cria uma referência de relacionamento bidirecional, pode acessar os dados a partir de ambos os lados dessa relação. 
    # O parâmetro lazy define como os dados relacionados são carregados do banco de dados. lazy=True ou lazy='select': Os dados relacionados só serão carregados sob demanda.

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=True)

class cartItem(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
        product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False) 

# ----------------------------------------------------------------------------------------------------------------------------- 


# Pega o user_id (que é um valor armazenado na sessão do usuário autenticado) e usa o SQLAlchemy para consultar o banco de dados e retornar o objeto User correspondente. Isso permite que o Flask-Login reconheça quem é o usuário autenticado durante as requisições.

@login_manager.user_loader # diz ao Flask-Login que a função será usada para carregar um usuário a partir de um ID fornecido.
def load_user(user_id):
    return User.query.get(int(user_id))


### --- rotas de login e logout --- ###

@app.route('/login', methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(username =data.get("username")).first()
    
    if user and data.get("password") == user.password:
        login_user(user)
        return  jsonify({'message': "Login feito com sucesso"})
        
    return  jsonify({'message': "Informações inválidas"}), 401

@app.route('/logout', methods= ["POST"])
@login_required
def logout():
    logout_user()
    return  jsonify({'message': "Logout feito com sucesso"})

# -----------------------------------------------------------------------------------------------------------------------------

### --- Rotas produtos --- ###

@app.route('/api/products/add', methods=["POST"])
@login_required
def add_product():
    data = request.json
    if 'name' in data and 'price' in data:
        product = Product(name=data["name"], price=data["price"], description=data.get("description", ""))
        db.session.add(product)
        db.session.commit()
        return  jsonify({'message': "Produto cadastrado com sucesso!"})
    
    return  jsonify({'message': "Dados do produto inválidos"}), 400


@app.route('/api/delete/<int:product_id>', methods=["DELETE"])
@login_required
def delete_product(product_id):
    product = Product.query.get(product_id)
    if product:
        db.session.delete(product)
        db.session.commit()
        return  jsonify({'message': "Produto deletado com sucesso!"})
    
    return  jsonify({'message': "Produto não encontrado"}), 404

@app.route('/api/products/<int:product_id>', methods=["GET"])
def get_product_details(product_id):
    product = Product.query.get(product_id)
    if product:
        return  jsonify({
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "description": product.description
        })
    
    return  jsonify({'message': "Produto não encontrado"}), 404

@app.route('/api/update/<int:product_id>', methods=["PUT"])
@login_required
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return  jsonify({'message': "Produto não encontrado"}), 404

    data = request.json
    if 'name' in data:
        product.name = data["name"]

    if 'price' in data:
        product.price = data["price"]

    if 'description' in data:
        product.description = data["description"]

    db.session.commit()
    return  jsonify({'message': "Produto atualizado com sucesso!"})
    
@app.route('/api/products', methods=["GET"])
def get_products():
    products = Product.query.all()
    if len(products) == 0:
        return  jsonify({'message': "Lista de produtos vazia"})
    
    product_list = []
    for product in products:
        product_data = {
            "id": product.id,
            "name": product.name,
            "price": product.price,
        }
        product_list.append(product_data)

    return jsonify(product_list)

# ------------------------------------------------------------------------------------------------------------------------------

### --- Rotas do carrinho --- ###

@app.route('/api/cart/add/<int:product_id>', methods=["POST"])
@login_required
def add_to_cart(product_id):
    user = User.query.get(int(current_user.id))
    product = Product.query.get(product_id)

    if user and product:
        cart_item = cartItem(user_id = user.id, product_id = product.id)
        db.session.add(cart_item)
        db.session.commit()
        return jsonify({'message': "Item adicionado ao carrinho com sucesso"})
    
    return jsonify({'message': "Falha ao adicionar item ao carrinho com sucesso"}), 400


@app.route('/api/cart/remove/<int:product_id>', methods= ["DELETE"])
@login_required
def delete_from_cart(product_id):
    cart_item = cartItem.query.filter_by(user_id = current_user.id, product_id = product_id).first()
    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({'message': "Item removido do carrinho com sucesso"})
    
    return jsonify({'message': "Falha ao remover item do carrinho"}), 400

@app.route('/api/cart', methods= ["GET"])
@login_required
def view_cart():
    user = User.query.get(int(current_user.id))
    cart_itens = user.cart
    cart_content = []
    for item in cart_itens:
        product = Product.query.get(int(item.product_id))
        cart_content.append({
            "id": item.id,
            "product_id": item.product_id,
            "product_name": product.name,
            "product_price": product.price
        })
    
    return jsonify(cart_content)

@app.route('/api/cart/checkout', methods=["POST"])
@login_required
def checkout():
    user = User.query.get(int(current_user.id))
    cart_itens = user.cart
    for item in cart_itens:
        db.session.delete(item)
       
    db.session.commit()
    return jsonify({'message': "Checkout feito com sucesso. Carrinho foi limpo"})

# ------------------------------------------------------------------------------------------------------------------------------

### --- Rota para página inicial --- ###
@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == "__main__":
    app.run(debug=True)