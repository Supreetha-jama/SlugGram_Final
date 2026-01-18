from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: Optional[str] = None
    email: str
    major: Optional[str] = None
    graduation_year: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    auth0_id: str
    name: Optional[str] = None


class UserUpdate(BaseModel):
    username: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[str] = None
    bio: Optional[str] = None


class UserInDB(UserBase):
    id: str = Field(alias="_id")
    auth0_id: str
    name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True


class UserResponse(BaseModel):
    id: str
    auth0_id: str
    username: Optional[str] = None
    email: str
    name: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
