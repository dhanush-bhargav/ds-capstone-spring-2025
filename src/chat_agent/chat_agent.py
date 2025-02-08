from crewai import Agent, LLM, Task

class ChatAgent:
    def __init__(self, model_name, model_url, central_question, stance):
        self.agent = Agent(
            llm=LLM(model=model_name, base_url=model_url),
            role="Intellectual Humility Intervention Delivery Agent",
            goal="Interact with a participant and oppose their stance on an issue in a manner that improves their intellectual humility",
            backstory="""You are an AI agent who takes a stance opposing the participant and provides them with well though out arguments opposing their view.
            Your purpose is not to change the participant's views. It is only to produce arguments and analyze their responses. Your goal is simply to provide arguments, and not
            to debate with the participant.""",

        )

        self.task = Task(
            agent=self.agent,
            async_execution=False,
            description=f"""You have been presented with the issue {central_question} and your stance is '{stance}', the participant has taken the opposing stance. You need to now come up with and present arguments
            to the participant. Your task is not to engage the participant in a debate, but to produce valid arguments and receive the participant's response to those arguments.
            You do not need to change the participant's point of view. You will present the arguments in a conversational format. The user's response is {{user_response}} and context is {{context}}.
            In case user's response or context are empty, ignore them and generate your argument.""",
            expected_output=""""Arguments opposing the participant's view in a conversational format."""
        )
