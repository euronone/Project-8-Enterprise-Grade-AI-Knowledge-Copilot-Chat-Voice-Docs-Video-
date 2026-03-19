from typing import List, Optional
from pydantic import BaseModel


class TimeSeriesPoint(BaseModel):
    date: str
    queries: int
    users: int


class UsageMetrics(BaseModel):
    totalQueries: int
    activeUsers: int
    avgResponseTimeMs: int
    timeSeries: List[TimeSeriesPoint]


class ModelBreakdown(BaseModel):
    model: str
    queries: int
    avgLatencyMs: int


class AIPerformanceMetrics(BaseModel):
    avgQualityScore: float
    citationAccuracy: float
    hallucenationRate: float
    tokenCostUsd: float
    modelBreakdown: List[ModelBreakdown]


class GapTopic(BaseModel):
    topic: str
    count: int


class TopDocument(BaseModel):
    id: str
    name: str
    views: int


class KnowledgeMetrics(BaseModel):
    gapTopics: List[GapTopic]
    staleDocuments: int
    coverageScore: float
    topDocuments: List[TopDocument]


class AnalyticsDashboard(BaseModel):
    usage: UsageMetrics
    aiPerformance: AIPerformanceMetrics
    knowledge: KnowledgeMetrics
