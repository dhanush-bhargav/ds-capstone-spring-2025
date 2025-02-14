import sqlite3
from config_reader import ConfigData

class MemoryManager:
    def __init__(self, user_id, topic_id):
        self.config_data = ConfigData("config.conf")
        self.db_path = self.config_data.get_value('Memory', 'db_path')
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.execute(f"INSERT INTO link_conversations_user_topic ( topic_id, user_id ) VALUES ( '{topic_id}', '{user_id}' )")
        connection.commit()
        self.conversation_id = cursor.lastrowid
        connection.close()


    def get_conversation_id(self):
        return self.conversation_id


    def add_to_memory(self, data):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        cursor.executemany("INSERT INTO conversation_history ( conversation_id, role, content ) VALUES (?, ?, ?)", data)
        connection.commit()
        connection.close()


    def retrieve_from_memory(self, conversation_id):
        connection = sqlite3.connect(self.db_path)
        cursor = connection.cursor()
        result = cursor.execute(f"SELECT * FROM conversation_history WHERE conversation_id = { conversation_id } ORDER BY timestamp")
        return result.fetchall()

