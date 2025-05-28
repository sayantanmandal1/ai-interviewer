from dotenv import load_dotenv
import os

load_dotenv()  # this loads environment variables from .env file

from llama_index import StorageContext, load_index_from_storage

def load_index(lang):
    storage_context = StorageContext.from_defaults(persist_dir=f"indexes/{lang}_index")
    index = load_index_from_storage(storage_context)
    return index

if __name__ == "__main__":
    lang = "java"
    index = load_index(lang)
    query_text = "Give me 5 interview questions about Java programming."
    query_engine = index.as_query_engine()
    response = query_engine.query(query_text)
    print("Response from index:")
    print(response.response)

