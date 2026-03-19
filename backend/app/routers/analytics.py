"""
Analytics router — returns realistic mock analytics data seeded from the current date.
"""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.analytics import (
    AIPerformanceMetrics,
    AnalyticsDashboard,
    GapTopic,
    KnowledgeMetrics,
    ModelBreakdown,
    TimeSeriesPoint,
    TopDocument,
    UsageMetrics,
)

router = APIRouter()


def _generate_time_series(start_date: datetime, end_date: datetime) -> list[TimeSeriesPoint]:
    """Generate daily time series between two dates."""
    points = []
    current = start_date
    base_queries = 45
    base_users = 8

    day_num = 0
    while current <= end_date:
        # Add some variation based on day of week and progression
        day_of_week = current.weekday()
        weekend_factor = 0.3 if day_of_week >= 5 else 1.0
        growth_factor = 1 + (day_num * 0.02)

        queries = max(1, int(base_queries * weekend_factor * growth_factor + (day_num % 7) * 3))
        users = max(1, int(base_users * weekend_factor * growth_factor))

        points.append(
            TimeSeriesPoint(
                date=current.strftime("%Y-%m-%d"),
                queries=queries,
                users=users,
            )
        )
        current += timedelta(days=1)
        day_num += 1

    return points


def _build_usage_metrics(start_date: str, end_date: str, granularity: str) -> UsageMetrics:
    try:
        start = datetime.fromisoformat(start_date) if start_date else datetime.now(timezone.utc) - timedelta(days=7)
        end = datetime.fromisoformat(end_date) if end_date else datetime.now(timezone.utc)
    except (ValueError, TypeError):
        start = datetime.now(timezone.utc) - timedelta(days=7)
        end = datetime.now(timezone.utc)

    time_series = _generate_time_series(start, end)
    total_queries = sum(p.queries for p in time_series)
    active_users = max(p.users for p in time_series) if time_series else 0

    return UsageMetrics(
        totalQueries=total_queries,
        activeUsers=active_users,
        avgResponseTimeMs=1240,
        timeSeries=time_series,
    )


def _build_ai_performance() -> AIPerformanceMetrics:
    return AIPerformanceMetrics(
        avgQualityScore=0.87,
        citationAccuracy=0.92,
        hallucenationRate=0.03,
        tokenCostUsd=12.47,
        modelBreakdown=[
            ModelBreakdown(model="claude-sonnet-4-6", queries=312, avgLatencyMs=1180),
            ModelBreakdown(model="claude-3-5-sonnet", queries=148, avgLatencyMs=1340),
            ModelBreakdown(model="claude-3-haiku", queries=67, avgLatencyMs=620),
        ],
    )


def _build_knowledge_metrics() -> KnowledgeMetrics:
    return KnowledgeMetrics(
        gapTopics=[
            GapTopic(topic="Competitive Analysis", count=23),
            GapTopic(topic="Pricing Strategy", count=18),
            GapTopic(topic="Customer Segmentation", count=15),
            GapTopic(topic="Technical Architecture", count=12),
            GapTopic(topic="Compliance Documentation", count=9),
        ],
        staleDocuments=7,
        coverageScore=0.73,
        topDocuments=[
            TopDocument(id="doc-1", name="Product Roadmap Q2 2025.pdf", views=142),
            TopDocument(id="doc-2", name="Engineering Handbook.docx", views=98),
            TopDocument(id="doc-3", name="Sales Playbook 2025.pdf", views=87),
            TopDocument(id="doc-4", name="Onboarding Guide.pdf", views=76),
            TopDocument(id="doc-5", name="API Documentation.md", views=65),
        ],
    )


@router.get("/usage", response_model=UsageMetrics)
async def get_usage(
    startDate: str = Query(""),
    endDate: str = Query(""),
    granularity: str = Query("day"),
    current_user: User = Depends(get_current_user),
):
    return _build_usage_metrics(startDate, endDate, granularity)


@router.get("/ai-performance", response_model=AIPerformanceMetrics)
async def get_ai_performance(current_user: User = Depends(get_current_user)):
    return _build_ai_performance()


@router.get("/knowledge", response_model=KnowledgeMetrics)
async def get_knowledge_metrics(current_user: User = Depends(get_current_user)):
    return _build_knowledge_metrics()


@router.get("/dashboard", response_model=AnalyticsDashboard)
async def get_dashboard(current_user: User = Depends(get_current_user)):
    end = datetime.now(timezone.utc)
    start = end - timedelta(days=7)

    return AnalyticsDashboard(
        usage=_build_usage_metrics(start.isoformat(), end.isoformat(), "day"),
        aiPerformance=_build_ai_performance(),
        knowledge=_build_knowledge_metrics(),
    )
