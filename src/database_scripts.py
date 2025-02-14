from config_reader import ConfigData
import sqlite3

config_data = ConfigData("config.conf")
connection = sqlite3.connect(config_data.get_value("Memory", "db_path"))

cursor = connection.cursor()
cursor.execute("""CREATE TABLE users (
                      user_id VARCHAR(255) NOT NULL,
                      user_name VARCHAR(255) NOT NULL,
                      password VARCHAR(255) NOT NULL
                    )""")

cursor.execute("""CREATE TABLE topic_groups (
                      group_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      group_name TEXT NOT NULL
                    )""")

cursor.execute("""CREATE TABLE master_topics (
                      group_id INTEGER NOT NULL,
                      topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      topic_description TEXT NOT NULL
                    )""")

cursor.execute("""CREATE TABLE link_conversations_user_topic (
                      conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      topic_id INTEGER NOT NULL,
                      user_id INTEGER NOT NULL
                    )""")

cursor.execute("""CREATE TABLE instructions (
                    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    instruction TEXT NOT NULL,
                    intended_for VARCHAR(50) NOT NULL)""")

cursor.execute("""CREATE TABLE master_argument_categories (
                      category_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      topic_id INTEGER NOT NULL,
                      argument_category TEXT NOT NULL
                    )""")

cursor.execute("""CREATE TABLE master_arguments (
                      argument_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      topic_id INTEGER NOT NULL,
                      yes_or_no VARCHAR(5) NOT NULL,
                      argument TEXT NOT NULL,
                      category_id INTEGER NOT NULL
                    )""")

cursor.execute("""CREATE TABLE stances (
                      stance_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      conversation_id INTEGER NOT NULL,
                      stance TEXT NOT NULL,
                      stance_rating INTEGER NOT NULL CHECK(stance_rating BETWEEN 1 AND 10),
                      collected_at VARCHAR(25) NOT NULL
                    )""")

cursor.execute("""CREATE TABLE implications (
                      implication_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      conversation_id INTEGER NOT NULL,
                      argument_category TEXT NOT NULL,
                      argument TEXT NOT NULL,
                      implication VARCHAR(255) NOT NULL
                    )""")


connection.close()