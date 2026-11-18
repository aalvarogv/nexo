from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_current_user
from app.models import WeatherCurrent, WeatherDaily, WeatherPublic

router = APIRouter(prefix="/weather", tags=["weather"])

# Madrid is the only location Nexo tracks for now; no user-configurable
# location yet.
MADRID_LATITUDE = 40.4168
MADRID_LONGITUDE = -3.7038

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


def _fetch_forecast() -> dict[str, Any]:
    params: dict[str, str | float] = {
        "latitude": MADRID_LATITUDE,
        "longitude": MADRID_LONGITUDE,
        "current": "temperature_2m,weather_code",
        "daily": "temperature_2m_max,temperature_2m_min,weather_code",
        "timezone": "Europe/Madrid",
    }
    with httpx.Client() as client:
        response = client.get(OPEN_METEO_URL, params=params, timeout=10)
        response.raise_for_status()
        return response.json()


@router.get("/", response_model=WeatherPublic, dependencies=[Depends(get_current_user)])
def read_weather() -> Any:
    """
    Get today's weather for Madrid.
    """
    try:
        forecast = _fetch_forecast()
    except httpx.HTTPError as error:
        raise HTTPException(
            status_code=502, detail="Weather service unavailable"
        ) from error

    current = forecast["current"]
    daily = forecast["daily"]
    return WeatherPublic(
        current=WeatherCurrent(
            temperature_c=current["temperature_2m"],
            weather_code=current["weather_code"],
        ),
        today=WeatherDaily(
            date=daily["time"][0],
            temperature_min_c=daily["temperature_2m_min"][0],
            temperature_max_c=daily["temperature_2m_max"][0],
            weather_code=daily["weather_code"][0],
        ),
    )
