from implication_question_generating_agent import ImplicationQuestionGeneratingAgent, ImplicationQuestionGeneratingTask
from crewai import Crew
from db_manager import DbManager
import json


class QuestionPreparationCrew:
    def __init__(self):
        self.implication_question_generating_agent = ImplicationQuestionGeneratingAgent()
        self.db_manager = DbManager()

    def prepare_questions(self, topic_id, arguments_list):
        topic_name = self.db_manager.get_topic_by_id(topic_id)
        implication_question_generating_task = ImplicationQuestionGeneratingTask(topic_id, topic_name['topic_name'],
                                                                                 self.implication_question_generating_agent)
        implication_question_generating_crew = Crew(
            agents=[self.implication_question_generating_agent],
            tasks=[implication_question_generating_task],
            verbose=False
        )
        result = implication_question_generating_crew.kickoff({'arguments_list': json.dumps(arguments_list)})
        return result
