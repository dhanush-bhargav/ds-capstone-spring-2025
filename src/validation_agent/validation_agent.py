from crewai import Agent, LLM
from config_reader import ConfigData
from .validation_agent_tools import get_arguments_for_agent


class ValidationAgent(Agent):
    def __init__(self):
        self.config_data = ConfigData('config.conf')
        super().__init__(
            name="Argument Validation Agent",
            role="Argument content validator",
            goal=("Given a central topic and a list of arguments, validate the content of the arguments to check for the following: "
                  "relevance to the central topic, presence of similar arguments in the database, and if the arguments are based on known facts. "
                  "Once you validate these arguments, prepare a list of arguments that have passed validation and write them to the database. "
                  "You have been provided with a tool to fetch arguments from the database."),
            llm=LLM(model=self.config_data.get_value('ValidationAgent', 'model_name'),
                    base_url=self.config_data.get_value('ValidationAgent', 'model_url')),
            backstory="You are an expert in validating arguments for relevance, duplication, and factual correctness using tools to read data from the database.",
            allow_delegation=False,
            verbose=True,
            tools=[get_arguments_for_agent]
        )