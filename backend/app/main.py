from fastapi import FastAPI
from app.api.router import router as api_router

app = FastAPI(title='KnowledgeForge API', version='1.0.0')
app.include_router(api_router, prefix='/api')

@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}

