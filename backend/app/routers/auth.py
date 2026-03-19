import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user
from app.models.user import User, UserRole
from app.schemas.auth import (
    AuthResponse,
    ChangePasswordRequest,
    LoginRequest,
    LogoutRequest,
    PasswordResetConfirmBody,
    PasswordResetRequestBody,
    RefreshRequest,
    RegisterRequest,
    UpdateMeRequest,
    UserOut,
)
from app.services import auth_service
from app.core.security import verify_password, hash_password

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.login_user(body.email, body.password, db)


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.register_user(body.name, body.email, body.password, db)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(body: LogoutRequest, db: AsyncSession = Depends(get_db)):
    await auth_service.logout_user(body.refreshToken, db)


@router.post("/refresh", response_model=AuthResponse)
async def refresh(body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.refresh_tokens(body.refreshToken, db)


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return _user_to_out(current_user)


@router.patch("/me", response_model=UserOut)
async def update_me(
    body: UpdateMeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if body.name is not None:
        current_user.name = body.name
    if body.avatarUrl is not None:
        current_user.avatar_url = body.avatarUrl

    from datetime import datetime, timezone
    current_user.updated_at = datetime.now(timezone.utc)
    await db.flush()
    return _user_to_out(current_user)


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    body: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(body.currentPassword, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    from datetime import datetime, timezone
    current_user.hashed_password = hash_password(body.newPassword)
    current_user.updated_at = datetime.now(timezone.utc)
    await db.flush()


@router.post("/password-reset/request", status_code=status.HTTP_204_NO_CONTENT)
async def password_reset_request(
    body: PasswordResetRequestBody, db: AsyncSession = Depends(get_db)
):
    # In production, send an email. For now, just acknowledge.
    logger.info(f"Password reset requested for: {body.email}")
    # Always return 204 to avoid email enumeration


@router.post("/password-reset/confirm", status_code=status.HTTP_204_NO_CONTENT)
async def password_reset_confirm(
    body: PasswordResetConfirmBody, db: AsyncSession = Depends(get_db)
):
    # In production, validate token from email link.
    # For demo purposes, return a not-implemented note.
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Password reset via token is not yet implemented in demo mode. Use change-password instead.",
    )


def _user_to_out(user: User) -> UserOut:
    role_map = {
        "super_admin": "Admin",
        "admin": "Admin",
        "team_admin": "Admin",
        "member": "Member",
        "viewer": "Viewer",
        "guest": "Viewer",
    }
    role_val = user.role.value if hasattr(user.role, "value") else str(user.role)
    return UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        role=role_map.get(role_val, "Member"),
        avatarUrl=user.avatar_url,
        createdAt=user.created_at,
        updatedAt=user.updated_at,
    )
