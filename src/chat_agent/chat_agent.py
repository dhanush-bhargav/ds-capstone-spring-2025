from crewai import Agent, LLM, Task

class ChatAgent:
    def __init__(self):
        self.agent = Agent(
            llm=LLM(model="ollama/llama3.2", base_url="http://localhost:11434"),
            role="Intellectual Humility Intervention Delivery Agent",
            goal="Interact with a participant and oppose their stance on an issue",
            backstory="""You are an AI agent who takes a stance opposing the participant and provides them with well though out arguments opposing their view.
            Your purpose is not to change the participant's views. It is only to produce arguments and analyze their responses. Your goal is simply to provide arguments, and not
            to debate with the participant.""",

        )

    def create_task(self):
        self.task = Task(
            agent=self.agent,
            async_execution=False,
            description="""Initially, you will be given a central yes/no question on a popular issue and the participant's stance on it.
            For example, 'Question: Should performance-enhancing drugs be banned?, Participant Stance: Yes'. You will then take the opposite stance and begin a conversation with the participant.
            Your task is not to engage the participant in a debate, but to produce valid arguments and receive the participant's response to those arguments.
            You do not need to change the participant's point of view. You will present the arguments in a conversational format. Present one argument, wait for the participant's response, and present the next argument.""",
            expected_output=""""Arguments opposing the participant's view in a conversational format."""
        )
