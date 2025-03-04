from crewai.tools import tool, BaseTool
from pydantic import BaseModel, Field
from typing import Type
import json
from db_manager import DbManager


class CategoryReadingToolInput(BaseModel):
    topic_id: int = Field(..., description='ID of the topic for which to fetch argument categories from the database')

class CategoryReadingTool(BaseTool):
    name: str = "Argument category fetching tool"
    description: str = "This tool is used to fetch argument categories from the database for a given topic"
    args_schema: Type[BaseModel] = CategoryReadingToolInput

    def _run(self, topic_id: int) -> str:
        db_manager = DbManager()
        result = db_manager.get_argument_categories(topic_id)
        return json.dumps(result)


class CategoryWritingToolInput(BaseModel):
    topic_id: int = Field(..., description='ID of the topic for which to write argument categories to the database')
    categories_list: str = Field(..., description='list of new argument categories which need to be inserted into the '
                                                 'database, each list item is of the form {argument_category: str}')

class CategoryWritingTool(BaseTool):
    name: str = "Argument category writing tool"
    description: str = "This tool is used to write argument categories to the database for a given topic"
    args_schema: Type[BaseModel] = CategoryWritingToolInput

    def _run(self, topic_id: int, categories_list: str) -> str:
        db_manager = DbManager()
        categories = json.loads(categories_list)
        write_data = []
        for item in categories:
            write_data.append((topic_id, item['argument_category']))

        result = db_manager.create_argument_category(write_data)
        return json.dumps(result)


class LinkArgumentToCategoryInput(BaseModel):
    category_argument_list: str = Field(..., description='list of dictionary items, each item is of the form '
                                                         '{category_id: int, argument_id: int}')

class LinkArgumentToCategoryTool(BaseTool):
    name: str = "Argument category linking tool"
    description: str = "This tool is used to create a link between an argument and an argument category in the database."
    args_schema: Type[BaseModel] = LinkArgumentToCategoryInput
    result_as_answer: bool = True

    def _run(self, category_argument_list: str) -> str:
        db_manager = DbManager()
        write_data = []
        category_argument = json.loads(category_argument_list)
        for item in category_argument:
            write_data.append((item["argument_id"], item["category_id"]))
        print(write_data)
        result = db_manager.link_argument_category(write_data)
        return json.dumps(result)


class UnlinkedArgumentReadingToolInput(BaseModel):
    topic_id: int = Field(..., description="ID of the topic for which to get unlinked arguments from the database")

class UnlinkedArgumentReadingTool(BaseTool):
    name: str = "Unlinked argument reading tool"
    description: str = "This tool is used to get unlinked arguments from the database for a given topic"
    args_schema: Type[BaseModel] = UnlinkedArgumentReadingToolInput

    def _run(self, topic_id: int) -> str:
        db_manager = DbManager()
        result = db_manager.get_unlinked_arguments(topic_id)
        return json.dumps(result)
