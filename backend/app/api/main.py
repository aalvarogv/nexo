from fastapi import APIRouter

from app.api.routes import login, private, tasks, users, utils, weather
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(tasks.router)
api_router.include_router(weather.router)


if settings.FASTAPI_ENV == "development":
    api_router.include_router(private.router)
