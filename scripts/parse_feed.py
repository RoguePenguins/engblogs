import feedparser
import requests
from models import Post, Link
from parse_utils import get_full_text, get_summary

fulltext = True


def parse_date(date_string):
    import datetime

    formats = [
        "%Y-%m-%dT%H:%M:%SZ",  # Format like '2023-07-06T19:00:51Z'
        "%a, %d %b %Y %H:%M:%S %Z",  # Format like 'Tue, 20 Jun 2023 00:00:00 GMT'
        "%a, %d %b %Y %H:%M:%S %z",  # Format like 'Wed, 08 Mar 2023 00:00:00 +0000'
        "%Y-%m-%dT%H:%M:%S.%f%z",  # Format like '2023-07-06T12:50:00.000-07:00'
        "%Y-%m-%d %H:%M:%S",  # Format like '2023-06-29 16:30:00'
    ]
    for fmt in formats:
        try:
            return datetime.datetime.strptime(date_string, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    raise ValueError(f"couldn't parse date {date_string} with any of the known formats")


def parse_feed(session, url, company):
    existing_posts = session.query(Post).all()

    feed = feedparser.parse(url)

    for entry in feed.entries:
        # Fetch title and description
        title = entry.title
        description = getattr(entry, "description", "")
        link = entry.link
        # Convert the timestamp into yyyy-mm-dd format
        published_at = parse_date(entry.published)
        link = entry.link
        # Check if the entry exists in the loaded 'posts' data
        if any(
            post
            for post in existing_posts
            if post.title == title and post.company == company
        ):
            print(f"Skipped existing post: {title} from {company}")
            continue

        # Get the full text of the blog post
        if link and fulltext:
            full_text = get_full_text(link)
        summary = get_summary(title, description)

        new_post = Post(
            title=title,
            description=description,
            published_at=published_at,
            fulltext=full_text,
            summary=summary,
            company=company,
        )
        session.add(new_post)

    try:
        session.commit()
    except Exception as e:
        print(f"Error occurred while saving post to database: {e}")
        session.rollback()
