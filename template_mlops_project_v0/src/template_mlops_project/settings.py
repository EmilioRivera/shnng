from pydantic_settings import BaseSettings, SettingsConfigDict


class TemplateMLOpsProjectSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="APP_")
