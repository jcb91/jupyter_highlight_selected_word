#!/usr/bin/env python
"""Setup script for jupyter_highlight_selected_word."""

from setuptools import find_packages, setup

setup(
    name='jupyter_highlight_selected_word',
    version='0.2.0',
    description=(
        'Jupyter notebook extension that enables highlighting every instance '
        'of the current word in the notebook.'
    ),
    author='Joshua Cooke Barnes',
    author_email='joshuacookebarnes@gmail.com',
    url='https://github.com/jcb91/jupyter_highlight_selected_word.git',
    license='BSD',
    long_description="""
Jupyter notebook extension that enables highlighting of all instances of the
currently-selected or cursor-adjecent word in either the current cell's editor,
or in the whole notebook.
Based on the  CodeMirror addon
`Match Highlighter <https://codemirror.net/demo/matchhighlighter.html>`_,
extended to work across multiple editors.
""",
    packages=find_packages('src'),
    package_dir={'': 'src'},
    include_package_data=True,
    data_files=[
      ("etc/jupyter/nbconfig/notebook.d", [
          "jupyter-config/nbconfig/notebook.d/highlight_selected_word.json"
      ]),
    ],
    # we can't be zip safe as we require css & js to be available for
    # copying into jupyter data directories
    zip_safe=False,
)
