# SlugGram Backend

Python FastAPI backend with MongoDB for the SlugGram social network.

## Tech Stack

- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **Auth0** - Authentication (JWT verification)

## Setup

### 1. Install MongoDB

**macOS (with Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt install mongodb
sudo systemctl start mongodb
```

**Or use MongoDB Atlas (cloud):**
- Create a free cluster at https://www.mongodb.com/atlas
- Get your connection string

### 2. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=sluggram
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_API_AUDIENCE=https://sluggram-api
```

### 5. Run the Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at http://localhost:8000

## API Endpoints

### Health Check
- `GET /` - Server status
- `GET /api/health` - API health check

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/{user_id}` - Get user by ID

### Posts
- `GET /api/posts/` - Get all posts (optional `?post_type=` filter)
- `POST /api/posts/` - Create a new post
- `GET /api/posts/{post_id}` - Get single post
- `DELETE /api/posts/{post_id}` - Delete post (author only)
- `POST /api/posts/{post_id}/like` - Toggle like
- `POST /api/posts/{post_id}/comment` - Add comment
- `POST /api/posts/{post_id}/save` - Toggle save
- `POST /api/posts/{post_id}/join` - Toggle study group membership
- `GET /api/posts/user/{user_id}` - Get user's posts
- `GET /api/posts/saved/me` - Get saved posts

### Upload
- `POST /api/upload/image` - Upload image (max 10MB)
- `POST /api/upload/video` - Upload video (max 100MB)
- `GET /api/upload/files/{type}/{filename}` - Serve uploaded files

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

The backend will automatically fall back to localStorage mode on the frontend if:
- The backend is not running
- Auth0 is not configured
- There's any connection error

This allows development without the backend running.
