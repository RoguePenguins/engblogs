from fastapi import FastAPI
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from refresh import refresh_blogs


# Configure database
load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))
app = FastAPI()


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows CORS for your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/posts")
def read_posts():
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT title, summary, published_at FROM posts")
        )
        posts = [
            {"title": title, "summary": summary, "published_at": published_at}
            for title, summary, published_at in result
        ]
        return posts
