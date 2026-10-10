from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth
from pydantic import BaseModel
from app.core.firebase import is_mock_mode

security_bearer = HTTPBearer(auto_error=False)


class CurrentUser(BaseModel):
    uid: str
    email: str
    name: str = "Government Administrator"
    role: str = "Government Administrator"
    badge_id: str = "GOV-ADMIN-01"
    department: str = "Ministry of Health & Family Welfare"
    is_demo: bool = False


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> CurrentUser:
    """
    Validates Firebase Auth ID Token.
    In local dev / demo mode, permits demo access if Firebase credentials are not yet configured.
    """
    if not credentials:
        if is_mock_mode():
            # In demo development mode, return default authenticated administrator session
            return CurrentUser(
                uid="USR-ADMIN-DEV",
                email="admin.officer@health.gov.in",
                name="Dr. Arvind Rao",
                role="Chief Medical Officer",
                badge_id="GOV-DELHI-001",
                is_demo=True
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization token. Please sign in via Firebase Auth.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    # Special demo token bypass for local prototype testing
    if token.startswith("demo-") or is_mock_mode():
        return CurrentUser(
            uid="USR-ADMIN-DEMO",
            email="admin.officer@health.gov.in",
            name="Administrative Officer",
            role="Government Administrator",
            badge_id="GOV-ADMIN-2026",
            is_demo=True
        )

    try:
        decoded_token: Dict[str, Any] = firebase_auth.verify_id_token(token)
        uid = decoded_token.get("uid", "")
        email = decoded_token.get("email", "")
        name = decoded_token.get("name", email.split("@")[0].title() if email else "Officer")
        role = decoded_token.get("role", "Government Administrator")
        department = decoded_token.get("department", "Ministry of Health")
        badge_id = decoded_token.get("badge_id", f"GOV-{uid[:6]}")

        return CurrentUser(
            uid=uid,
            email=email,
            name=name,
            role=role,
            department=department,
            badge_id=badge_id,
            is_demo=False
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired Firebase ID token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def require_role(required_role: str):
    """Dependency for Role-Based Access Control (RBAC)."""
    async def role_checker(user: CurrentUser = Depends(get_current_user)):
        if user.is_demo:
            return user
        if user.role != required_role and user.role != "Super Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires '{required_role}' privileges."
            )
        return user
    return role_checker
