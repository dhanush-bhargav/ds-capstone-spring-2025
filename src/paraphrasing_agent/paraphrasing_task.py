from crewai import Task


class ParaphrasingTask(Task):
    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=f"Paraphrase the arguments provided by the user for the topic: '{topic_name}' with topic_id: {topic_id} "
                        f"after they have been validated by the Argument Validation Agent and add them to the database.",
            expected_output="List of paraphrased arguments. It should be a list where each item is a dictionary of the form {yes_or_no, argument}. "
                            "Do not create or delete any items in the list of arguments provided to you. You only need to paraphrase the argument in each item.",
            agent=agent
        )