/**
 * Enable highlighting of matching words in a given editor.
 *
 * This extension enables the CodeMirror feature `highlightSelectionMatches`.
 *
 * Docs for CM options adapted from codemirror/addon/search/match-highlighter.js:
 *
 *  minChars:  the minimum number of characters that must be selected for the
 *             highlighting behavior to occur.
 *     style:  the token style to apply to the matches. This will be prefixed
 *             by "cm-" to create an actual CSS class name.
 * wordsOnly:  if true, the matches will be highlighted only if the selected
 *             text is a word.
 * showToken:  when enabled, will cause the current token to be highlighted
 *             when nothing is selected.
 *     delay:  used to specify how much time to wait, in milliseconds, before
 *             highlighting the matches.
 */

define(function (require, exports, module) {
	'use strict';

	var Jupyter = require('base/js/namespace');
	var Cell = require('notebook/js/cell').Cell;
	var CodeCell = require('notebook/js/codecell').CodeCell;
	var ConfigSection = require('services/config').ConfigSection;

	var codemirror = require('codemirror/lib/codemirror');
	var highlighter = require('codemirror/addon/search/match-highlighter');

	var log_prefix = '[' + module.id.split('/').slice(0, -1).join('/') + ']';
	var menu_toggle_class = 'highlight_selected_word_toggle';

	// Parameters (potentially) stored in server config.
	// This object gets updated on config load.
	var params = {
		enable_on_load : true,
		delay: 100,
		words_only: false,
		min_chars: 2,
		show_token: '\\w',
		highlight_color: '#90EE90',
	};

	function add_menu_item () {
		if ($('#view_menu').find('.' + menu_toggle_class).length < 1) {
			var menu_item = $('<li/>')
				.appendTo('#view_menu');
			var menu_link = $('<a/>')
				.text('Highlight selected word')
				.addClass(menu_toggle_class)
				.attr({
					title: 'Highlight all instances of the selected word in the current editor',
					href: '#',
				})
				.on('click', function () { toggle_highlight_selected(); })
				.appendTo(menu_item);
			$('<i/>')
				.addClass('fa menu-icon pull-right')
				.prependTo(menu_link);
		}
	}

	function toggle_highlight_selected (set_on) {
		set_on = (set_on !== undefined) ? set_on : (params.enable_on_load = !params.enable_on_load);

		var new_opts = set_on ? {
			delay: params.delay,
			wordsOnly: params.words_only,
			minChars: params.min_chars,
			showToken: new RegExp(params.show_token),
		} : false;

		// Change defaults for new cells:
		(params.code_cells_only ? Cell : CodeCell).options_default.cm_config.highlightSelectionMatches = new_opts;

		// And change any existing cells:
		Jupyter.notebook.get_cells().forEach(function (cell, idx, array) {
			if (!params.code_cells_only || cell instanceof CodeCell) {
				cell.code_mirror.setOption('highlightSelectionMatches', new_opts);
			}
		});
		// update menu class
		$('.' + menu_toggle_class + ' > .fa').toggleClass('fa-check', set_on);
		console.log(log_prefix, 'toggled', set_on ? 'on' : 'off');
		return set_on;
	}

	function alter_css ($ownerNode, selectorTextRegexp, style) {
		var ii;
		var stylesheet;
		for (ii = 0; ii < document.styleSheets.length; ii++) {
			if ($ownerNode.is(document.styleSheets[ii].ownerNode)) {
				stylesheet = document.styleSheets[ii];
				break;
			}
		}
		selectorTextRegexp = new RegExp(selectorTextRegexp);
		for (ii = 0; ii < stylesheet.cssRules.length; ii++) {
			if (selectorTextRegexp.test(stylesheet.cssRules[ii].selectorText)) {
				$.extend(stylesheet.cssRules[ii].style, style);
				break;
			}
		}
	}

	function load_extension () {

		// Load css first
		var $stylesheet = $('<link/>')
			.attr({
				id: 'highlight_selected_word_css',
				rel: 'stylesheet',
				type: 'text/css',
				href: require.toUrl('./main.css')
			})
			.appendTo('head');

		add_menu_item();

		// load config & toggle on/off
		new ConfigSection('notebook', {base_url : Jupyter.notebook.base_url})
			.load()
			.then(function (conf_data) {
				$.extend(true, params, conf_data.highlight_selected_word); // update params

				// alter css according to config
				alter_css(
					$stylesheet,
					/^\.CodeMirror-focused\s*\.cm-matchhighlight$/,
					{ backgroundColor: params.highlight_color }
				);

				// set highlight on/off
				toggle_highlight_selected(params.enable_on_load);
			});
	}

	return {
		load_ipython_extension : load_extension
	};
});