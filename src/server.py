from flask import Flask, request
from main import CrewManager
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
crewManager = CrewManager()

@app.route('/initialize', methods=['POST'])
def initialize():
    print(request.json)
    result = crewManager.first_setup(request)
    return result.raw


@app.route('/chat', methods=['POST'])
def chat():
    print(request.json)
    result = crewManager.generate_response(request)
    return result.raw


if __name__ == '__main__':
    app.run(debug=True)