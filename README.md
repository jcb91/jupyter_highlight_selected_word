Highlight selected word
=======================

Enables the CodeMirror addon "[Match Highlighter]", which highlights all
instances of the selected word in the current editor.

[Match Highlighter]: https://codemirror.net/demo/matchhighlighter.html

There are a few configurable options, all of which sit under the config key
`highlight_selected_word` in the `notebook` config section.


Installation
============


Installing files
----------------

First, install the pip package:

```
pip install jupyter_highlight_selected_word
```

Next, if you have jupyter version 4.2 or greater, you can install from the pip
package, directly using jupyter:

```
jupyter nbextension install --py jupyter_highlight_selected_word
```

For jupyter versions before 4.2, you'll need to do a little more work to find
the extension static files. To find the nbextension source directory, you can
use the following one-liner (for a rather stretched definition of 'line'):

```
python -c "import os.path as p; from jupyter_highlight_selected_word import __file__ as f, _jupyter_nbextension_paths as n; print(p.normpath(p.join(p.dirname(f), n()[0]['src'])))"
```

then execute

```
jupyter nbextension install <output source directory>
```

replacing `<output source directory>` with the directory found above.


Enabling the nbextension
------------------------

Once you've installed the nbextension files, you can _enable_ the nbextension,
so that it gets loaded automatically in each notebook:

```
jupyter nbextension enable highlight_selected_word/main
```


Options
=======

Options are stored in the notebook section of the nbconfig.
The easiest way to configure these is using the configuration serverextension
available at https://github.com/ipython-contrib/IPython-notebook-extensions,
but you can also configure them directly with a few lines of python.

The available options are:

* `highlight_selected_word.code_cells_only` - Only apply highlights to editors
  for Code cells, not, for example, Markdown or Raw cells
* `highlight_selected_word.highlight_color` - Color to highlight matching words
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
========

If you have any feedback, or have any problems, please let me know by opening
an [issue] at the project's [github repository].

[issue]: https://github.com/jcb91/jupyter_highlight_selected_word/issues
[github repository]: https://github.com/jcb91/jupyter_highlight_selected_word

Thanks!

Josh.
