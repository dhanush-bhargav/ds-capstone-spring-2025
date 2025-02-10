from flask import Flask, request
from main import CrewManager
app = Flask(__name__)
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
    return result


if __name__ == '__main__':
    app.run(debug=True)