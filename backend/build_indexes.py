import os
from dotenv import load_dotenv
from llama_index import SimpleDirectoryReader, VectorStoreIndex
load_dotenv()



def build_index_for_language(lang):
    docs_path = f"./docs/{lang}"
    print(f"Building index for {lang} from {docs_path}")

    documents = SimpleDirectoryReader(docs_path).load_data()
    index = VectorStoreIndex.from_documents(documents)

    os.makedirs("indexes", exist_ok=True)
    index.storage_context.persist(persist_dir=f"indexes/{lang}_index")

    print(f"Saved index for {lang}")

if __name__ == "__main__":
    for lang in ["java", "python", "javascript"]:
        build_index_for_language(lang)
