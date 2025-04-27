from crewai import Task
from .implication_question_generating_tools import implication_question_generation_guardrail

class ImplicationQuestionGeneratingTask(Task):
    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=f"Consider the list of arguments given below for the topic: {topic_name} with topic_id: {topic_id}\n"
                        f"arguments: {{arguments_list}}\nand generate questions to present to the user.",
            expected_output="A list of arguments with the generated questions. It should be a list where each item is a dictionary "
                            "of the form: {argument_id, argument, implication_questions} where implication_questions is of the form: "
                            "[{implication_type: 'IMPACT_QUESTION', implication_question}, "
                            "{implication_type: 'LIKELIHOOD_QUESTION', implication_question}].",
            agent=agent,
            guardrail=implication_question_generation_guardrail
        )
