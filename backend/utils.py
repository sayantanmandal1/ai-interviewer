import openai
import os
from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI()

def get_embedding(text: str):
    response = client.embeddings.create(
        input=[text],
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding