from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from ..database import get_database
from ..schemas import UserCreate, UserUpdate, UserResponse
from ..utils.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


def user_helper(user) -> dict:
    """Convert MongoDB user document to response format."""
    return {
        "id": str(user["_id"]),
        "auth0_id": user["auth0_id"],
        "username": user.get("username"),
        "email": user["email"],
        "name": user.get("name"),
        "major": user.get("major"),
        "graduation_year": user.get("graduation_year"),
        "bio": user.get("bio"),
        "avatar_url": user.get("avatar_url"),
        "created_at": user["created_at"],
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Get the current user's profile, creating one if it doesn't exist."""
    user = await db.users.find_one({"auth0_id": current_user["sub"]})

    if not user:
        # Create new user profile
        new_user = {
            "auth0_id": current_user["sub"],
            "email": current_user.get("email", ""),
            "name": current_user.get("name", ""),
            "avatar_url": current_user.get("picture", ""),
            "username": None,
            "major": None,
            "graduation_year": None,
            "bio": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await db.users.insert_one(new_user)
        new_user["_id"] = result.inserted_id
        return user_helper(new_user)

    return user_helper(user)


@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """Update the current user's profile."""
    update_data = {k: v for k, v in user_update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    result = await db.users.find_one_and_update(
        {"auth0_id": current_user["sub"]},
        {"$set": update_data},
        return_document=True,
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user_helper(result)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    db=Depends(get_database),
):
    """Get a user's public profile by ID."""
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        user = await db.users.find_one({"auth0_id": user_id})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user_helper(user)
