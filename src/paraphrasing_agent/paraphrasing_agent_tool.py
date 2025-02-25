from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import json
from typing import Type
from db_manager import DbManager


class ArgumentWritingToolInput(BaseModel):
    topic_id: int = Field(..., description="id of the topic for which to write the new arguments")
    arguments_data: str = Field(..., description="list of arguments to be written into the "
                                                                  "database, each list item is a dictionary of the "
                                                                  "form {yes_or_no: str, argument: str}")

class ArgumentWritingTool(BaseTool):
    name: str = "Argument writing tool"
    description: str = ("This tool writes new arguments into the database for a given topic. And returns the list of "
                        "topic_ids for the new topics in the database table")
    args_schema: Type[BaseModel] = ArgumentWritingToolInput
    result_as_answer: bool = True

    def _run(self, topic_id: int, arguments_data: str) -> str:
        db_manager = DbManager()
        arguments = json.loads(arguments_data)
        write_data = []
        for item in arguments:
            write_data.append((topic_id, item["yes_or_no"], item["argument"]))
        result = db_manager.create_argument(write_data)
        return json.dumps(result)