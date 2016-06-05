#!/usr/bin/env python
"""Setup script for jupyter_highlight_selected_word."""

from setuptools import find_packages, setup

setup(
    name='jupyter_highlight_selected_word',
    version='0.0.2',
    description=('Jupyter notebook extension that enables highighting of every'
                 ' instance of the current word in the editor.'),
    author='Joshua Cooke Barnes',
    author_email='joshuacookebarnes@gmail.com',
    url='https://github.com/jcb91/jupyter_highlight_selected_word.git',
    license='BSD',
    long_description="""
        Jupyter notebook extension that enables the CodeMirror addon "Match
        Highlighter" (see https://codemirror.net/demo/matchhighlighter.html),
        which highlights all instances of the selected word in the current
        editor.

        There are a few configurable options, all of which sit under the config
        key ``highlight_selected_word`` in the ``notebook`` config section.
    """,
    packages=find_packages('src'),
    package_dir={'': 'src'},
    include_package_data=True,
)
