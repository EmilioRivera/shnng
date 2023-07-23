from template_mlops_project.settings import TemplateMLOpsProjectSettings
from template_mlops_project.something import do_something


def test_something_return_lucky_number():
    assert do_something("cry", TemplateMLOpsProjectSettings()) == 23
