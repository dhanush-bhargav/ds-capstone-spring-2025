from main_crew import MainCrew
from chat_agent import ChatAgent
from config_reader import ConfigData

class CrewManager:
    def __init__(self):
        self.chat_agent = None
        self.crew = None
        self.config_data = ConfigData("config.conf")

    def first_setup(self, request):
        self.chat_agent = ChatAgent(self.config_data.get_value("ChatBot", "model_name"), self.config_data.get_value("ChatBot", "model_url"),
                                    request.json['central_question'], request.json['stance'])
        self.crew = MainCrew(self.chat_agent)

    def generate_response(self, request):
        return