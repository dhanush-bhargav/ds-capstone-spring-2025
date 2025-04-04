from crewai import Agent, LLM
from config_reader import ConfigData
from .categorization_agent_tools import (CategoryReadingTool, CategoryWritingTool,
                                         UnlinkedArgumentReadingTool)

class CategoryValidationAgent(Agent):
    def __init__(self):
        config_data = ConfigData('config.conf')
        category_reading_tool = CategoryReadingTool()
        category_writing_tool = CategoryWritingTool()
        super().__init__(
            name="Argument Category Validation Agent",
            role="Argument Category Validator",
            goal="Given a central topic and a list of argument categories, you need to validate the categories, and write them to the database. "
                 "To validate the categories, you need to check if similar categories already exist in the database for the given topic. "
                 "If they are not already present, you need to write them to the database."
                 "If you determine that none of the new categories need to be written to the database, pass the topic_id as your answer.",
            llm=LLM(model=config_data.get_value('CategoryValidationAgent', 'model_name'),
                    base_url=config_data.get_value('CategoryValidationAgent', 'model_url')),
            backstory="You are an expert in validating argument categories for redundancy using tools to read and write data in the database.",
            allow_delegation=False,
            verbose=True,
            tools=[category_reading_tool, category_writing_tool]
        )


class CategoryMatchingAgent(Agent):
    def __init__(self):
        config_data = ConfigData('config.conf')
        unlinked_argument_reading_tool = UnlinkedArgumentReadingTool()
        super().__init__(
            name="Argument Category Matching Agent",
            role="Argument to Category Matcher",
            goal="Given a central topic and a list of argument categories, you need to match arguments to the most appropriate argument category in the database. "
                 "First, you need to fetch arguments not linked to any category from the database. You have been provided with a tool to read unlinked arguments. "
                 "If there are no unlinked arguments in the database, end the task."
                 "Then, match each argument with the most appropriate category. Each argument needs to be matched to exactly one category. "
                 "It's okay if some categories don't have any arguments, but don't leave any argument unmatched. "
                 "Once matched, you need to return the pairs of argument and category ids.",
            llm=LLM(model=config_data.get_value('CategoryMatchingAgent', 'model_name'),
                    base_url=config_data.get_value('CategoryMatchingAgent', 'model_url')),
            backstory="You are an expert in matching arguments to argument categories for a given topic, using tools to read and write data in the database.",
            allow_delegation=False,
            verbose=True,
            tools=[unlinked_argument_reading_tool]
        )