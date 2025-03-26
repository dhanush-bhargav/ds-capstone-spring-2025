import requests
import json
import os

base_url = "http://localhost:5000"

for i in range(1, 101):
    with open(f"test_cases/question_{i}_arguments.json", "r") as f:
        arguments_data = json.load(f)
    with open(f"test_cases/question_{i}_categories.json", "r") as f:
        categories_data = json.load(f)

    try:
        arguments_result = requests.post(base_url + '/read_user_arguments', data=arguments_data['request_body']).json()
        categories_result = requests.post(base_url + '/read_user_argument_categories', data=categories_data['request_body']).json()
        print("#######Argument Generation Result#######")
        print(arguments_result)
        print("#######Category Generation Result#######")
        print(categories_result)

    except Exception as e:
        print(e)

