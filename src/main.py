from main_crew import MainCrew
from chat_agent import ChatAgent
from config_reader import ConfigData

class CrewManager:
    def __init__(self):
        self.chat_agent = None
        self.crew = None
        self.config_data = ConfigData("config.conf")
        self.user_id = ""

    def first_setup(self, request):
        self.user_id = request.json['user_id']
        self.chat_agent = ChatAgent(self.config_data.get_value("ChatBot", "model_name"), self.config_data.get_value("ChatBot", "model_url"),
                                    request.json['central_question'], request.json['stance'])
        self.crew = MainCrew(self.chat_agent)
        output = self.crew.run("",self.user_id)
        print(output.raw)
        return output

    def generate_response(self, request):
        crew_output = self.crew.run(request.json['message'], self.user_id)
        print(crew_output.raw)
        return crew_output