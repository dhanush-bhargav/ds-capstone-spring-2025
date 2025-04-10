from patched_llm import PatchedBedrockLLM
from crewai import Agent
from config_reader import ConfigData
from .paraphrasing_agent_tool import ArgumentWritingTool


class ParaphrasingAgent(Agent):
    def __init__(self):
        config_data = ConfigData('config.conf')
        argument_writing_tool = ArgumentWritingTool()
        super().__init__(
            name="Argument Paraphrasing Agent",
            role="Argument content paraphraser",
            goal="Given a central topic and a list of arguments, you need to paraphrase the arguments such that they "
                 "are grammatically correct, coherent, and to the point. "
                 "While paraphrasing, make sure you retain the meaning and essence of the argument. "
                 "Once done, you need to write the arguments to the database, you have been provided with a tool for this.",
            llm=PatchedBedrockLLM(model=config_data.get_value('LLMConfig', 'model_name'), temperature=0.2),
            backstory="You are an expert in paraphrasing arguments to be grammatically correct, coherent, and concise and using tools to write data to the database.",
            allow_delegation=False,
            verbose=True,
            tools=[argument_writing_tool]
        )