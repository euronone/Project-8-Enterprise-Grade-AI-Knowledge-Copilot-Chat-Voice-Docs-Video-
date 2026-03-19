import logging
import math
import uuid
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_db
from app.models.knowledge import Collection, Connector, ConnectorStatus, Document, DocumentChunk
from app.models.user import User
from app.schemas.chat import PaginatedResponse
from app.schemas.knowledge import (
    ChunkOut,
    CollectionOut,
    ConnectorOut,
    CreateCollectionRequest,
    CreateConnectorRequest,
    DocumentOut,
    KnowledgeStats,
)
from app.services import document_service

logger = logging.getLogger(__name__)

router = APIRouter()


# ── Documents ─────────────────────────────────────────────────────────────────

@router.get("/documents", response_model=PaginatedResponse)
async def list_documents(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    documentType: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(Document).where(Document.user_id == current_user.id)

    if search:
        q = q.where(Document.name.ilike(f"%{search}%"))
    if status:
        q = q.where(Document.status == status)
    if documentType:
        q = q.where(Document.file_type == documentType)

    q = q.order_by(Document.created_at.desc())

    count_q = select(func.count()).select_from(q.subquery())
    total = (await db.execute(count_q)).scalar() or 0

    offset = (page - 1) * pageSize
    result = await db.execute(q.offset(offset).limit(pageSize))
    documents = result.scalars().all()

    items = [DocumentOut.from_orm(d) for d in documents]
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=math.ceil(total / pageSize) if total > 0 else 1,
    )


