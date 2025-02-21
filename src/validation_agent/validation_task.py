from crewai import Task


class ValidationTask(Task):
    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=(f"Validate the given arguments provided by the user for the topic: '{topic_name}' with topic_id: {topic_id}. \n",
                         f"arguments: {{arguments}}"),
            expected_output="List of arguments that passed the validation.",
            agent=agent
        )
