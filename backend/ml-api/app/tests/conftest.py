import pytest

from app.run import app


# TODO: Pass settings
@pytest.fixture
def app_from_run_script():
    # This is the application as it would be created by the run script

    return app
