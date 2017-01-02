Highlight selected word
=======================

[![Join the chat at https://gitter.im/jcb91/jupyter_highlight_selected_word](https://badges.gitter.im/jcb91/jupyter_highlight_selected_word.svg)](https://gitter.im/jcb91/jupyter_highlight_selected_word?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![GitHub issues](https://img.shields.io/github/issues/jcb91/jupyter_highlight_selected_word.svg?maxAge=3600)](https://github.com/jcb91/jupyter_highlight_selected_word/issues)


This nbextension highlights all instances of the selected word in either the
current cell's editor, or in any cell in the notebook.
It is based on the CodeMirror addon
[Match Highlighter](https://codemirror.net/demo/matchhighlighter.html),
but now uses its own codebase in order to permit matching across multiple
editors.

There are a few configurable options, all of which sit under the config key
`highlight_selected_word` in the `notebook` config section.


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
  words in the focussed (active) cell
* `highlight_selected_word.highlight_color_blurred` - Color used to highlight
  matching words in blurred (non-active) cells
* `highlight_selected_word.delay` - Wait time (in milliseconds) before
  highlighting the matches
* `highlight_selected_word.words_only` - If true, only highlight matches if the
  selected text is a word
* `highlight_selected_word.min_chars` - Minimum number of characters that must
  be selected for the highlighting behavior to occur
* `highlight_selected_word.show_token` - Token (regex) to highlight when
  nothing is selected

For example, to set the delay to half a second, and limit higlighting to code
cells, we can use the following python snippet:

```python
from notebook.services.config import ConfigManager
cm = ConfigManager()
cm.update('notebook', {'highlight_selected_word': {
    'delay': 500,
    'code_cells_only': True,
}})
```


Feedback
--------

If you have any feedback, or have any problems, please let me know by
[opening an issue](https://github.com/jcb91/jupyter_highlight_selected_word/issues/new)
at the project's
[github repository](https://github.com/jcb91/jupyter_highlight_selected_word).

Thanks!

Josh.
