from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "sluggram"

    # Auth0
    auth0_domain: str = ""
    auth0_api_audience: str = ""
    auth0_algorithms: str = "RS256"

    # Cloudinary (optional - for cloud file storage)
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    # App settings
    upload_dir: str = "uploads"
    max_file_size: int = 100 * 1024 * 1024  # 100MB

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
