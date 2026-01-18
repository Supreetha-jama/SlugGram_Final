from motor.motor_asyncio import AsyncIOMotorClient
from .config import get_settings

settings = get_settings()


class Database:
    client: AsyncIOMotorClient = None
    db = None


db = Database()


async def connect_to_mongo():
    """Connect to MongoDB."""
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    db.db = db.client[settings.database_name]

    # Create indexes for better performance
    await db.db.users.create_index("auth0_id", unique=True)
    await db.db.posts.create_index("author_id")
    await db.db.posts.create_index("created_at")
    await db.db.posts.create_index("type")

    print(f"Connected to MongoDB: {settings.database_name}")


async def close_mongo_connection():
    """Close MongoDB connection."""
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")


def get_database():
    """Get database instance."""
    return db.db
