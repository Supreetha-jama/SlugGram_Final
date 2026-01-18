from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx
from functools import lru_cache
from ..config import get_settings

settings = get_settings()
security = HTTPBearer()


@lru_cache()
def get_jwks():
    """Fetch JWKS from Auth0."""
    jwks_url = f"https://{settings.auth0_domain}/.well-known/jwks.json"
    response = httpx.get(jwks_url)
    return response.json()


def get_public_key(token: str):
    """Get the public key for verifying the JWT."""
    jwks = get_jwks()
    unverified_header = jwt.get_unverified_header(token)

    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            return {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
    return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Verify Auth0 token and return user info."""
    token = credentials.credentials

    try:
        # For development, allow a simple token format
        if settings.auth0_domain == "" or settings.auth0_domain == "your-tenant.us.auth0.com":
            # Development mode - decode without verification
            payload = jwt.get_unverified_claims(token)
            return {
                "sub": payload.get("sub", ""),
                "email": payload.get("email", ""),
                "name": payload.get("name", ""),
                "picture": payload.get("picture", ""),
            }

        # Production mode - verify with Auth0
        public_key = get_public_key(token)
        if not public_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to find appropriate key",
            )

        payload = jwt.decode(
            token,
            public_key,
            algorithms=[settings.auth0_algorithms],
            audience=settings.auth0_api_audience,
            issuer=f"https://{settings.auth0_domain}/",
        )

        return {
            "sub": payload.get("sub", ""),
            "email": payload.get("email", ""),
            "name": payload.get("name", ""),
            "picture": payload.get("picture", ""),
        }

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
        )
