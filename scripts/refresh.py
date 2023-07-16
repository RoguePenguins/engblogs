import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from tqdm import tqdm
import openai
from models import Post, Link
from parse_feed import parse_feed
from models import Base


# Setup SQLAlchemy
def refresh_blogs():
    load_dotenv()
    engine = create_engine(os.getenv("DATABASE_URL"))
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    rss_links = session.query(Link).all()
    print("Start parsing feeds...")
    for link_info in tqdm(rss_links, desc="Parsing RSS feeds", unit="feed"):
        company = link_info.company
        url = link_info.link
        parse_feed(session, url, company)
    print("Finished parsing feeds.")

    session.close()
