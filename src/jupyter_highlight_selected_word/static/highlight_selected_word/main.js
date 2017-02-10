/**
 * Enable highlighting of matching words in cells' CodeMirror editors.
 *
 * This extension was adapted from the CodeMirror addon
 * codemirror/addon/search/match-highlighter.js
 */

define(function (require, exports, module) {
	'use strict';

	var $ = require('jquery');
	var Jupyter = require('base/js/namespace');
	var Cell = require('notebook/js/cell').Cell;
	var CodeCell = require('notebook/js/codecell').CodeCell;
	var ConfigSection = require('services/config').ConfigSection;

	var CodeMirror = require('codemirror/lib/codemirror');

	// The mark-selection addon is need to ensure that the highlighting styles
	// are *not* applied to the actual selection, as otherwise it can become
	// difficult to see which is selected vs just highlighted.
	require('codemirror/addon/selection/mark-selection');

	var mod_name = 'highlight_selected_word';
	var log_prefix = '[' + mod_name + ']';
	var menu_toggle_class = 'highlight_selected_word_toggle';

	// Parameters (potentially) stored in server config.
	// This object gets updated on config load.
	var params = {
		highlight_across_all_cells: true,
		enable_on_load : true,
		code_cells_only: false,
		delay: 100,
		words_only: false,
		min_chars: 2,
		show_token: '\\w',
		highlight_color: '#90EE90',
		highlight_color_blurred: '#BBFFBB',
		highlight_style: 'matchhighlight',
		trim: true,
		use_toggle_hotkey: false,
		toggle_hotkey: 'alt-h',
	};

	// these are set on registering the action(s)
	var action_names = {
		toggle: '',
	};

	/**
	 *  the codemirror matchHighlighter has a separate state object for each cm
	 *  instance, but since our state is global over all cells' editors, we can
	 *  use a single object for simplicity, and don't need to store options
	 *  inside the state, since we have closure-level access to the params
	 *  object above.
	 */
	var globalState = {
		active: false,
		timeout: null, // only want one timeout
		overlay: null, // one overlay suffices, as all cells use the same one
	};

	// define a CodeMirror option for highlighting matches in all cells
	CodeMirror.defineOption("highlightSelectionMatchesInJupyterCells", false, function (cm, val, old) {
		if (old && old != CodeMirror.Init) {
			globalState.active = false;
			if (globalState.overlay) {
				get_relevant_cells().forEach(function (cell, idx, array) {
					cell.code_mirror.removeOverlay(globalState.overlay);
				});
			}
			globalState.overlay = null;
			clearTimeout(globalState.timeout);
			globalState.timeout = null;
			cm.off("cursorActivity", callbackCursorActivity);
			cm.off("focus", callbackOnFocus);
		}
		if (val) {
			if (cm.hasFocus()) {
				globalState.active = true;
				highlightMatchesInAllRelevantCells(cm);
			}
			else {
				cm.on("focus", callbackOnFocus);
			}
			cm.on("cursorActivity", callbackCursorActivity);
		}
	});

	/**
	 *  The functions callbackCursorActivity, callbackOnFocus and
	 *  scheduleHighlight are taken without major unmodified from cm's
	 *  match-highlighter.
	 *  The main difference is using our global state rather than
	 *  match-highlighter's per-cm state, and a different highlighting function
	 *  is scheduled.
	 */
	function callbackCursorActivity (cm) {
		if (globalState.active || cm.hasFocus()) {
			scheduleHighlight(cm);
		}
	}

	function callbackOnFocus (cm) {
		// unlike cm match-highlighter, we *do* want to schedule a highight on
		// focussing the editor
		globalState.active = true;
		scheduleHighlight(cm);
	}

	function scheduleHighlight (cm) {
		clearTimeout(globalState.timeout);
		globalState.timeout = setTimeout(function () { highlightMatchesInAllRelevantCells(cm); }, params.delay);
	}

	/**
	 *  Adapted from cm match-highlighter's highlightMatches, but adapted to
	 *  use our global state and parameters, plus work either for only the
	 *  current editor, or multiple cells' editors.
	 */
	function highlightMatchesInAllRelevantCells (cm) {
		var newOverlay = null;

		if (!cm.somethingSelected() && params.show_token) {
			var re = params.show_token === true ? /[\w$]/ : params.show_token;
			var cur = cm.getCursor(), line = cm.getLine(cur.line), start = cur.ch, end = start;
			while (start && re.test(line.charAt(start - 1))) {
				--start;
			}
			while (end < line.length && re.test(line.charAt(end))) {
				++end;
			}
			if (start < end) {
				newOverlay = makeOverlay(line.slice(start, end), re, params.highlight_style);
			}
		}
		else {
			var from = cm.getCursor("from");
			var to = cm.getCursor("to");
			if (from.line == to.line) {
				if (!params.words_only || isWord(cm, from, to)) {
					var selection = cm.getRange(from, to);
					if (params.trim) {
						selection = selection.replace(/^\s+|\s+$/g, "");
					}
					if (selection.length >= params.min_chars) {
						newOverlay = makeOverlay(selection, false, params.highlight_style);
					}
				}
			}
		}

		var cells = params.highlight_across_all_cells ? get_relevant_cells() : [
			$(cm.getWrapperElement()).closest('.cell').data('cell')
		];
		var oldOverlay = globalState.overlay; // cached for later function
		globalState.overlay = newOverlay;
		cells.forEach(function (cell, idx, array) {
			// cm.operation to delay updating DOM until all work is done
			cell.code_mirror.operation(function () {
				cell.code_mirror.removeOverlay(oldOverlay);
				if (newOverlay) {
					cell.code_mirror.addOverlay(newOverlay);
				}
			});
		});
	}

	/**
	 *  isWord, boundariesAround and makeOverlay come pretty much directly from
	 *  Codemirror/addon/search/matchHighlighter
	 *  since they don't use state or config values.
	 */
	function isWord (cm, from, to) {
		var str = cm.getRange(from, to);
		if (str.match(/^\w+$/) !== null) {
			var pos, chr;
			if (from.ch > 0) {
				pos = {line: from.line, ch: from.ch - 1};
				chr = cm.getRange(pos, from);
				if (chr.match(/\W/) === null) {
					return false;
				}
			}
			if (to.ch < cm.getLine(from.line).length) {
				pos = {line: to.line, ch: to.ch + 1};
				chr = cm.getRange(to, pos);
				if (chr.match(/\W/) === null) {
					return false;
				}
			}
			return true;
		}
		return false;
	}
	function boundariesAround (stream, re) {
		return (!stream.start || !re.test(stream.string.charAt(stream.start - 1))) &&
		  (stream.pos == stream.string.length || !re.test(stream.string.charAt(stream.pos)));
	}
	function makeOverlay (query, hasBoundary, style) {
		return {
			token: function (stream) {
				if (stream.match(query) &&
						(!hasBoundary || boundariesAround(stream, hasBoundary))) {
					return style;
				}
				stream.next();
				if (!stream.skipTo(query.charAt(0))) {
					stream.skipToEnd();
				}
			}
		};
	}

	/**
	 *  Return an array of cells to which match highlighting is relevant,
	 *  dependent on the code_cells_only parameter
	 */
	function get_relevant_cells () {
		var cells = Jupyter.notebook.get_cells();
		var relevant_cells = [];
		for (var ii=0; ii<cells.length; ii++) {
			var cell = cells[ii];
			if (!params.code_cells_only || cell instanceof CodeCell) {
				relevant_cells.push(cell);
			}
		}
		return relevant_cells;
	}

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
		set_on = (set_on !== undefined) ? set_on : !params.enable_on_load;
		// update config to make changes persistent
		if (set_on !== params.enable_on_load) {
			params.enable_on_load = set_on;
			Jupyter.notebook.config.update({highlight_selected_word: {enable_on_load: set_on}});
		}

		// Change defaults for new cells:
		(params.code_cells_only ? Cell : CodeCell).options_default.cm_config.highlightSelectionMatchesInJupyterCells = set_on;

		// And change any existing cells:
		get_relevant_cells().forEach(function (cell, idx, array) {
			cell.code_mirror.setOption('highlightSelectionMatchesInJupyterCells', set_on);
			cell.code_mirror.setOption('styleSelectedText', set_on);
		});
		// update menu class
		$('.' + menu_toggle_class + ' > .fa').toggleClass('fa-check', set_on);
		console.log(log_prefix, 'toggled', set_on ? 'on' : 'off');
		return set_on;
	}

	function register_new_actions () {
		action_names.toggle = Jupyter.keyboard_manager.actions.register({
			handler : function (env) { toggle_highlight_selected(); },
			help : "Toggle highlighting of selected word",
			icon : 'fa-language',
			help_index: 'c1'
		}, 'toggle', mod_name);
	}

	function alter_css ($ownerNode, selectorTextRegexp, style, retries) {
		retries = retries !== undefined ? retries : 10;
		var ii;
		var stylesheet;
		for (ii = 0; ii < document.styleSheets.length; ii++) {
			if ($ownerNode.is(document.styleSheets[ii].ownerNode)) {
				stylesheet = document.styleSheets[ii];
				break;
			}
		}
		if (stylesheet === undefined) {
			if (retries > 0) {
				return setTimeout(function () {
					alter_css($ownerNode, selectorTextRegexp, style, retries - 1);
				}, 1000);
			}
			console.warn("Couldn't find any stylesheets owned by", $ownerNode);
			return;
		}
		selectorTextRegexp = new RegExp(selectorTextRegexp);
		for (ii = 0; ii < stylesheet.cssRules.length; ii++) {
			if (selectorTextRegexp.test(stylesheet.cssRules[ii].selectorText)) {
				$.extend(stylesheet.cssRules[ii].style, style);
				return;
			}
		}
		console.warn("Couldn't find any rule with a selector matching", selectorTextRegexp, 'in', $ownerNode);
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

		// add menu item, as we need it to exist for later
		// toggle_highlight_selected call to set its icon status
		add_menu_item();

		// load config & toggle on/off
		Jupyter.notebook.config.loaded
		.then(function () {
				$.extend(true, params, Jupyter.notebook.config.data.highlight_selected_word);
		}, function on_error (reason) {
			console.warn(log_prefix, 'error loading config:', reason);
		})
		.then(function () {
				params.show_token = params.show_token ? new RegExp(params.show_token): false;

				// alter css according to config
				alter_css(
					$stylesheet,
					/^\.notebook_app\.edit_mode\s+\.CodeMirror:not\(\.CodeMirror-focused\)\s+.cm-matchhighlight/,
					{ backgroundColor: params.highlight_color_blurred }
				);
				alter_css(
					$stylesheet,
					/^\.notebook_app\.edit_mode\s+\.CodeMirror\.CodeMirror-focused\s+.cm-matchhighlight/,
					{ backgroundColor: params.highlight_color }
				);

				// set highlight on/off
				toggle_highlight_selected(params.enable_on_load);
		})
		.then(register_new_actions)
		// finally log any error we encountered
		.catch(function on_error (reason) { console.warn(log_prefix, 'error loading:', reason); });
	}

	return {
		load_ipython_extension : load_extension
	};
});