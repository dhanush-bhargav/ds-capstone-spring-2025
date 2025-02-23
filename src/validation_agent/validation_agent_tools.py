from crewai.tools import tool
from src.db_manager import DbManager


@tool("Argument fetching tool")
def get_arguments_for_agent(topic_id: int, topic:str):
    """
    This tool is used to get all the arguments present in the database for a given topic.
    :param topic_id: int, id of the topic for which to find arguments
    :param topic: str, topic for which to find arguments
    :return: List(Dict), list of arguments found in the database for the given topic, each list item is a dictionary of the form {argument_id: int, yes_or_no: str, argument: str}
    """
    db_manager = DbManager()
    arguments_data = db_manager.get_arguments(topic_id)
    return arguments_data

