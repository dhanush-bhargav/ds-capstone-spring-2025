from crewai import Task


class ValidationTask(Task):
    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=(f"Validate the given arguments provided by the user for the topic: '{topic_name}' with topic_id: {topic_id}. \n",
                         f"arguments: {{arguments}}"),
            expected_output="List of arguments that passed the validation. It should be a list where each item is a dictionary of the form {yes_or_no, argument}. "
                            "The content of the items should not be altered and neither should new items be added. "
                            "Only the arguments which did not pass validation should be removed from the input list of arguments.",
            agent=agent
        )
