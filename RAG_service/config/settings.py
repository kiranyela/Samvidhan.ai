# config/settings.py
import os
from dotenv import load_dotenv


load_dotenv()


# Embedding model (sentence-transformers recommended)
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
# LLM model: use a HuggingFace repo id that works for you (or change to your provider)
LLM_MODEL = os.getenv("LLM_MODEL", "google/flan-t5-base")


# Chroma persistence directory
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "data/chroma_db")


# How many docs to retrieve
TOP_K = int(os.getenv("TOP_K", "4"))


# Optionally set HF API token if needed (for private repos)
HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN", "")


# FastAPI settings
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))