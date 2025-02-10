from crewai import Agent, LLM, Task

class ChatAgent:
    def __init__(self, model_name, model_url, central_question, stance):

        self.central_question = central_question
        self.stance = stance
        self.agent = Agent(
            llm=LLM(model=model_name, base_url=model_url),
            role="Conversational Argument Presenter",
            goal=(
                "To present arguments in favor of a specific stance on a given yes/no question, one at a time, "
                "in a conversational format. The agent will tailor its next argument based on the participant's response, "
                "without engaging in a debate or attempting to change their stance."
            ),
            backstory=(
                "A reasoning-driven AI designed to foster critical thinking by engaging in structured, iterative discussions "
                "that present well-supported arguments for a chosen stance."
            ),
            allow_delegation=False,
            verbose=True
        )

        self.task = Task(
            agent=self.agent,
            description=(
                f"The agent will present arguments in favor of the stance '{stance.upper()}' "
                f"for the question: '{central_question}'. It will present one argument at a time, "
                f"tailoring the next argument based on the participant's response: {{user_response}}\nand conversation history:\n{{context}}."
            ),
            expected_output="An iterative conversation presenting structured arguments in favor of the stance."
        )
