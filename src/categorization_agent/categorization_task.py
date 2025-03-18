from crewai import Task
from .categorization_agent_tools import category_argument_matching_guardrail

class CategoryValidationTask(Task):

    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=f"Validate the new argument categories provided by the user for the topic: {topic_name} with topic_id: {topic_id}\n"
                        f"argument_categories: {{argument_categories}}\nand write them to the database only if they are not already present.\n",
            expected_output="List of matched arguments and categories. It should be a list where each item is a dictionary of the form {argument_id, category_id}.",
            agent=agent
        )


class CategoryMatchingTask(Task):

    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=(f"Fetch argument categories and unlinked arguments from the database for the topic: {topic_name} with topic_id: {topic_id} "
                         f"and match each argument with the most appropriate category. Once done, link them in the database."),
            expected_output="List of matched arguments and categories. It should be a list where each item is a dictionary of the form {argument_id, category_id}.",
            agent=agent,
            guardrail=category_argument_matching_guardrail
        )