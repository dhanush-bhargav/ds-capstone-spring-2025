from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type, Tuple, Dict, Union, Any
from db_manager import DbManager
import json


class ArgumentFetchingToolInput(BaseModel):
    topic_id: int = Field(..., description="The id of the topic for which to get arguments from the database")
    topic: str = Field(..., description="The topic for which to get arguments from the database")

class ArgumentFetchingTool(BaseTool):
    name: str = "Argument fetching tool"
    description: str = "This tool is used to get all the arguments present in the database for a given topic."
    args_schema: Type[BaseModel] = ArgumentFetchingToolInput

    def _run(self, topic_id: int, topic: str) -> str:
        db_manager = DbManager()
        arguments_data = db_manager.get_arguments(topic_id)
        return json.dumps(arguments_data)


def validation_agent_guardrail(result: str) -> Tuple[bool, Any]:
    """Validate Argument Validation Agent outputs meets requirements"""
    try:
        result_dict = json.loads(result.raw)
        for item in result_dict:
            if item['yes_or_no'].lower() == 'true':
                item['yes_or_no'] = 'YES'
            elif item['yes_or_no'].lower() == 'false':
                item['yes_or_no'] = 'NO'
        return (True, result_dict)
    except Exception as e:
        return (False, str(e))
