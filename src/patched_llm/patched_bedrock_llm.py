from crewai import LLM

class PatchedBedrockLLM(LLM):
    def call(self, prompt: str, **kwargs):
        if isinstance(prompt, str):
            messages = [{'role': 'user', 'content': prompt}]
        elif isinstance(prompt, list):
            flattened_content = "\n\n".join(
                f"{msg.get('content','')}" for msg in prompt
            )
            messages = [{'role': 'user', 'content': flattened_content}]
        else:
            raise ValueError("Invalid prompt format passed to Bedrock Model")
        kwargs.pop("prompt", None)
        kwargs['messages'] = messages
        return super().call(**kwargs)
