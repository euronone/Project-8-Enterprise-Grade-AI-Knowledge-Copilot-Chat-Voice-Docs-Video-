"""
Seed script — creates a demo user in the database.

Usage:
    python seed.py

Prerequisites:
    - Database must be running (docker-compose up db)
    - Tables must be created (start the API once, or run alembic upgrade head)
"""

import asyncio
import sys
import os

# Ensure we can import from app/
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


async def main():
    from app.database import AsyncSessionLocal, init_db
    from app.models.user import User, UserRole
    from app.core.security import hash_password
    from sqlalchemy import select

    print("Initializing database tables...")
    await init_db()

    async with AsyncSessionLocal() as session:
        # Check if demo user already exists
        result = await session.execute(
            select(User).where(User.email == "demo@knowledgeforge.ai")
        )
        existing = result.scalar_one_or_none()

        if existing:
            print(f"Demo user already exists: {existing.email} (id={existing.id})")
            print("Skipping seed.")
            return

        # Create demo user
        demo_user = User(
            name="Demo User",
            email="demo@knowledgeforge.ai",
            hashed_password=hash_password("Demo1234!"),
            role=UserRole.admin,
            is_active=True,
        )
        session.add(demo_user)
        await session.commit()
        await session.refresh(demo_user)

        print("\n✓ Demo user created successfully!")
        print(f"  ID:       {demo_user.id}")
        print(f"  Name:     {demo_user.name}")
        print(f"  Email:    {demo_user.email}")
        print(f"  Password: Demo1234!")
        print(f"  Role:     {demo_user.role.value}")
        print("\nYou can now log in at http://localhost:3000 with these credentials.")


if __name__ == "__main__":
    asyncio.run(main())
