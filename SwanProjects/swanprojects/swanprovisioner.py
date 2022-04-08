import shutil
from pathlib import Path
from typing import Any, Dict
import os

from jupyter_client import LocalProvisioner


class SwanProvisioner(LocalProvisioner):
    async def pre_launch(self, **kwargs: Any) -> Dict[str, Any]:

        project_root = self._get_project_root(kwargs["cwd"])

        if project_root:
            kwargs["env"] = dict()
            with open(project_root / "swan-environment.lock") as f:
                for line in f.readlines():
                    name, value = line.rstrip("\n").split("=", 1)
                    self.log.debug("adding %s, %s", name, value)
                    kwargs["env"][name] = value
        else:
            kwargs["env"] = dict(os.environ)

        self.log.debug("adding env to kernel from provisioner", kwargs["env"])
        argv = [
            "/cvmfs/sft.cern.ch/lcg/views/LCG_101swan/x86_64-centos7-gcc8-opt/bin/python3",
            "-m",
            "ipykernel_launcher",
            "-f",
            "{connection_file}",
        ]
        argv[0] = self._get_python(kwargs["env"])
        self.kernel_spec.argv = argv
        return await super().pre_launch(**kwargs)

    def _get_project_root(self, path: str) -> Path:
        cwd = Path(path)
        for parent in [cwd, *cwd.parents]:
            if (parent / "swanproject.json").is_file():
                return parent

    def _get_python(self, env: Dict[str, str]) -> str:
        return shutil.which("python", path=env.get("PATH", None))
