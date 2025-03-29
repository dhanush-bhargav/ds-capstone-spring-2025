from config_reader import ConfigData
from db_manager import DbManager
from crews import DataIngestionCrew
import random


class App:
    def __init__(self):
        self.chat_agent = None
        self.crew = None
        self.config_data = ConfigData("config.conf")
        self.db_manager = DbManager()
        self.data_ingestion_crew = DataIngestionCrew()

    def initialize_conversation(self, request_data):
        try:
           conversation_id = self.db_manager.create_new_conversation(request_data['topic_id'], request_data['user_id'])
           stance_id = self.db_manager.create_stance(conversation_id, request_data['stance'], request_data['stance_rating'], request_data['collected_at'])
           result = {
               "success": True,
               "conversation_id": conversation_id,
           }
        except Exception as e:
            result = {
                "success": False,
                "error": str(e),
            }
        return result

    def read_user_arguments(self, request_data):
        try:
            crew_result = self.data_ingestion_crew.ingest_arguments(request_data['topic_id'], request_data['arguments'])
            result = {
                "success": True,
                "argument_ids": crew_result.raw,
            }
        except Exception as e:
            result = {
                "success": False,
                "error": str(e),
            }

        return result

    def read_user_argument_categories(self, request_data):
        try:
            crew_result = self.data_ingestion_crew.ingest_argument_categories(request_data['topic_id'], request_data['argument_categories'])
            result = {
                "success": True,
                "argument_ids": crew_result.raw,
            }
        except Exception as e:
            result = {
                "success": False,
                "error": str(e),
            }
        return result

    def get_arguments(self, request_data):
        try:
            result = self.db_manager.get_arguments(request_data['topic_id'])
            if result:
                return {
                    "success": True,
                    "arguments": result,
                }
            else:
                return {
                    "success": False,
                    "error": str(result),
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }

    def get_argument_categories(self, request_data):
        try:
            result = self.db_manager.get_argument_categories(request_data['topic_id'])
            if result:
                return {
                    "success": True,
                    "argument_categories": result,
                }
            else:
                return {
                    "success": False,
                    "error": str(result),
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }

    def get_arguments_by_category(self, request_data):
        try:
            result = self.db_manager.get_arguments_by_category_id(request_data['topic_id'], request_data['category_id'])
            if result:
                return {
                    "success": True,
                    "arguments_by_category": result,
                }
            else:
                return {
                    "success": False,
                    "error": str(result),
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }

    def read_implications(self, request_data):
        implications_data = []
        for item in request_data['implications']:
            implications_data.append((request_data['conversation_id'], item['category_id'], item['argument_id'], item['implication']))

        try:
            implication_id = self.db_manager.create_implication(implications_data)
            result = {
                "success": True,
                "implication_id": implication_id,
            }
        except Exception as e:
            result = {
                "success": False,
                "error": str(e),
            }
        return result

    def add_user(self, request_data):
        user_data = (request_data['user_id'], request_data['user_name'], request_data['password'])
        try:
            user_data = self.db_manager.add_user(user_data)
            return {
                "success": True,
                "user_id": user_data[0]
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }
