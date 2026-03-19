from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel


class SearchResultItem(BaseModel):
    id: UUID
    documentId: UUID
    documentName: str
    documentType: str
    content: str
    score: float
    highlights: List[str] = []
    url: Optional[str] = None
    createdAt: datetime


class SearchResponse(BaseModel):
    items: List[SearchResultItem]
    total: int
    query: str
    took_ms: int


class SearchRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    page: Optional[int] = 1
    pageSize: Optional[int] = 20
    types: Optional[List[str]] = None


class SavedSearchOut(BaseModel):
    id: UUID
    name: str
    query: str
    filters: Any
    createdAt: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm(cls, ss) -> "SavedSearchOut":
        return cls(
            id=ss.id,
            name=ss.name,
            query=ss.query,
            filters=ss.filters or {},
            createdAt=ss.created_at,
        )


class CreateSavedSearchRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    name: str


class TrendingSearch(BaseModel):
    query: str
    count: int
    trend: str  # "up" | "down" | "stable"
