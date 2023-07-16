from sqlalchemy import Column, Integer, String, Text, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True)
    published_at = Column(Date)
    title = Column(String)
    link = Column(String)
    description = Column(Text)
    summary = Column(Text)
    company = Column(String)
    fulltext = Column(Text)


class Link(Base):
    __tablename__ = "links"
    id = Column(Integer, primary_key=True)
    company = Column(String)
    link = Column(String)
