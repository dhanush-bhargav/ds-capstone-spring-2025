from mem0 import Memory

class MemoryManager:
    def __init__(self):
        config = {
            "vector_store": {
                "provider": "chroma",
                "config": {
                    "collection_name": "chatbot_memory",
                    "path": "./chroma_db"
                }
            }
        }
        self.memory = Memory.from_config(config)

    def add_to_memory(self, user_id, message):
        self.memory.add(f"Participant: {message}", user_id=user_id)

    def retrieve_from_memory(self, user_id, query):
        return self.memory.search(query, user_id=user_id, limit=3)

