from llama_index import StorageContext, load_index_from_storage
from fastapi import HTTPException

def load_index(lang: str):
    folder_path = f"indexes/{lang}_index"
    try:
        storage_context = StorageContext.from_defaults(persist_dir=folder_path)
        index = load_index_from_storage(storage_context)
        return index
    except Exception:
        raise HTTPException(status_code=404, detail=f"Index for '{lang}' not found.")
