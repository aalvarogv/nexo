import uuid

from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from tests.utils.task import create_random_task


def test_create_task(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"title": "Foo", "description": "Fighters"}
    response = client.post(
        f"{settings.API_V1_STR}/tasks/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["is_completed"] is False
    assert content["due_date"] is None
    assert "id" in content
    assert "owner_id" in content


def test_read_task(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    task = create_random_task(db)
    response = client.get(
        f"{settings.API_V1_STR}/tasks/{task.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == task.title
    assert content["description"] == task.description
    assert content["id"] == str(task.id)
    assert content["owner_id"] == str(task.owner_id)


def test_read_task_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/tasks/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Task not found"


def test_read_task_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    task = create_random_task(db)
    response = client.get(
        f"{settings.API_V1_STR}/tasks/{task.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403
    content = response.json()
    assert content["detail"] == "Not enough permissions"


def test_read_tasks(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_random_task(db)
    create_random_task(db)
    response = client.get(
        f"{settings.API_V1_STR}/tasks/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content["data"]) >= 2


def test_read_tasks_orders_by_due_date(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    later = create_random_task(db)
    sooner = create_random_task(db)
    no_due_date = create_random_task(db)
    client.put(
        f"{settings.API_V1_STR}/tasks/{later.id}",
        headers=superuser_token_headers,
        json={"due_date": "2099-12-31"},
    )
    client.put(
        f"{settings.API_V1_STR}/tasks/{sooner.id}",
        headers=superuser_token_headers,
        json={"due_date": "2099-01-01"},
    )

    response = client.get(
        f"{settings.API_V1_STR}/tasks/",
        headers=superuser_token_headers,
        params={"limit": 1000},
    )
    assert response.status_code == 200
    ids = [item["id"] for item in response.json()["data"]]
    assert ids.index(str(sooner.id)) < ids.index(str(later.id))
    assert ids.index(str(later.id)) < ids.index(str(no_due_date.id))


def test_update_task(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    task = create_random_task(db)
    data = {
        "title": "Updated title",
        "description": "Updated description",
        "is_completed": True,
    }
    response = client.put(
        f"{settings.API_V1_STR}/tasks/{task.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["is_completed"] is True
    assert content["id"] == str(task.id)
    assert content["owner_id"] == str(task.owner_id)


def test_update_task_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/tasks/{uuid.uuid4()}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Task not found"


def test_update_task_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    task = create_random_task(db)
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/tasks/{task.id}",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 403
    content = response.json()
    assert content["detail"] == "Not enough permissions"


def test_delete_task(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    task = create_random_task(db)
    response = client.delete(
        f"{settings.API_V1_STR}/tasks/{task.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Task deleted successfully"


def test_delete_task_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/tasks/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Task not found"


def test_delete_task_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    task = create_random_task(db)
    response = client.delete(
        f"{settings.API_V1_STR}/tasks/{task.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403
    content = response.json()
    assert content["detail"] == "Not enough permissions"
