from config_reader import ConfigData
from db_manager import DbManager
from crews import DataIngestionCrew, QuestionPreparationCrew
import random
import json


class App:
    def __init__(self):
        self.chat_agent = None
        self.crew = None
        self.config_data = ConfigData("config.conf")
        self.db_manager = DbManager()
        self.data_ingestion_crew = DataIngestionCrew()
        self.question_preparation_crew = QuestionPreparationCrew()

    def initialize_conversation(self, request_data):
        try:
           conversation_id = self.db_manager.create_new_conversation(request_data['topic_id'], request_data['user_id'])
           stance_id = self.db_manager.create_stance(conversation_id, request_data['stance'], request_data['stance_rating'], request_data['collected_at'])
           intellectual_humility_assessment_data = []
           for item in request_data['intellectual_humility_responses']:
               intellectual_humility_assessment_data.append((item['assessment_question_id'], conversation_id, item['answer'], request_data['collected_at']))
           self.db_manager.insert_assessment_responses(intellectual_humility_assessment_data)
           social_desirability_assessment_data = []
           for item in request_data['social_desirability_responses']:
               social_desirability_assessment_data.append((item['assessment_question_id'], conversation_id, item['answer'], request_data['collected_at']))
           self.db_manager.insert_assessment_responses(social_desirability_assessment_data)
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
            argument_categories = self.get_argument_categories(request_data)
            result = {
                "success": True,
                "link_ids": crew_result.raw,
                "category_ids": [cat["category_id"] for cat in argument_categories["argument_categories"]],
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
            implications_data.append((request_data['conversation_id'], item['implication_question_id'], item['implication']))
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

    def get_assessment_questions(self, request_data):
        try:
            result = self.db_manager.get_assessment_questions(request_data['assessment_type'])
            if result:
                return {
                    "assessment_questions": result,
                    "success": True
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

    def record_post_intervention_assessments(self, request_data):
        try:
            stance_id = self.db_manager.create_stance(request_data["conversation_id"], request_data['stance'],
                                                      request_data['stance_rating'], request_data['collected_at'])
            intellectual_humility_assessment_data = []
            for item in request_data['intellectual_humility_responses']:
                intellectual_humility_assessment_data.append(
                    (item['assessment_question_id'], request_data["conversation_id"], item['answer'], request_data['collected_at']))
            self.db_manager.insert_assessment_responses(intellectual_humility_assessment_data)
            return {
                "success": True,
                "stance_id": stance_id,
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }

    def get_arguments_for_categorization(self, request_data):
        try:
            categories_data = self.db_manager.get_argument_categories(request_data['topic_id'])
            result = []
            for category in categories_data:
                arguments = self.db_manager.get_arguments_by_category_id(request_data['topic_id'], category['category_id'])
                result.append(
                    {
                        "category_id": category['category_id'],
                        "argument_category": category['argument_category'],
                        "arguments": arguments,
                    }
                )
            unlinked_arguments = self.db_manager.get_unlinked_arguments(request_data['topic_id'])
            result.append(
                {
                    "category_id": 0,
                    "argument_category": "Uncategorized",
                    "arguments": unlinked_arguments,
                }
            )
            return {
                "success": True,
                "arguments_by_category": result
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }

    def write_implication_questions(self, category_id, implication_questions_data):
        write_data = []
        for arg in implication_questions_data:
            for implication_question in arg['implication_questions']:
                write_data.append((category_id, arg['argument_id'], implication_question['implication_type'], implication_question['implication_question']))
        self.db_manager.insert_implication_questions(write_data)


    def get_implication_questions(self, request_data):
        try:
            implication_questions_data = []
            for category_id in request_data['category_ids']:
                arguments_without_implication_questions = self.db_manager.get_arguments_without_implication_questions(category_id)
                if len(arguments_without_implication_questions) > 0:
                    question_preparation_result = self.question_preparation_crew.prepare_questions(request_data['topic_id'],
                                                                                                   arguments_without_implication_questions)
                    self.write_implication_questions(category_id, json.loads(question_preparation_result.raw))
                implication_questions = self.db_manager.get_implication_questions(category_id)
                implication_questions_data.append({
                    "category_id": category_id,
                    "implication_questions": implication_questions
                })
            return {
                "success": True,
                "implication_questions_data": implication_questions_data
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }