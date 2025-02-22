from crewai import Agent, LLM
from src.config_reader import ConfigData
from .paraphrasing_agent_tool import write_arguments_for_agent


class ParaphrasingAgent(Agent):
    def __init__(self):
        self.config_data = ConfigData('config.conf')
        super().__init__(
            name="Argument Paraphrasing Agent",
            role="Argument content paraphraser",
            goal="Given a central topic and a list of arguments, you need to paraphrase the arguments such that they are grammatically correct, coherent, and to the point."
                 "You also need to make the argument concise such that it is only a sentence long, but without altering the meaning of the argument itself."
                 "Once done, you need to write the arguments to the database, you have been provided with a tool for this.",
            llm=LLM(model=self.config_data.get_value('ParaphrasingAgent', 'model_name'),
                    base_url=self.config_data.get_value('ParaphrasingAgent', 'model_url')),
            backstory="You are an expert in paraphrasing arguments to be grammatically correct, coherent, and concise and using tools to write data to the database.",
            allow_delegation=False,
            verbose=True,
            tools=[write_arguments_for_agent]
        )