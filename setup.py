#!/usr/bin/env python
"""Setup script for jupyter_highlight_selected_word."""

from setuptools import find_packages, setup

setup(
    name='jupyter_highlight_selected_word',
    version='0.0.1',
    description=('Jupyter notebook extension that enables highighting of every'
                 ' instance of the current word in the editor.'),
    author='Joshua Cooke Barnes',
    author_email='joshuacookebarnes@gmail.com',
    url='https://github.com/jcb91/jupyter_highlight_selected_word.git',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    include_package_data=True,
)
