from crewai.tools import tool
from db_manager import DbManager

@tool("Argument writing tool")
def write_arguments_for_agent(topic_id, arguments_data):
    """
    This tool is used to write new arguments into the database for a given topic.
    :param topic_id: int, id of the topic for which to write the new arguments
    :param arguments_data: List(Dict), list of arguments to be written into the database, each list item is a dictionary of the form {yes_or_no: str, argument: str}
    :return:
    """
    db_manager = DbManager()
    write_data = []
    for item in arguments_data:
        write_data.append(topic_id, item["yes_or_no"], item["argument"])
    result = db_manager.create_argument(write_data)
    return result

