import asyncio
import platform
import sys

# CORRECCIÓN DEFINITIVA PARA WINDOWS + PLAYWRIGHT
# Debe ejecutarse antes de que cualquier otra librería inicie el loop
if platform.system() == 'Windows':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

import uvicorn
from fastapi import FastAPI
from app.api.endpoints import router as api_router
from loguru import logger

# Configuración de logs
logger.remove()
logger.add(sys.stderr, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>")

app = FastAPI(
    title="Spanish Plate Scraper API",
    description="Sistema de extracción de fecha de matriculación.",
    version="1.1.0"
)

# Incluir rutas
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "API de Matrículas lista", "docs": "/docs"}

if __name__ == "__main__":
    # Desactivamos reload=True y forzamos loop="asyncio" para evitar conflictos en Windows
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False, loop="asyncio")
