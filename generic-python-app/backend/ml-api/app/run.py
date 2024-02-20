from app.app import create_app
from app.core.settings import MLAppSettings

# TODO: Add way to make this more configurable
# e.g. with _env_file
settings_for_app = MLAppSettings()

app = create_app(settings_for_app)
