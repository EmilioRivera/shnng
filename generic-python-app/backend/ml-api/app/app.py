import logging

from fastapi import FastAPI

from app.core.settings import MLAppSettings
from app.routers.emotion_detection.router import emotion_detection_router

logger = logging.getLogger(__name__)


def create_app(settings: MLAppSettings):
    logger.info("Create application with settings:")
    logger.info(settings)

    app = FastAPI(debug=settings.debug)

    app.include_router(emotion_detection_router, prefix="/emotion")

    return app
