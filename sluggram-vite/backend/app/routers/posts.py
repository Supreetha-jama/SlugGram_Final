from fastapi import APIRouter, Depends, HTTPException, status, Query
from datetime import datetime
from bson import ObjectId
from typing import List, Optional
from ..database import get_database
from ..schemas import PostCreate, PostUpdate, PostResponse, CommentCreate
from ..utils.auth import get_current_user

router = APIRouter(prefix="/posts", tags=["posts"])


def post_helper(post) -> dict:
    """Convert MongoDB post document to response format."""
    return {
        "id": str(post["_id"]),
        "type": post["type"],
        "author_id": post["author_id"],
        "author_name": post["author_name"],
        "author_avatar": post.get("author_avatar"),
        "content": post["content"],
        "image_url": post.get("image_url"),
        "video_url": post.get("video_url"),
        "likes": post.get("likes", []),
        "comments": post.get("comments", []),
        "members": post.get("members", []),
        "saved_by": post.get("saved_by", []),
        "created_at": post["created_at"],
        "event_title": post.get("event_title"),
        "event_date": post.get("event_date"),
        "event_time": post.get("event_time"),
        "event_location": post.get("event_location"),
        "group_name": post.get("group_name"),
        "course": post.get("course"),
        "meeting_time": post.get("meeting_time"),
        "study_location": post.get("study_location"),
        "max_members": post.get("max_members"),
    }


@router.get("/", response_model=List[PostResponse])
async def get_posts(
    post_type: Optional[str] = Query(None, description="Filter by post type"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db=Depends(get_database),
):
    """Get all posts, optionally filtered by type."""
    query = {}
    if post_type:
        query["type"] = post_type

    cursor = db.posts.find(query).sort("created_at", -1).skip(skip).limit(limit)
    posts = await cursor.to_list(length=limit)
    return [post_helper(post) for post in posts]


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post: PostCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Create a new post."""
    # Get user info for author details
    user = await db.users.find_one({"auth0_id": current_user["sub"]})
    author_name = user.get("username") if user else current_user.get("name", "Anonymous")
    author_avatar = user.get("avatar_url") if user else current_user.get("picture")

    new_post = {
        **post.model_dump(),
        "author_id": current_user["sub"],
        "author_name": author_name or "Anonymous",
        "author_avatar": author_avatar,
        "likes": [],
        "comments": [],
        "members": [current_user["sub"]] if post.type == "study" else [],
        "saved_by": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await db.posts.insert_one(new_post)
    new_post["_id"] = result.inserted_id
    return post_helper(new_post)


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: str,
    db=Depends(get_database),
):
    """Get a single post by ID."""
    try:
        post = await db.posts.find_one({"_id": ObjectId(post_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID",
        )

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    return post_helper(post)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Delete a post (only by the author)."""
    try:
        post = await db.posts.find_one({"_id": ObjectId(post_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID",
        )

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    if post["author_id"] != current_user["sub"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post",
        )

    await db.posts.delete_one({"_id": ObjectId(post_id)})


@router.post("/{post_id}/like", response_model=PostResponse)
async def toggle_like(
    post_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Toggle like on a post."""
    try:
        post = await db.posts.find_one({"_id": ObjectId(post_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID",
        )

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    user_id = current_user["sub"]
    likes = post.get("likes", [])

    if user_id in likes:
        # Unlike
        likes.remove(user_id)
    else:
        # Like
        likes.append(user_id)

    result = await db.posts.find_one_and_update(
        {"_id": ObjectId(post_id)},
        {"$set": {"likes": likes, "updated_at": datetime.utcnow()}},
        return_document=True,
    )

    return post_helper(result)


@router.post("/{post_id}/comment", response_model=PostResponse)
async def add_comment(
    post_id: str,
    comment: CommentCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Add a comment to a post."""
    try:
        post = await db.posts.find_one({"_id": ObjectId(post_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID",
        )

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    # Get user info
    user = await db.users.find_one({"auth0_id": current_user["sub"]})
    author_name = user.get("username") if user else current_user.get("name", "Anonymous")

    new_comment = {
        "id": str(ObjectId()),
        "author_id": current_user["sub"],
        "author_name": author_name or "Anonymous",
        "text": comment.text,
        "created_at": datetime.utcnow(),
    }

    result = await db.posts.find_one_and_update(
        {"_id": ObjectId(post_id)},
        {
            "$push": {"comments": new_comment},
            "$set": {"updated_at": datetime.utcnow()},
        },
        return_document=True,
    )

    return post_helper(result)


@router.post("/{post_id}/save", response_model=PostResponse)
async def toggle_save(
    post_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Toggle save on a post."""
    try:
        post = await db.posts.find_one({"_id": ObjectId(post_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID",
        )

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    user_id = current_user["sub"]
    saved_by = post.get("saved_by", [])

    if user_id in saved_by:
        saved_by.remove(user_id)
    else:
        saved_by.append(user_id)

    result = await db.posts.find_one_and_update(
        {"_id": ObjectId(post_id)},
        {"$set": {"saved_by": saved_by, "updated_at": datetime.utcnow()}},
        return_document=True,
    )

    return post_helper(result)


@router.post("/{post_id}/join", response_model=PostResponse)
async def toggle_join_study_group(
    post_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Toggle membership in a study group."""
    try:
        post = await db.posts.find_one({"_id": ObjectId(post_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID",
        )

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    if post["type"] != "study":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only join study group posts",
        )

    user_id = current_user["sub"]
    members = post.get("members", [])
    max_members = post.get("max_members", 10)

    if user_id in members:
        # Leave group
        members.remove(user_id)
    else:
        # Join group (if not full)
        if len(members) >= max_members:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Study group is full",
            )
        members.append(user_id)

    result = await db.posts.find_one_and_update(
        {"_id": ObjectId(post_id)},
        {"$set": {"members": members, "updated_at": datetime.utcnow()}},
        return_document=True,
    )

    return post_helper(result)


@router.get("/user/{user_id}", response_model=List[PostResponse])
async def get_user_posts(
    user_id: str,
    db=Depends(get_database),
):
    """Get all posts by a specific user."""
    cursor = db.posts.find({"author_id": user_id}).sort("created_at", -1)
    posts = await cursor.to_list(length=100)
    return [post_helper(post) for post in posts]


@router.get("/saved/me", response_model=List[PostResponse])
async def get_saved_posts(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Get all posts saved by the current user."""
    cursor = db.posts.find({"saved_by": current_user["sub"]}).sort("created_at", -1)
    posts = await cursor.to_list(length=100)
    return [post_helper(post) for post in posts]
