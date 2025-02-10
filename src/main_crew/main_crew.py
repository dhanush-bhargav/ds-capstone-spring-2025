from crewai import Crew, Process
from memory_manager import MemoryManager

class MainCrew:
    def __init__(self, chat_agent):
        self.chat_agent = chat_agent
        self.crew = Crew(
            agents=[self.chat_agent.agent],
            tasks=[self.chat_agent.task],
            process=Process.sequential,
            verbose=True
        )
        self.memory = MemoryManager()

    def run(self, user_response, user_id):

        if user_response != "":
            relevant_info = self.memory.retrieve_from_memory(user_id=user_id, query=user_response)
        else:
            relevant_info = ""

        inputs = {
            "user_response": user_response,
            "context": relevant_info,
        }
        return self.crew.kickoff(inputs)