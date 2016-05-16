Highlight selected word
=======================

Enables the
CodeMirror addon "[Match Highlighter](https://codemirror.net/demo/matchhighlighter.html)",
which highlights all instances of the selected word in the current editor.

There are a few configurable options, all of which sit under the config key
`highlight_selected_word` in the `notebook` config section.

Parameters
----------
* `highlight_selected_word.code_cells_only` - Only apply highlights to editors for Code cells, not, for example, Markdown or Raw cells
* `highlight_selected_word.highlight_color` - Color to highlight matching words
* `highlight_selected_word.delay` - Wait time (in milliseconds) before highlighting the matches
* `highlight_selected_word.words_only` - If true, only highlight matches if the selected text is a word
* `highlight_selected_word.min_chars` - Minimum number of characters that must be selected for the highlighting behavior to occur
* `highlight_selected_word.show_token` - Token (regex) to highlight when nothing is selected
