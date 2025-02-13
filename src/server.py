from flask import Flask, request
from main import CrewManager
import sqlite3
from config_reader import ConfigData

app = Flask(__name__)
crewManager = CrewManager()

@app.route('/get_topics', methods=['GET'])
def get_topics():
    return crewManager.get_topics()


@app.route("/login", methods=['POST'])
def login():
    return crewManager.login(request)

@app.route('/initialize', methods=['POST'])
def initialize():
    result = crewManager.first_setup(request)
    return result


@app.route('/chat', methods=['POST'])
def chat():
    result = crewManager.generate_response(request)
    return result


if __name__ == '__main__':
    app.run(debug=True)