from crewai import Task
from .paraphrasing_agent_tool import argument_paraphrasing_guardrail


class ParaphrasingTask(Task):
    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=f"Paraphrase the arguments provided by the user for the topic: '{topic_name}' with topic_id: {topic_id} "
                        f"after they have been validated by the Argument Validation Agent and add them to the database. "
                        f"Do not alter the value of the 'yes_or_no' key, only update the value for the 'argument' key.",
            expected_output="List of argument IDs.",
            agent=agent,
            guardrail=argument_paraphrasing_guardrail
        )