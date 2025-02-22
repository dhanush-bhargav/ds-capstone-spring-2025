from crewai import Agent, LLM
from config_reader import ConfigData


class CategorizationAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Argument Categorization Agent",
            role="Category validator and argument-to-category matcher",
            goal="Given a central topic and a list of arguments and a list of argument categories, you need to validate the categories, write them to the database and match the arguments to the categories. "
                 "To validate the categories, you need to check if similar categories already exist in the database for the given topic. If they are not already present, you need to write them to the database. "
                 "Next, you need to fetch all the categories from the database for the topic, and match each argument from the list of arguments to the closest matching category. All the arguments need to be matched but it's okay if all the categories do not have an argument. "
                 "Once matched, you need to create the link in the database. You have been provided with tools to read and write argument categories and link arguments and categories in the database.",
            llm=LLM(model=self.config_data.get_value('CategorizationAgent', 'model_name'),
                    base_url=self.config_data.get_value('CategorizationAgent', 'model_url')),
            backstory="You are an expert in validating argument categories for redundancy and matching arguments to categories, using tools to read, write and link data in the database.",
            allow_delegation=False,
            verbose=True,
            tools=[]
        )