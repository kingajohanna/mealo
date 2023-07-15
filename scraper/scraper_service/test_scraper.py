from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_create_recipe():
    url = "https://streetkitchen.hu/instant/egytepsis-kajak/zoldfuszeres-sult-sargarepa/"  # Replace with a valid URL for testing
    payload = {"url": url}
    response = client.post("/", json=payload)
    
    assert "canonical_url" in response.json()
    assert "title" in response.json()
    assert "ingredients" in response.json()
    assert "instructions" in response.json()
    # Add more assertions as needed

