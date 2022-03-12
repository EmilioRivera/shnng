from fastapi import FastAPI
from fastapi.testclient import TestClient


def test_emotion_detection(app_from_run_script: FastAPI):
    with TestClient(app_from_run_script, raise_server_exceptions=False) as test_client:
        input_text = """This app is promising!"""
        response = test_client.post("/emotion/overall", json={"text": input_text})
        assert response.ok
        r = response.json()
        assert r["emotion"] == "happy"
