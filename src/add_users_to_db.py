import pandas
from db_manager import DbManager
import secrets
import itertools
import random

PASSWORD_LENGTH = 8
order_options = list(itertools.permutations(["33", "48", "73"]))
print(order_options)

user_data = pandas.read_csv("database/students_list.csv")
print(user_data.head())
added_user_ids = []
db_manager = DbManager()

for index, row in user_data.iterrows():
    user_name = row['first_name'] + " " + row['last_name']
    user_id = row['student_id']
    password = secrets.token_urlsafe(PASSWORD_LENGTH)
    print(user_name, user_id, password)
    db_manager.add_user((user_name, user_id, password))
    order = random.choice(order_options)
    added_user_id = db_manager.add_user_question_order(user_id, ",".join(order))
    added_user_ids.append(added_user_id)

print(len(added_user_ids))

