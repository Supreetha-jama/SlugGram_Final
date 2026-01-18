from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
import os
import uuid
from pathlib import Path
from ..config import get_settings
from ..utils.auth import get_current_user

router = APIRouter(prefix="/upload", tags=["upload"])
settings = get_settings()

# Create upload directories
UPLOAD_DIR = Path(settings.upload_dir)
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "images").mkdir(exist_ok=True)
(UPLOAD_DIR / "videos").mkdir(exist_ok=True)


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """Upload an image file."""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}",
        )

    # Validate file size (10MB max for images)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 10MB for images.",
        )

    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = UPLOAD_DIR / "images" / filename

    # Save file
    with open(file_path, "wb") as f:
        f.write(contents)

    return {
        "url": f"/upload/files/images/{filename}",
        "filename": filename,
    }


@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """Upload a video file."""
    # Validate file type
    allowed_types = ["video/mp4", "video/webm", "video/quicktime"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}",
        )

    # Validate file size (100MB max for videos)
    contents = await file.read()
    if len(contents) > settings.max_file_size:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 100MB for videos.",
        )

    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "mp4"
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = UPLOAD_DIR / "videos" / filename

    # Save file
    with open(file_path, "wb") as f:
        f.write(contents)

    return {
        "url": f"/upload/files/videos/{filename}",
        "filename": filename,
    }


@router.get("/files/{file_type}/{filename}")
async def get_file(file_type: str, filename: str):
    """Serve uploaded files."""
    if file_type not in ["images", "videos"]:
        raise HTTPException(status_code=400, detail="Invalid file type")

    file_path = UPLOAD_DIR / file_type / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)
