from flask import Flask, request
from main import App
from db_manager import DbManager
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
application = App()
db_manager = DbManager()

@app.route('/get_topics', methods=['GET'])
def get_topics():
    return db_manager.get_topics()

@app.route("/login", methods=['POST'])
def login():
    return db_manager.login(request.json['user_id'], request.json['password'])

@app.route("/create_conversation", methods=['POST'])
def create_conversation():
    result = application.initialize_conversation(request.json)
    return result

@app.route("/get_user_instructions", methods=['GET'])
def get_user_instructions():
    return {"instructions": db_manager.get_instructions_by_intended_for("user")}

@app.route("/read_user_arguments", methods=['POST'])
def read_user_arguments():
    return application.read_user_arguments(request.json)

@app.route("/read_user_argument_categories", methods=['POST'])
def read_user_argument_categories():
    return application.read_user_argument_categories(request.json)

@app.route("/get_arguments", methods=['GET'])
def get_arguments():
    return application.get_arguments(request.args)

@app.route("/get_argument_categories", methods=['GET'])
def get_arguments_categories():
    return application.get_argument_categories(request.args)

@app.route("/get_arguments_by_category", methods=['GET'])
def get_arguments_by_category():
    return application.get_arguments_by_category(request.args)

@app.route("/read_implications", methods=['POST'])
def read_implications():
    return application.read_implications(request.json)

@app.route("/add_user", methods=['POST'])
def add_user():
    return application.add_user(request.json)

if __name__ == '__main__':
    app.run(debug=True)