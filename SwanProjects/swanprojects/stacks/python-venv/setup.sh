#!/bin/bash

/usr/bin/python3 -m venv "${SWAN_PROJECT_PATH}/swan-venv"

source "${SWAN_PROJECT_PATH}/swan-venv/bin/activate"

pip install ipykernel > /dev/null 2>&1