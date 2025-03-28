from crewai import Task
from .validation_agent_tools import validation_agent_guardrail


class ValidationTask(Task):
    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=f"Validate the given arguments provided by the user for the topic: '{topic_name}' with topic_id: {topic_id}. \n"
                        f"new arguments: {{arguments}}",
            expected_output="List of arguments that passed the validation. It should be a list where each item is a dictionary of the form {yes_or_no, argument}. "
                            "The content of the items should not be altered and neither should new items be added.",
            agent=agent,
            guardrail=validation_agent_guardrail
        )

