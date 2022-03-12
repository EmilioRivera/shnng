from enum import Enum

from pydantic import BaseSettings


class AppEnvironment(str, Enum):
    development = "development"
    production = "production"


class MLAppSettings(BaseSettings):
    environment: AppEnvironment = AppEnvironment.production
    debug: bool = False
