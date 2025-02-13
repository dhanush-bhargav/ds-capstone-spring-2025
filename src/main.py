from main_crew import MainCrew
from chat_agent import ChatAgent
from config_reader import ConfigData
import sqlite3

class CrewManager:
    def __init__(self):
        self.chat_agent = None
        self.crew = None
        self.config_data = ConfigData("config.conf")

    def first_setup(self, request):
        self.chat_agent = ChatAgent(self.config_data.get_value("ChatBot", "model_name"), self.config_data.get_value("ChatBot", "model_url"),
                                    request.json['central_question'], request.json['stance'])
        self.crew = MainCrew(self.chat_agent, request.json['user_id'], request.json['topic_id'])
        conversation_id = self.crew.get_conversation_id()
        output = self.crew.run("", request.json['user_id'])
        result = {
            "conversation_id": conversation_id,
            "message": output.raw
        }
        return result

    def generate_response(self, request):
        crew_output = self.crew.run(request.json['message'], request.json['conversation_id'])
        return {
            'conversation_id': request.json['conversation_id'],
            'message': crew_output.raw
        }

    def get_topics(self):
        topics_data = []
        group_ids = []

        connection = sqlite3.connect(self.config_data.get_value('Memory', 'db_path'))
        cursor = connection.cursor()
        result = cursor.execute(""" SELECT tg.group_id, tg.group_name, mt.topic_id, mt.topic_description 
                            FROM topic_groups tg 
                            INNER JOIN main.master_topics mt on tg.group_id = mt.group_id 
                            ORDER BY tg.group_id """)

        for row in result:
            group_id, group_name, topic_id, topic_description = row
            if group_id not in group_ids:
                topics_data.append({
                    "id": group_id,
                    "name": group_name,
                    "preMadeQuestions": [{"id": topic_id, "topic": topic_description}],
                })
                group_ids.append(group_id)
            else:
                for i in range(len(topics_data)):
                    if topics_data[i]['id'] == group_id:
                        topics_data[i]['preMadeQuestions'].append({"id": topic_id, "topic": topic_description})
                        break

        connection.close()
        return topics_data

    def login(self, request):
        connection = sqlite3.connect(self.config_data.get_value('Memory', 'db_path'))
        cursor = connection.cursor()
        result = cursor.execute(f" SELECT user_id, user_name, password FROM users WHERE user_id = '{request.json['user_id']}' ").fetchone()
        if result:
            if result[2] == request.json['password']:
                return {
                    "success": True,
                    "message": "Login Successful"
                }
            else:
                return {
                    "success": False,
                    "message": "Authentication Failed"
                }
        else:
            return {
                "success": False,
                "message": "User Not Found"
            }
