from pydantic import BaseModel, Field


class EmotionDetectionTaskModel(BaseModel):
    text: str = Field(
        ..., description="Input provided by the client to run emotion detection on."
    )
    language: str = "autodetect"
