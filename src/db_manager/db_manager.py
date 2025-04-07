import sqlite3
import datetime
from config_reader import ConfigData


class DbManager:
    def __init__(self):
        self.config_data = ConfigData("config.conf")
        self.db_path = self.config_data.get_value('Memory', 'db_path')


    def get_topics(self):
        topics_data = []
        group_ids = []

        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(""" SELECT tg.group_id, tg.group_name, mt.topic_id, mt.topic_description 
                            FROM topic_groups tg 
                            INNER JOIN main.master_topics mt on tg.group_id = mt.group_id 
                            ORDER BY tg.group_id """)

        for row in result:
            group_id, group_name, topic_id, topic_description = row
            if group_id not in group_ids:
                topics_data.append({
                    "id": group_id,
                    "name": group_name,
                    "preMadeQuestions": [{"id": topic_id, "topic": topic_description}],
                })
                group_ids.append(group_id)
            else:
                for i in range(len(topics_data)):
                    if topics_data[i]['id'] == group_id:
                        topics_data[i]['preMadeQuestions'].append({"id": topic_id, "topic": topic_description})
                        break

        connection.close()
        return topics_data

    def get_topic_by_id(self, topic_id):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"SELECT topic_id, topic_description FROM master_topics WHERE topic_id = {topic_id}").fetchone()
        connection.close()
        return {
            "topic_id": result[0],
            "topic_name": result[1]
        }

    def add_user(self, user_data):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.execute("""INSERT INTO users (user_name, user_id, password) VALUES (?, ?, ?)""", user_data)
        connection.commit()
        connection.close()
        return user_data

    def add_user_question_order(self, user_id, topic_ids):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.execute("""INSERT INTO link_users_question_orders (user_id, question_id_order) VALUES (?, ?)""",
                       (user_id, topic_ids))
        connection.commit()
        connection.close()
        return user_id

    def get_user_question_order(self, user_id):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"""SELECT user_id, question_id_order FROM link_users_question_orders
                                        WHERE user_id = '{user_id}'""").fetchone()
        connection.close()
        return {
            "user_id": result[0],
            "question_id_order": result[1]
        }


    def login(self, user_id, password):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f" SELECT user_id, user_name, password FROM users WHERE user_id = '{user_id}' ").fetchone()
        connection.close()
        if result:
            if result[2] == password:
                return {
                    "success": True,
                    "message": "Login Successful",
                    "user_name": result[1],
                    "user_id": result[0],
                }
            else:
                return {
                    "success": False,
                    "message": "Authentication Failed"
                }
        else:
            return {
                "success": False,
                "message": "User not found"
            }


    def get_all_instructions(self):
        instructions_data=[]
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"SELECT order_id, instruction, intended_for FROM instructions ORDER BY order_id ASC")
        for row in result:
            order_id, instruction, intended_for = row
            instructions_data.append({"order_id": order_id, "instruction": instruction, "intended_for": intended_for})
        connection.close()
        return instructions_data


    def get_instructions_by_intended_for(self, intended_for):
        instructions_data = []
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"SELECT order_id, instruction, intended_for FROM instructions WHERE intended_for = '{intended_for}' ORDER BY order_id ASC")
        for row in result:
            order_id, instruction, intended_for = row
            instructions_data.append({"order_id": order_id, "instruction": instruction, "intended_for": intended_for})
        connection.close()
        return instructions_data


    def create_new_conversation(self, topic_id, user_id):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.execute("INSERT INTO link_conversations_user_topic (topic_id, user_id, start_datetime) VALUES (?, ?, ?)", (topic_id, user_id, datetime.datetime.now()))
        connection.commit()
        conversation_id = cursor.lastrowid
        connection.close()
        return conversation_id


    def end_conversation(self, conversation_id):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.execute(f"UPDATE link_conversations_user_topic SET end_datetime = '{datetime.datetime.now()}' WHERE conversation_id = {conversation_id}")
        connection.commit()
        connection.close()
        return conversation_id


    def create_stance(self, conversation_id, stance, stance_rating, collected_at):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.execute("INSERT INTO stances (conversation_id, stance, stance_rating, collected_at) VALUES (?, ?, ?, ?)",
                       (conversation_id, stance, stance_rating, collected_at))
        connection.commit()
        stance_id = cursor.lastrowid
        connection.close()
        return stance_id


    def create_argument_category(self, argument_category_data):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.executemany("INSERT INTO master_argument_categories (topic_id, argument_category) VALUES (?, ?)", argument_category_data)
        connection.commit()
        res = cursor.execute(f"SELECT category_id, argument_category FROM master_argument_categories WHERE topic_id = {argument_category_data[0][0]}").fetchall()
        connection.close()
        result = []
        for row in res:
            category_id, argument_category = row
            result.append({"category_id": category_id, "argument_category": argument_category})
        return result


    def create_argument(self, argument_data):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.executemany("INSERT INTO master_arguments (topic_id, yes_or_no, argument) VALUES (?, ?, ?)",
                                        argument_data)
        connection.commit()
        rowcount = cursor.rowcount
        res = cursor.execute(f"SELECT argument_id FROM master_arguments argument_id ORDER BY argument_id DESC LIMIT {rowcount}").fetchall()
        connection.close()
        result = [item[0] for item in res]
        return result


    def link_argument_category(self, data):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.executemany("INSERT INTO link_argument_categories (argument_id, category_id) VALUES (?, ?)", data)
        connection.commit()
        rowcount = cursor.rowcount
        res = cursor.execute(f"SELECT id FROM link_argument_categories ORDER BY id DESC LIMIT {rowcount}").fetchall()
        connection.close()
        result = [item[0] for item in res]
        return result


    def create_implication(self, implication_data):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.executemany("INSERT INTO implications (conversation_id, implication_question_id, implication) VALUES (?, ?, ?)",
                                    implication_data)
        connection.commit()
        rowcount = cursor.rowcount
        res = cursor.execute(f"SELECT implication_id FROM implications ORDER BY implication_id DESC LIMIT {rowcount}").fetchall()
        connection.close()
        result = [item[0] for item in res]
        return result


    def get_argument_categories(self, topic_id):
        argument_categories_data = []
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"SELECT category_id, argument_category FROM master_argument_categories WHERE topic_id = {topic_id}").fetchall()
        for row in result:
            category_id, argument_category = row
            argument_categories_data.append({"category_id": category_id, "argument_category": argument_category})
        connection.close()
        return argument_categories_data


    def get_arguments(self, topic_id):
        arguments_data = []
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"SELECT argument_id, yes_or_no, argument FROM master_arguments WHERE topic_id = {topic_id}")
        for row in result:
            argument_id, yes_or_no, argument = row
            arguments_data.append({
                "argument_id": argument_id,
                "yes_or_no": yes_or_no,
                "argument": argument
            })
        connection.close()
        return arguments_data


    def get_arguments_by_category_id(self, topic_id, category_id):
        argument_data = []
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"""SELECT mac.category_id, mac.argument_category, ma.argument_id, ma.argument
                                        FROM master_argument_categories mac
                                        INNER JOIN link_argument_categories lac
                                        ON mac.category_id = lac.category_id
                                        INNER JOIN master_arguments ma
                                        ON ma.argument_id = lac.argument_id
                                        WHERE mac.category_id = {category_id} AND mac.topic_id = {topic_id}""")
        for row in result:
            category_id, argument_category, argument_id, argument = row
            argument_data.append({"category_id": category_id, "argument_category": argument_category,
                                  "argument_id": argument_id , "argument": argument})
        connection.close()
        return argument_data


    def get_unlinked_arguments(self, topic_id):
        unlinked_arguments_data = []
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"""SELECT ma.argument_id, ma.yes_or_no, ma.argument
                                        FROM master_arguments ma
                                        WHERE ma.topic_id = {topic_id} AND
                                        ma.argument_id NOT IN (SELECT argument_id FROM link_argument_categories)""")
        for row in result:
            argument_id, yes_or_no, argument = row
            unlinked_arguments_data.append({"argument_id": argument_id, "yes_or_no": yes_or_no, "argument": argument})
        connection.close()
        return unlinked_arguments_data


    def get_assessment_questions(self, survey_type):
        survey_questions_data = []
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"""SELECT assessment_question_id, assessment_question, answer_type 
                                        FROM assessment_questions WHERE assessment_type = '{survey_type}'""").fetchall()
        for row in result:
            assessment_question_id, assessment_question, answer_type = row
            survey_questions_data.append({"assessment_question_id": assessment_question_id,
                                          "assessment_question": assessment_question,
                                          "answer_type": answer_type})
        return survey_questions_data


    def insert_assessment_responses(self, assessment_response_data):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.executemany("""INSERT INTO assessment_responses (assessment_question_id, conversation_id, answer, collected_at)
                                VALUES (?, ?, ?, ?)""", assessment_response_data)
        connection.commit()
        rowcount = cursor.rowcount
        connection.close()
        return rowcount


    def insert_implication_questions(self, implication_question_data):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.executemany("""INSERT INTO implication_questions (category_id, argument_id, implication_type, implication_question)
                                    VALUES (?, ?, ?, ?)""",
                           implication_question_data)
        connection.commit()
        rowcount = cursor.rowcount
        connection.close()
        return rowcount


    def get_implication_questions(self, category_id):
        implication_questions_data = []
        implication_questions_by_argument = {}
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"""SELECT implication_question_id, argument_id, implication_type, implication_question
                                        FROM implication_questions WHERE category_id = {category_id} ORDER BY argument_id""").fetchall()
        connection.close()

        for row in result:
            implication_question_id, argument_id, implication_type, implication_question = row
            if argument_id in implication_questions_by_argument:
                implication_questions_by_argument[argument_id].append({
                    "implication_question_id": implication_question_id,
                    "implication_type": implication_type,
                    "implication_question": implication_question
                })
            else:
                implication_questions_by_argument[argument_id] = [{
                    "implication_question_id": implication_question_id,
                    "implication_type": implication_type,
                    "implication_question": implication_question
                }]

        for key, value in implication_questions_by_argument.items():
            implication_questions_data.append({
                "argument_id": key,
                "implications": value
            })

        return implication_questions_data


    def get_arguments_without_implication_questions(self, category_id):
        arguments = []
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"""SELECT ma.argument_id, ma.argument FROM master_arguments ma INNER JOIN link_argument_categories lac
                                    ON ma.argument_id = lac.argument_id AND lac.category_id = {category_id}
                                    WHERE ma.argument_id NOT IN (SELECT argument_id FROM implication_questions)""").fetchall()
        for row in result:
            argument_id, argument = row
            arguments.append({
                "argument_id": argument_id,
                "argument": argument
            })
        return arguments