@router.get("/documents/{document_id}", response_model=DocumentOut)
async def get_document(
    document_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    doc = await _get_user_document(document_id, current_user.id, db)
    return DocumentOut.from_orm(doc)


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    doc = await _get_user_document(document_id, current_user.id, db)
    # Try to delete physical file
    try:
        import os
        if os.path.exists(doc.file_path):
            os.remove(doc.file_path)
    except Exception as e:
        logger.warning(f"Could not delete file {doc.file_path}: {e}")
    await db.delete(doc)
    await db.flush()


@router.get("/documents/{document_id}/chunks", response_model=PaginatedResponse)
async def list_document_chunks(
    document_id: uuid.UUID,
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_user_document(document_id, current_user.id, db)

    q = (
        select(DocumentChunk)
        .where(DocumentChunk.document_id == document_id)
        .order_by(DocumentChunk.chunk_index.asc())
    )

    count_q = select(func.count()).select_from(q.subquery())
    total = (await db.execute(count_q)).scalar() or 0

    offset = (page - 1) * pageSize
    result = await db.execute(q.offset(offset).limit(pageSize))
    chunks = result.scalars().all()

    items = [ChunkOut.from_orm(c) for c in chunks]
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=math.ceil(total / pageSize) if total > 0 else 1,
    )


@router.post("/documents/upload")
async def upload_documents(
    files: List[UploadFile] = File(...),
    collectionId: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    documents = await document_service.upload_documents(
        files=files,
        user=current_user,
        collection_id=collectionId,
        tags=tags,
        db=db,
    )
    return [DocumentOut.from_orm(d) for d in documents]


# ── Collections ───────────────────────────────────────────────────────────────

@router.get("/collections")
async def list_collections(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Collection)
        .where(Collection.user_id == current_user.id)
        .order_by(Collection.created_at.desc())
    )
    collections = result.scalars().all()

    # Load document counts
    out = []
    for col in collections:
        count_result = await db.execute(
            select(func.count(Document.id)).where(Document.collection_id == col.id)
        )
        doc_count = count_result.scalar() or 0
        out.append(
            CollectionOut(
                id=col.id,
                name=col.name,
                description=col.description,
                color=col.color,
                documentCount=doc_count,
                createdAt=col.created_at,
            )
        )
    return out


@router.post("/collections", response_model=CollectionOut, status_code=status.HTTP_201_CREATED)
async def create_collection(
    body: CreateCollectionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    col = Collection(
        user_id=current_user.id,
        name=body.name,
        description=body.description,
        color=body.color or "#6366f1",
    )
    db.add(col)
    await db.flush()
    return CollectionOut(
        id=col.id,
        name=col.name,
        description=col.description,
        color=col.color,
        documentCount=0,
        createdAt=col.created_at,
    )


# ── Connectors ────────────────────────────────────────────────────────────────

@router.get("/connectors")
async def list_connectors(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Connector)
        .where(Connector.user_id == current_user.id)
        .order_by(Connector.created_at.desc())
    )
    connectors = result.scalars().all()
    return [ConnectorOut.from_orm(c) for c in connectors]


@router.post("/connectors", response_model=ConnectorOut, status_code=status.HTTP_201_CREATED)
async def create_connector(
    body: CreateConnectorRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    connector = Connector(
        user_id=current_user.id,
        type=body.type,
        name=body.name,
        config=body.config or {},
        status=ConnectorStatus.connected,
    )
    db.add(connector)
    await db.flush()
    return ConnectorOut.from_orm(connector)


@router.post("/connectors/{connector_id}/sync")
async def sync_connector(
    connector_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from datetime import datetime, timezone
    connector = await _get_user_connector(connector_id, current_user.id, db)
    connector.status = ConnectorStatus.syncing
    connector.last_sync_at = datetime.now(timezone.utc)
    await db.flush()

    try:
        if connector.type == "figma":
            chunks_created = await _sync_figma(connector, current_user.id, db)
            connector.status = ConnectorStatus.connected
            await db.flush()
            return {"message": f"Figma sync complete: {chunks_created} chunks indexed", "connectorId": str(connector_id)}

        # Generic / unimplemented connector types — mark connected without real sync
        connector.status = ConnectorStatus.connected
        await db.flush()
        return {"message": "Sync initiated", "connectorId": str(connector_id)}
    except Exception as exc:
        logger.exception("Connector sync failed: %s", exc)
        connector.status = ConnectorStatus.error
        await db.flush()
        raise HTTPException(status_code=500, detail=str(exc))


async def _sync_figma(connector: "Connector", user_id: uuid.UUID, db: AsyncSession) -> int:
    """
    Fetch a Figma file via the REST API and store its content as DocumentChunks
    so it becomes searchable via RAG.
    Returns the number of chunks created.
    """
    import httpx

    cfg: Dict[str, Any] = connector.config or {}
    token: str = cfg.get("accessToken", "")
    file_url: str = cfg.get("fileUrl", "")

    if not token:
        raise ValueError("Figma access token missing in connector config")
    if not file_url:
        raise ValueError("Figma file URL missing in connector config")

    # Extract file key from URL  e.g. https://www.figma.com/file/ABCD1234/...
    # or https://www.figma.com/design/ABCD1234/...
    import re
    m = re.search(r"figma\.com/(?:file|design|make|board)/([A-Za-z0-9]+)", file_url)
    if not m:
        raise ValueError(f"Cannot extract file key from URL: {file_url}")
    file_key = m.group(1)

    headers = {"X-Figma-Token": token}
    async with httpx.AsyncClient(timeout=30) as client:
        # Verify token & fetch file
        resp = await client.get(f"https://api.figma.com/v1/files/{file_key}", headers=headers)
        if resp.status_code == 403:
            raise ValueError("Invalid Figma token or no access to this file")
        if resp.status_code != 200:
            raise ValueError(f"Figma API error {resp.status_code}: {resp.text[:200]}")
        file_data = resp.json()

    file_name: str = file_data.get("name", "Figma File")

    # Extract text content from the node tree
    chunks_text: List[str] = []
    _extract_figma_text(file_data.get("document", {}), chunks_text, path="")

    if not chunks_text:
        chunks_text = [f"Figma file '{file_name}' (file key: {file_key}) — no text nodes found."]

    # Delete previous documents from this connector (re-sync)
    existing = await db.execute(
        select(Document).where(
            Document.user_id == user_id,
            Document.name == f"[Figma] {file_name}",
        )
    )
    for old_doc in existing.scalars().all():
        await db.delete(old_doc)
    await db.flush()

    # Create a Document record to group the chunks
    doc = Document(
        user_id=user_id,
        name=f"[Figma] {file_name}",
        original_name=f"{file_name}.figma",
        file_path=f"figma://{file_key}",
        file_type="figma",
        file_size=len("\n".join(chunks_text)),
        status="ready",
        word_count=sum(len(t.split()) for t in chunks_text),
    )
    db.add(doc)
    await db.flush()

    # Store as chunks
    for idx, text in enumerate(chunks_text):
        chunk = DocumentChunk(
            document_id=doc.id,
            content=text,
            chunk_index=idx,
            token_count=len(text.split()),
        )
        db.add(chunk)

    await db.flush()
    return len(chunks_text)


def _extract_figma_text(node: Dict[str, Any], out: List[str], path: str, depth: int = 0) -> None:
    """Recursively walk a Figma document tree and collect meaningful text."""
    if depth > 12:
        return

    node_type = node.get("type", "")
    name = node.get("name", "")
    chars = node.get("characters", "")  # actual text in TEXT nodes

    # Build a human-readable chunk for meaningful nodes
    if node_type == "TEXT" and chars.strip():
        label = f"{path} > {name}".strip(" >")
        out.append(f"[Text] {label}: {chars.strip()}")
    elif node_type in ("COMPONENT", "COMPONENT_SET") and name:
        desc = node.get("description", "")
        label = f"{path} > {name}".strip(" >")
        chunk = f"[Component] {label}"
        if desc:
            chunk += f": {desc}"
        out.append(chunk)
    elif node_type in ("FRAME", "GROUP", "SECTION") and name:
        label = f"{path} > {name}".strip(" >")
        out.append(f"[{node_type.capitalize()}] {label}")

    child_path = f"{path} > {name}".strip(" >") if name else path
    for child in node.get("children", []):
        _extract_figma_text(child, out, child_path, depth + 1)


@router.delete("/connectors/{connector_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_connector(
    connector_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    connector = await _get_user_connector(connector_id, current_user.id, db)
    await db.delete(connector)
    await db.flush()


# ── Stats ─────────────────────────────────────────────────────────────────────

@router.get("/stats", response_model=KnowledgeStats)
async def knowledge_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Total documents
    doc_count = (
        await db.execute(
            select(func.count(Document.id)).where(Document.user_id == current_user.id)
        )
    ).scalar() or 0

    # Total chunks
    chunk_count = (
        await db.execute(
            select(func.count(DocumentChunk.id))
            .join(Document, DocumentChunk.document_id == Document.id)
            .where(Document.user_id == current_user.id)
        )
    ).scalar() or 0

    # Storage used
    storage = (
        await db.execute(
            select(func.coalesce(func.sum(Document.file_size), 0))
            .where(Document.user_id == current_user.id)
        )
    ).scalar() or 0

    # Collections
    col_count = (
        await db.execute(
            select(func.count(Collection.id)).where(Collection.user_id == current_user.id)
        )
    ).scalar() or 0

    # Connectors
    connector_count = (
        await db.execute(
            select(func.count(Connector.id)).where(Connector.user_id == current_user.id)
        )
    ).scalar() or 0

    # Last indexed
    last_indexed = (
        await db.execute(
            select(func.max(Document.updated_at)).where(Document.user_id == current_user.id)
        )
    ).scalar()

    return KnowledgeStats(
        totalDocuments=doc_count,
        totalChunks=chunk_count,
        storageUsedBytes=storage,
        totalCollections=col_count,
        totalConnectors=connector_count,
        lastIndexedAt=last_indexed,
    )


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _get_user_document(
    document_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession
) -> Document:
    result = await db.execute(
        select(Document).where(
            Document.id == document_id, Document.user_id == user_id
        )
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


async def _get_user_connector(
    connector_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession
) -> Connector:
    result = await db.execute(
        select(Connector).where(
            Connector.id == connector_id, Connector.user_id == user_id
        )
    )
    connector = result.scalar_one_or_none()
    if not connector:
        raise HTTPException(status_code=404, detail="Connector not found")
    return connector
