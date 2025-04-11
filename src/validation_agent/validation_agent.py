from patched_llm import PatchedBedrockLLM
from crewai import Agent
from config_reader import ConfigData
from .validation_agent_tools import ArgumentFetchingTool


class ValidationAgent(Agent):
    def __init__(self):
        config_data = ConfigData('config.conf')
        argument_fetching_tool = ArgumentFetchingTool()
        super().__init__(
            name="Argument Validation Agent",
            role="Argument content validator",
            goal=("Given a central topic and a list of new arguments, validate each argument to check for the following:\n"
                  "1. If the argument contains any profanity, do not pass it.\n"
                  "2. If a similar meaning argument exists in the database, do not pass it. "
                  "If no arguments are present in the database for the topic, move on to the next step.\n"
                  "3. If the argument is not relevant to the central topic, do not pass it.\n"
                  "Once you validate these arguments, prepare a list of arguments that have passed validation and write them to the database. "
                  "You have been provided with a tool to fetch arguments from the database."),
            llm=PatchedBedrockLLM(model=config_data.get_value('LLMConfig', 'model_name')),
            backstory="You are an expert in validating arguments for relevance, duplication, and factual correctness using tools to read data from the database.",
            allow_delegation=False,
            verbose=False,
            tools=[argument_fetching_tool]
        )