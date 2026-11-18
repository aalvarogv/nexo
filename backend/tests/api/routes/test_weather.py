from unittest.mock import patch

import httpx
from fastapi.testclient import TestClient

from app.core.config import settings

FAKE_FORECAST = {
    "current": {"temperature_2m": 12.3, "weather_code": 2},
    "daily": {
        "time": ["2026-11-18"],
        "temperature_2m_min": [5.1],
        "temperature_2m_max": [15.4],
        "weather_code": [2],
    },
}


def test_read_weather(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    with patch("app.api.routes.weather._fetch_forecast", return_value=FAKE_FORECAST):
        response = client.get(
            f"{settings.API_V1_STR}/weather/",
            headers=superuser_token_headers,
        )
    assert response.status_code == 200
    content = response.json()
    assert content["current"]["temperature_c"] == 12.3
    assert content["current"]["weather_code"] == 2
    assert content["today"]["date"] == "2026-11-18"
    assert content["today"]["temperature_min_c"] == 5.1
    assert content["today"]["temperature_max_c"] == 15.4


def test_read_weather_upstream_error(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    with patch(
        "app.api.routes.weather._fetch_forecast",
        side_effect=httpx.HTTPError("boom"),
    ):
        response = client.get(
            f"{settings.API_V1_STR}/weather/",
            headers=superuser_token_headers,
        )
    assert response.status_code == 502
    assert response.json()["detail"] == "Weather service unavailable"


def test_read_weather_requires_auth(client: TestClient) -> None:
    response = client.get(f"{settings.API_V1_STR}/weather/")
    assert response.status_code == 401
