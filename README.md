Highlight selected word
=======================

[![Join the chat at https://gitter.im/jcb91/jupyter_highlight_selected_word](https://badges.gitter.im/jcb91/jupyter_highlight_selected_word.svg)](https://gitter.im/jcb91/jupyter_highlight_selected_word?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![GitHub issues](https://img.shields.io/github/issues/jcb91/jupyter_highlight_selected_word.svg?maxAge=3600)](https://github.com/jcb91/jupyter_highlight_selected_word/issues)

[![GitHub tag](https://img.shields.io/github/tag/jcb91/jupyter_highlight_selected_word.svg?maxAge=3600&label=Github)](https://github.com/jcb91/jupyter_highlight_selected_word/tags)
[![PyPI](https://img.shields.io/pypi/v/jupyter_highlight_selected_word.svg?maxAge=3600)](https://pypi.python.org/pypi/jupyter_highlight_selected_word)
[![Anaconda cloud](https://anaconda.org/conda-forge/jupyter_highlight_selected_word/badges/version.svg)](https://anaconda.org/conda-forge/jupyter_highlight_selected_word)


This nbextension highlights all instances of the selected word in either the
current cell's editor, or in all cells in the notebook.
It is based on the CodeMirror addon
[Match Highlighter](https://codemirror.net/demo/matchhighlighter.html),
but now uses its own codebase in order to permit matching across multiple
editors.

There are a few configurable [options](#Options), all of which sit under the
config key `highlight_selected_word` in the `notebook` config section.


Installation
------------

`jupyter_highlight_selected_word` is available as part of the
[jupyter_contrib_nbextensions](https://github.com/ipython-contrib/jupyter_contrib_nbextensions)
collection. If you want to install this nbextension without the rest of the
contrib collection, read on.

To use the nbextension, there are three basic steps:

1.  First, install the python package:

        pip install jupyter_highlight_selected_word

    Or, __for those using conda__, there is now a recipe provided through the excellent excellent [conda-forge](https://conda-forge.org/) [channel](https://anaconda.org/conda-forge), which also performs the install into the conda env's jupyter data directory, so you can skip step 2. To install the conda recipe, use

        conda install -c conda-forge jupyter_highlight_selected_word

2.  Next, install javascript files from the python package into a jupyter data
    directory. For those using conda, the conda install performs this step
    automatically, so you can skip this.

    If you have jupyter version 4.2 or greater, you can install directly
    using jupyter:

        jupyter nbextension install --py jupyter_highlight_selected_word

    For jupyter versions before 4.2, you'll need to do a little more work to
    find the nbextension's static files. To find the nbextension source
    directory, you can use the following one-liner
    (for a rather stretched definition of 'line'):

        python -c "import os.path as p; from jupyter_highlight_selected_word import __file__ as f, _jupyter_nbextension_paths as n; print(p.normpath(p.join(p.dirname(f), n()[0]['src'])))"

    then execute

        jupyter nbextension install <output source directory>

    replacing `<output source directory>` with the directory found above.


3.  Enable the nbextension, so that it gets loaded automatically in each
    notebook:

        jupyter nbextension enable highlight_selected_word/main  # can be skipped for notebook >=5.3


Options
-------

Options are stored in the notebook section of the nbconfig.
The easiest way to configure these is using the
[jupyter_nbextensions_configurator](https://github.com/Jupyter-contrib/jupyter_nbextensions_configurator)
serverextension, but you can also configure them directly with a few lines of
python.

The available options are:

* `highlight_selected_word.highlight_across_all_cells` - if `true`, (default)
  highlight matches across all cells. If `false`, only matches within the
  currently selected cell will be highlighted.

* `highlight_selected_word.code_cells_only` - Only apply highlights to editors
  for Code cells, not, for example, Markdown or Raw cells

* `highlight_selected_word.highlight_color` - Color used to highlight matching
  words in the focused (active) cell

* `highlight_selected_word.highlight_color_blurred` - Color used to highlight
  matching words in blurred (non-active) cells

* `highlight_selected_word.outlines_only` - Highlight words using just an
  outline, rather than the background color. In contrast to the default
  background-color highlight, the outline-only is also applied to the
  currently-selected word

* `highlight_selected_word.outline_width` - Width, in pixels, of the outline
  used to highlight words when the outline-only setting (above) is selected.
  Defaults to 1.

* `highlight_selected_word.delay` - Wait time (in milliseconds) before
  highlighting the matches

* `highlight_selected_word.words_only` - If true, only highlight matches if the
  selected text is a word

* `highlight_selected_word.highlight_only_whole_words` - Only highlight matches
  which are surrounded by non-word characters. This will use the token
  `highlight_selected_word.show_token` to identify word characters, if it's
  set, otherwise the regular expression `[\w$]` will be used.

* `highlight_selected_word.show_token` - Token (regex) to identify word
  characters, used to determine what to highlight when nothing is selected.
  If blank, nothing is highlighted when nothing is selected.
  This regex is also used to determine word boundaries for
  `highlight_selected_word.highlight_only_whole_words`.

* `highlight_selected_word.min_chars` - Minimum number of characters that must
  be selected for the highlighting behavior to occur

* `highlight_selected_word.use_toggle_hotkey` - Bind the
  `highlight_selected_word.toggle` action to a hotkey. Defaults to `false`.

* `highlight_selected_word.toggle_hotkey` - Which hotkey to bind to the
  `highlight_selected_word.toggle` action (if set to use, see item above).
  Defaults to `alt-h`

* `highlight_selected_word.only_cells_in_scroll` - Only apply highlights to
  editors which are visible in the scrolled view. This may offer performance
  benefits for larger notebooks, but may be annoying if you're doing a lot of
  scrolling :/

* `highlight_selected_word.scroll_min_delay` - Minimum delay in ms between
  updating highlights on scrolling the notebook (used only if
  `highlight_selected_word.only_cells_in_scroll` is `true`).
  If set to zero, no update is done on scroll.

For example, to set the delay to half a second, and limit highlighting to code
cells, we can use the following python snippet:

```python
from notebook.services.config import ConfigManager
cm = ConfigManager()
cm.update('notebook', {'highlight_selected_word': {
    'delay': 500,
    'code_cells_only': True,
}})
```


Changes
-------

### 0.2.0

  * optionally hide the selections in non-focussed cells (through CSS classes)
  * bugfix for overlays not being removed correctly
  * alter CSS mechanism, so we create a `<style>` in JS, rather than requesting a separate file.

### 0.1.1

  * bugfix for potential issue in firefox
  * bugfix to list package as not `zip_safe`

### 0.1.0

  * update compatibility to include notebook 5
  * add options to limit highlighting to cells which are currently visible in
    the scrolled view, which may offer performance benefits.
  * Add options to allow highlighting words using an outline, rather than the
    background color.

### 0.0.11

  * Bugfix: hotkey was not being bound.
  * Bugfix: apply codemirror default settings to correct cell types

### 0.0.10

 * Bugfix: ensure `styleSelectedText` CodeMirror option gets set in default
   config for new cells
 * Don't highlight selected text, even in edit mode (non-focussed cells)

### 0.0.9

 * Limit highlighting to whole words, from a suggestion by
   [@hiiwave](https://github.com/hiiwave).
   This is now the default behaviour, but the option is configurable
   to ignore this limitation, reverting to the previous behaviour.

### 0.0.8

 * Prevent highlighting the currently-selected text, to make it clearer where
   the cursor is
 * Make highlighting on/off state persistent by writing any changes to config
 * New jupyter action to toggle highlighting on/off state
 * New optional hotkey to toggle highlighting on/off state
 * Readme & docs updates

### 0.0.7

 * Enable highlighting across all cells, not just the currently-active editor

### 0.0.6

 * Readme updates

### 0.0.5

* added conda-forge recipe


Feedback
--------

If you have any feedback, or have any problems, please let me know by
[opening an issue](https://github.com/jcb91/jupyter_highlight_selected_word/issues/new)
at the project's
[github repository](https://github.com/jcb91/jupyter_highlight_selected_word).

Thanks!

Josh.
