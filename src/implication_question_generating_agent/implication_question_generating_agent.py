from crewai import Agent, LLM
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
                 "The first question should ask what the argument's impact on society would be and answerable as a "
                 "choice of: positive, negative, or neutral. Call this 'IMPACT_QUESTION'.\n"
                 "The second question should ask how the central topic impacts the likelihood of the argument as an "
                 "outcome and would be answerable as a choice of: more likely, less likely, or no impact. "
                 "Call this 'LIKELIHOOD_QUESTION'.",
            llm=LLM(model=config_data.get_value('ImplicationQuestionGeneratingAgent', 'model_name'),
                    base_url=config_data.get_value('ImplicationQuestionGeneratingAgent', 'model_url')),
            backstory="You are an expert in framing questions given an argument and a central topic.",
            allow_delegation=False,
            verbose=True
        )
