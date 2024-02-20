from fastapi.routing import APIRouter

from app.models.emotion_detection_task_model import EmotionDetectionTaskModel

emotion_detection_router = APIRouter()


@emotion_detection_router.post("/overall")
async def detect_emotion(task: EmotionDetectionTaskModel):
    # TODO
    return {"emotion": "happy"}
