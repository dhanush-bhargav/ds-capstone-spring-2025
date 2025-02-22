from crewai.tools import tool
from db_manager import DbManager


@tool("Existing category reading tool")
def get_existing_categories(topic_id: int):
    """
    This tool is used to fetch existing argument categories from the database for a given topic
    :param topic_id: int, id of the topic for which to fetch argument categories from the database
    :return: List(Dict), list of argument categories found in the database for the given topic, each list item is of the form {category_id: int, argument_category: str}
    """
    db_manager = DbManager()
    result = db_manager.get_argument_categories(topic_id)
    return result


@tool("New category writing tool")
def write_new_categories(topic_id: int, categories_list):
    """
    This tool is used to write new argument categories to the database for a given topic
    :param topic_id: int, id of the topic for which to fetch argument categories from the database
    :param categories_list: List(Dict), list of new argument categories which need to be inserted into the database, each list item is of the form {argument_category: str}
    :return: List(int), list of ids of the newly inserted argument categories in the database
    """
    db_manager = DbManager()
    write_data = []
    for item in categories_list:
        write_data.append((topic_id, item['argument_category']))

    result = db_manager.create_argument_category(write_data)
    return result


@tool("Argument categories reading tool")
def get_all_categories(topic_id: int):
    """
    This tool is used to fetch all argument categories from the database for a given topic, after new arguments have been written.
    :param topic_id: int, id of the topic for which to fetch argument categories from the database
    :return: List(Dict), list of argument categories found in the database for the given topic, each list item is of the form {category_id: int, argument_category: str}
    """
    db_manager = DbManager()
    result = db_manager.get_argument_categories(topic_id)
    return result


@tool("Argument to category linking tool")
def link_argument_to_category(category_argument_list):
    """
    This tool is used to create a link between an argument category and the argument category in the database.
    :param category_argument_list: List(Dict), list of dictionary items, each item is of the form {category_id: int, argument_id: int}
    :return: List(int), list ids of the newly inserted argument-category links in the database
    """
    db_manager = DbManager()
    write_data = []
    for item in category_argument_list:
        write_data.append((item["argument_id"], item["category_id"]))

    result = db_manager.link_argument_category(write_data)
    return result

