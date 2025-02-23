from crewai import Task


class CategorizationTask(Task):

    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=(f"Validate the argument categories provided by the user for the topic: {topic_name} with topic_id: {topic_id}\n",
                         f"argument_categories: {{argument_categories}}\nand write them to the database.\n",
                         f"Then match the arguments provided by the user to the argument categories in the database and link each argument with its category in the database\n",
                         f"arguments: {{arguments}}"),
            expected_output="List of matched arguments and categories. It should be a list where each item is a dictionary of the form {argument_id, category_id}.",
            agent=agent
        )