from mem0 import Memory
from config_reader import ConfigData

class MemoryManager:
    def __init__(self):
        self.config_data = ConfigData("config.conf")
        print(self.config_data.get_value("Memory", "llm_model"))
        config = {
            "vector_store": {
                "provider": "chroma",
                "config": {
                    "collection_name": "chatbot_memory",
                    "path": "./chroma_db"
                }
            },
            "llm": {
                "provider": "ollama",
                "config": {
                    "model": self.config_data.get_value("Memory", "llm_model"),
                    "ollama_base_url": self.config_data.get_value("Memory", "model_url"),
                    "temperature": 0,
                    "max_tokens": 8000
                }
            },
            "embedder": {
                "provider": "ollama",
                "config": {
                    "model": self.config_data.get_value("Memory", "embedding_model"),
                    "ollama_base_url": self.config_data.get_value("Memory", "model_url")
                }
            }
        }
        self.memory = Memory.from_config(config)

    def add_to_memory(self, user_id, message):
        self.memory.add(f"Participant: {message}", user_id=user_id)

    def retrieve_from_memory(self, user_id, query):
        return self.memory.search(query, user_id=user_id, limit=3)
