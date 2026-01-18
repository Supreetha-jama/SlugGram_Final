from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime


class Comment(BaseModel):
    id: str
    author_id: str
    author_name: str
    text: str
    created_at: datetime


class CommentCreate(BaseModel):
    text: str


class PostBase(BaseModel):
    type: Literal["general", "event", "study", "reel"]
    content: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    # Event fields
    event_title: Optional[str] = None
    event_date: Optional[str] = None
    event_time: Optional[str] = None
    event_location: Optional[str] = None
    # Study group fields
    group_name: Optional[str] = None
    course: Optional[str] = None
    meeting_time: Optional[str] = None
    study_location: Optional[str] = None
    max_members: Optional[int] = 10


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    content: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    event_title: Optional[str] = None
    event_date: Optional[str] = None
    event_time: Optional[str] = None
    event_location: Optional[str] = None
    group_name: Optional[str] = None
    course: Optional[str] = None
    meeting_time: Optional[str] = None
    study_location: Optional[str] = None
    max_members: Optional[int] = None


class PostInDB(PostBase):
    id: str = Field(alias="_id")
    author_id: str
    author_name: str
    author_avatar: Optional[str] = None
    likes: List[str] = []
    comments: List[Comment] = []
    members: List[str] = []  # For study groups
    saved_by: List[str] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True


class PostResponse(BaseModel):
    id: str
    type: str
    author_id: str
    author_name: str
    author_avatar: Optional[str] = None
    content: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    likes: List[str] = []
    comments: List[Comment] = []
    members: List[str] = []
    saved_by: List[str] = []
    created_at: datetime
    # Event fields
    event_title: Optional[str] = None
    event_date: Optional[str] = None
    event_time: Optional[str] = None
    event_location: Optional[str] = None
    # Study group fields
    group_name: Optional[str] = None
    course: Optional[str] = None
    meeting_time: Optional[str] = None
    study_location: Optional[str] = None
    max_members: Optional[int] = None
