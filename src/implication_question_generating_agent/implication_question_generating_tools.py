from typing import List, Dict, Tuple, Any
import json


def implication_question_generation_guardrail(result: str) -> Tuple[bool, Any]:
    """Validate generated implication questions to match expected output format"""
    try:
        result_dict = json.loads(result.raw)
        print(result_dict)
        print(type(result_dict))
        if isinstance(result_dict, list):
            if len(result_dict) > 0:
                for item in result_dict:
                    if ("argument_id" not in item) or ("argument" not in item) or ("implication_questions" not in item):
                        return (False, "Keys missing from the dictionary")
                    else:
                        if len(item["implication_questions"]) != 2:
                            return (False, "implication_questions must have exactly 2 elements")

                        for impl in item["implication_questions"]:
                            if ("implication_type" not in impl) or ("implication_question" not in impl):
                                return (False, "Keys missing from the dictionary")
                            elif impl["implication_type"] not in ['IMPACT_QUESTION', 'LIKELIHOOD_QUESTION']:
                                return (False, "Unknown value for key 'implication_type'")
                return (True, result)
            else:
                return (False, "Empty list recieved")
        else:
            return (False, "result is of invalid format")
    except Exception as e:
        return (False, str(e))
