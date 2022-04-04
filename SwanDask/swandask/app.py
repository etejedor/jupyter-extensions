import argparse
import logging

from dask_labextension import load_jupyter_server_extension
from tornado import ioloop, web


class WebApp:
    pass


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", default=9191, type=int, action="store", dest="port")
    parser.add_argument("--base_url", default="/", action="store", dest="base_url")
    args = parser.parse_args()

    log = logging.getLogger("tornado.swandask")
    log.name = "SwanDask"
    log.setLevel(logging.INFO)
    log.propagate = True
    log.info(f"Running SwanDask on port {args.port} with base url {args.base_url}")

    app = web.Application(base_url=args.base_url)

    server_app = WebApp()
    server_app.web_app = app
    load_jupyter_server_extension(server_app)

    app.listen(args.port)
    ioloop.IOLoop.current().start()
