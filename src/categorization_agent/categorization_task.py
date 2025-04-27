from crewai import Task
from .categorization_agent_tools import category_argument_matching_guardrail, category_validation_guardrail

class CategoryValidationTask(Task):

    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=f"Validate the new argument categories provided by the user for the topic: {topic_name} with topic_id: {topic_id}\n"
                        f"argument_categories: {{argument_categories}}\nand write them to the database only if they are not already present.\n"
                        f"If the provided list of new argument_categories is empty, or no arguments need to be added, pass the topic_id as your answer.",
            expected_output="List of argument categories. It should be a list where each item is a dictionary of the form {category_id, argument_category}.\n"
                            f"If no new arguments are being added to the database, the output should be a dictionary of the form {{topic_id}}.",
            agent=agent,
            guardrail=category_validation_guardrail
        )


class CategoryMatchingTask(Task):

    def __init__(self, topic_id, topic_name, agent):
        super().__init__(
            description=(f"Fetch unlinked arguments from the database for the topic: {topic_name} with topic_id: {topic_id} "
                         f"and match each argument with the most appropriate category. Once done, return the pairs of argument and category ids."),
            expected_output="List of matched arguments and categories. It should be a list where each item is a dictionary of the form {argument_id, category_id}.",
            agent=agent,
            guardrail=category_argument_matching_guardrail
        )