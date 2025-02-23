from validation_agent import ValidationAgent, ValidationTask
from paraphrasing_agent import ParaphrasingAgent, ParaphrasingTask
from categorization_agent import CategoryValidationAgent, CategoryValidationTask, CategoryMatchingAgent, CategoryMatchingTask
from db_manager import DbManager
from crewai import Crew
import json


class DataIngestionCrew:
    def __init__(self):
        self.validation_agent = ValidationAgent()
        self.paraphrasing_agent = ParaphrasingAgent()
        self.category_validation_agent = CategoryValidationAgent()
        self.category_matching_agent = CategoryMatchingAgent()
        self.db_manager = DbManager()

    def ingest_arguments(self, topic_id, arguments):
        topic = self.db_manager.get_topic_by_id(topic_id)
        validation_task = ValidationTask(topic['topic_id'], topic['topic_name'], self.validation_agent)
        paraphrasing_task = ParaphrasingTask(topic['topic_id'], topic['topic_name'], self.paraphrasing_agent)
        argument_ingest_crew = Crew(
            agents=[self.validation_agent, self.paraphrasing_agent],
            tasks=[validation_task, paraphrasing_task],
            verbose=True
        )
        result = argument_ingest_crew.kickoff(inputs={'arguments': json.dumps(arguments)})
        return result

    def ingest_argument_categories(self, topic_id, argument_categories):
        topic = self.db_manager.get_topic_by_id(topic_id)
        category_validation_task = CategoryValidationTask(topic['topic_id'], topic['topic_name'], self.category_validation_agent)
        category_matching_task = CategoryMatchingTask(topic['topic_id'], topic['topic_name'], self.category_matching_agent)
        category_ingest_crew = Crew(
            agents=[self.category_validation_agent, self.category_matching_agent],
            tasks=[category_validation_task, category_matching_task],
            verbose=True
        )
        result = category_ingest_crew.kickoff(inputs={'argument_categories': json.dumps(argument_categories)})
        return result

