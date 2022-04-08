from traitlets import Unicode
from traitlets.config import Configurable
import pathlib


class SwanProjectsConfig(Configurable):
    """
    Class to parse configuration options from command line.
    """

    stacks_path = Unicode(
        str(pathlib.Path(__file__).parent / "stacks"),
        config=True,
        help="The path to the folder containing configuration of available software stacks",
    )  # type: str

    project_file_name = Unicode(
        "swanproject.json", config=False, help="Project file name."
    ) # type: str

    environment_file_name = Unicode(
        "swan-environment.lock", config=False, help="Environment file name"
    ) # type: str

    userscript_file_name = Unicode(
        ".userscript", config=False, help="User script file name."
    )  # type: str

    forbidden_project_folders = ["", "SWAN_projects"]
