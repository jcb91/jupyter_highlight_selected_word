# coding: utf-8
"""Provides magically-named functions for python-package installation."""

import io
import json

npm_package = json.load(io.open('./package.json', 'r'))

__version__ = npm_package['version']


def _jupyter_nbextension_paths():
    return [dict(
        section='notebook',
        # src is relative to current module
        src='static/highlight_selected_word',
        # dest directory is in the `nbextensions/` namespace
        dest='highlight_selected_word',
        # require is also in the `nbextensions/` namespace
        require='highlight_selected_word/main',
    )]
