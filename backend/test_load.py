from dotenv import load_dotenv
import os
from llama_index import StorageContext, load_index_from_storage

load_dotenv()

lang = "java"
folder_path = f"indexes/{lang}_index"

print(f"Trying to load index from: {folder_path}")

storage_context = StorageContext.from_defaults(persist_dir=folder_path)
index = load_index_from_storage(storage_context)

print("Index loaded successfully!")

query_text = "What is polymorphism?"
query_engine = index.as_query_engine()
response = query_engine.query(query_text)

print("Response from index:")
print(response.response)
