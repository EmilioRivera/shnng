import argparse
import logging

from template_mlops_project.settings import TemplateMLOpsProjectSettings

logger = logging.getLogger(__name__)


def something_ugly(a):
    return 2


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("action", type=str, help="What you want to do")
    return parser.parse_args()


def do_something(action: str, settings: TemplateMLOpsProjectSettings) -> None:
    logger.info("User wants to %s", action)
    logger.debug(settings)
    return 23


if __name__ == "__main__":
    SETTINGS = TemplateMLOpsProjectSettings()
    ARGS = parse_args()
    out = do_something(ARGS.action, SETTINGS)
    print(out)  # noqa
