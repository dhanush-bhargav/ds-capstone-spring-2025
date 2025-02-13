from crewai import Crew, Process
from memory_manager import MemoryManager

class MainCrew:
    def __init__(self, chat_agent, user_id, topic_id):
        self.chat_agent = chat_agent
        self.crew = Crew(
            agents=[self.chat_agent.agent],
            tasks=[self.chat_agent.task],
            process=Process.sequential,
            verbose=True
        )
        self.memory = MemoryManager(user_id, topic_id)
        self.conversation_id = self.memory.get_conversation_id()
        self.chat_history = []

    def get_conversation_id(self):
        return self.conversation_id

    def run(self, user_response, conversation_id):
        temporary_memory = []

        if user_response != "":
            temporary_memory.append((conversation_id, "Participant", user_response))
            self.chat_history.append({
                "role": "Participant",
                "message": user_response,
            })

        inputs = {
            "user_response": user_response,
            "chat_history": self.chat_history,
        }
        result = self.crew.kickoff(inputs)

        temporary_memory.append((conversation_id, "Conversational Argument Presenter", result.raw))

        self.chat_history.append({
            "role": "Conversational Argument Presenter",
            "message": result.raw,
        })

        self.memory.add_to_memory(temporary_memory)

        return result