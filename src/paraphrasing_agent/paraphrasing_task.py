from crewai import Task


class ParaphrasingTask(Task):
    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=f"Paraphrase the arguments provided by the user for the topic: '{topic_name}' with topic_id: {topic_id} "
                        f"after they have been validated by the Argument Validation Agent and add them to the database.",
            expected_output="List of argument IDs.",
            agent=agent
        )