from patched_llm import PatchedBedrockLLM
from crewai import Agent
from config_reader import ConfigData


class ImplicationQuestionGeneratingAgent(Agent):
    def __init__(self):
        config_data = ConfigData('config.conf')
        super().__init__(
            name="Implication Question Generation Agent",
            role="Implication Question Generator",
            goal="You will be given a central topic which is in the form of a policy change or action and a list of "
                 "arguments in favor of and against the central topic. "
                 "For each argument, you need to generate two questions:\n"
                 "The first question should ask what the argument's overall impact on society would be. "
                 "Call this 'IMPACT_QUESTION'.\n"
                 "The second question should ask how the central topic impacts the likelihood of the argument as an "
                 "outcome. Call this 'LIKELIHOOD_QUESTION'.",
            llm=PatchedBedrockLLM(model=config_data.get_value('LLMConfig', 'model_name'), temperature=0.2),
            backstory="You are an expert in framing questions given an argument and a central topic.",
            allow_delegation=False,
            verbose=False
        )
