/* {[The file is published on the basis of YetiForce Public License that can be found in the following directory: licenses/License.html]} */
var app = {
	languageString: [],
	cacheParams: [],
	/**
	 * Function to get the module name. This function will get the value from element which has id module
	 * @return : string - module name
	 */
	getModuleName: function () {
		return app.getMainParams('module');
	},
	/**
	 * Function returns the current view name
	 */
	getViewName: function () {
		return app.getMainParams('view');
	},
	/**
	 * Function returns the javascript controller based on the current view
	 */
	getPageController: function () {
		var moduleName = app.getModuleName();
		var view = app.getViewName()

		var moduleClassName = moduleName + "_" + view + "_Js";
		var extendModules = jQuery('#extendModules').val();
		if (typeof window[moduleClassName] == 'undefined' && extendModules != undefined) {
			moduleClassName = extendModules + "_" + view + "_Js";
		}
		if (typeof window[moduleClassName] == 'undefined') {
			moduleClassName = "Base_" + view + "_Js";
		}
		if (typeof window[moduleClassName] != 'undefined') {
			return new window[moduleClassName]();
		}
	},
	validationEngineOptions: {
		// Avoid scroll decision and let it scroll up page when form is too big
		// Reference: http://www.position-absolute.com/articles/jquery-form-validator-because-form-validation-is-a-mess/
		scroll: false,
		promptPosition: 'topLeft',
		//to support validation for chosen select box
		prettySelect: true,
		useSuffix: "_chosen",
		usePrefix: "s2id_",
	},
	formatDate: function (date) {
		var y = date.getFullYear(),
				m = date.getMonth() + 1,
				d = date.getDate(),
				h = date.getHours(),
				i = date.getMinutes(),
				s = date.getSeconds();
		return y + '-' + this.formatDateZ(m) + '-' + this.formatDateZ(d) + ' ' + this.formatDateZ(h) + ':' + this.formatDateZ(i) + ':' + this.formatDateZ(s);
	},
	formatDateZ: function (i) {
		return (i <= 9 ? '0' + i : i);
	},
	howManyDaysFromDate: function (time) {
		var fromTime = time.getTime();
		var today = new Date();
		var toTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
		return Math.floor(((toTime - fromTime) / (1000 * 60 * 60 * 24))) + 1;
	},
	showSelectElement: function (container) {
		this.showChznSelectElement(container);
		this.showSelect2Element(container);
	},
	showChznSelectElement: function (parent, view, params) {
		var thisInstance = this;
		if (typeof parent == 'undefined') {
			parent = jQuery('body');
		}
		if (typeof params == 'undefined') {
			params = {};
		}
		var selectElement = jQuery('.chzn-select', parent);
		selectElement.each(function () {
			if ($(this).prop("id").length == 0) {
				$(this).attr('id', "sel" + thisInstance.generateRandomChar() + thisInstance.generateRandomChar() + thisInstance.generateRandomChar());
			}
		});
		selectElement.filter('[multiple]').filter('[data-validation-engine*="validate"]').on('change', function (e) {
			jQuery(e.currentTarget).trigger('focusout');
		});

		var params = {
			no_results_text: app.translate('JS_NO_RESULTS_FOUND') + ':'
		};

		var moduleName = app.getModuleName();
		if (selectElement.filter('[multiple]')) {
			params.placeholder_text_multiple = ' ' + app.translate('JS_SELECT_SOME_OPTIONS');
		}
		params.placeholder_text_single = ' ' + app.translate('JS_SELECT_AN_OPTION');
		selectElement.chosen(params);

		selectElement.each(function () {
			var select = $(this);
			// hide selected items in the chosen instance when item is hidden.
			if (select.hasClass('hideSelected')) {
				var ns = [];
				select.find('optgroup,option').each(function (n, e) {
					if (jQuery(this).hasClass('hide')) {
						ns.push(n);
					}
				});
				if (ns.length) {
					select.next().find('.search-choice-close').each(function (n, e) {
						var element = jQuery(this);
						var index = element.data('option-array-index');
						if (jQuery.inArray(index, ns) != -1) {
							element.closest('li').remove();
						}
					})
				}
			}
			if (select.attr('readonly') == 'readonly') {
				select.on('chosen:updated', function () {
					if (select.attr('readonly')) {
						var wasDisabled = select.is(':disabled');
						var selectData = select.data('chosen');
						select.attr('disabled', 'disabled');
						if (typeof selectData == 'object') {
							selectData.search_field_disabled();
						}
						if (wasDisabled) {
							select.attr('disabled', 'disabled');
						} else {
							select.removeAttr('disabled');
						}
					}
				});
				select.trigger('chosen:updated');
			}
		});

		// Improve the display of default text (placeholder)
		var chosenSelectConainer = jQuery('.chosen-container-multi .default').css('width', '100%');
		return chosenSelectConainer;
	},
	showSelect2Element: function (parent, params) {
		var thisInstance = this;
		if (typeof parent == 'undefined') {
			parent = jQuery('body');
		}
		if (typeof params == 'undefined') {
			params = {};
		}
		var selectElement = jQuery('.select2', parent);
		params.language = {};
		//params.theme = "bootstrap";
		params.width = "100%";
		selectElement.each(function () {
			if ($(this).prop("id").length == 0) {
				$(this).attr('id', "sel" + thisInstance.generateRandomChar() + thisInstance.generateRandomChar() + thisInstance.generateRandomChar());
			}
			$(this).select2(params);
		});
	},
	getUrlParam: function (name) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
				sURLVariables = sPageURL.split('&'),
				sParameterName,
				i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === name) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	},
	generateRandomChar: function () {
		var chars, newchar, rand;
		chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
		rand = Math.floor(Math.random() * chars.length);
		return newchar = chars.substring(rand, rand + 1);
	},
	registerSideLoading: function (body) {
		$(document).pjax('a[href]:not(.loadPage)', 'div.bodyContent');
		$(document).on('pjax:complete', function () {
			var pageController = app.getPageController();
			if (pageController)
				pageController.registerEvents();
		})
	},
	translate: function (key) {
		if (app.languageString[key] != undefined) {
			return app.languageString[key];
		} else {
			var strings = jQuery('#js_strings').text();
			if (strings != '') {
				app.languageString = JSON.parse(strings);
				if (key in app.languageString) {
					return app.languageString[key];
				}
			}
		}
		return key;
	},
	registerDataTables: function (table, customParams) {
		if ($.fn.dataTable == undefined) {
			return false;
		}
		if (table.length == 0) {
			return false;
		}
		var params = {language: {
				sLengthMenu: app.translate('JS_S_LENGTH_MENU'),
				sZeroRecords: app.translate('JS_NO_RESULTS_FOUND'),
				sInfo: app.translate('JS_S_INFO'),
				sInfoEmpty: app.translate('JS_S_INFO_EMPTY'),
				sSearch: app.translate('JS_SEARCH'),
				sEmptyTable: app.translate('JS_NO_RESULTS_FOUND'),
				sInfoFiltered: app.translate('JS_S_INFO_FILTERED'),
				sLoadingRecords: app.translate('JS_LOADING_OF_RECORDS'),
				sProcessing: app.translate('JS_LOADING_OF_RECORDS'),
				oPaginate: {
					sFirst: app.translate('JS_S_FIRST'),
					sPrevious: app.translate('JS_S_PREVIOUS'),
					sNext: app.translate('JS_S_NEXT'),
					sLast: app.translate('JS_S_LAST')
				},
				oAria: {
					sSortAscending: app.translate('JS_S_SORT_ASCENDING'),
					sSortDescending: app.translate('JS_S_SORT_DESCENDING')
				}
			}
		}
		if (customParams != undefined) {
			params = jQuery.extend(params, customParams);
		}
		$.extend($.fn.dataTable.defaults, params);
		return table.DataTable();
	},
	getMainParams: function (param, json) {
		if (app.cacheParams[param] == undefined) {
			var value = $('#' + param).val();
			app.cacheParams[param] = value;
		}
		var value = app.cacheParams[param];
		if (json) {
			if (value != '') {
				value = $.parseJSON(value);
			} else {
				value = [];
			}
		}
		return value;
	},
	setMainParams: function (param, value) {
		app.cacheParams[param] = value;
		$('#' + param).val(value);
	},
	showModalWindow: function (data, url, cb, paramsObject) {
		var thisInstance = this;
		var id = 'globalmodal';
		//null is also an object
		if (typeof data == 'object' && data != null && !(data instanceof jQuery)) {
			if (data.id != undefined) {
				id = data.id;
			}
			paramsObject = data.css;
			cb = data.cb;
			url = data.url;
			if (data.sendByAjaxCb != 'undefined') {
				var sendByAjaxCb = data.sendByAjaxCb;
			}
			data = data.data;
		}
		if (typeof url == 'function') {
			if (typeof cb == 'object') {
				paramsObject = cb;
			}
			cb = url;
			url = false;
		} else if (typeof url == 'object') {
			cb = function () {
			};
			paramsObject = url;
			url = false;
		}
		if (typeof cb != 'function') {
			cb = function () {
			}
		}
		if (typeof sendByAjaxCb != 'function') {
			var sendByAjaxCb = function () {
			}
		}

		var container = jQuery('#' + id);
		if (container.length) {
			container.remove();
		}
		container = jQuery('<div></div>');
		container.attr('id', id).addClass('modalContainer');

		var showModalData = function (data) {
			var params = {
				'show': true,
			};
			if (jQuery('#backgroundClosingModal').val() != 1) {
				params.backdrop = 'static';
			}
			if (typeof paramsObject == 'object') {
				container.css(paramsObject);
				params = jQuery.extend(params, paramsObject);
			}
			container.html(data);

			// In a modal dialog elements can be specified which can receive focus even though they are not descendants of the modal dialog. 
			$.fn.modal.Constructor.prototype.enforceFocus = function (e) {
				$(document).off('focusin.bs.modal') // guard against infinite focus loop
						.on('focusin.bs.modal', $.proxy(function (e) {
							if ($(e.target).hasClass('select2-search__field')) {
								return true;
							}
						}, this))
			};
			var modalContainer = container.find('.modal:first');
			modalContainer.modal(params);
			jQuery('body').append(container);
			app.showChznSelectElement(modalContainer.find('select.chzn-select'));
			app.showSelect2Element(modalContainer.find('select.select2'));

			thisInstance.registerDataTables(modalContainer.find('.dataTable'));
			modalContainer.one('shown.bs.modal', function () {
				var backdrop = jQuery('.modal-backdrop');
				if (backdrop.length > 1) {
					jQuery('.modal-backdrop:not(:first)').remove();
				}
				cb(modalContainer);
			})
		}
		if (data) {
			showModalData(data)

		} else {
			jQuery.get(url).then(function (response) {
				showModalData(response);
			});
		}
		container.one('hidden.bs.modal', function () {
			container.remove();
			var backdrop = jQuery('.modal-backdrop');
			var modalContainers = jQuery('.modalContainer');
			if (modalContainers.length == 0 && backdrop.length) {
				backdrop.remove();
			}
			if (backdrop.length > 0) {
				$('body').addClass('modal-open');
			}
		});
		return container;
	},
	hideModalWindow: function (callback, id) {
		if (id == undefined) {
			id = 'globalmodal';
		}
		var container = jQuery('#' + id);
		if (container.length <= 0) {
			return;
		}
		if (typeof callback != 'function') {
			callback = function () {
			};
		}
		var modalContainer = container.find('.modal');
		modalContainer.modal('hide');
		var backdrop = jQuery('.modal-backdrop:last');
		var modalContainers = jQuery('.modalContainer');
		if (modalContainers.length == 0 && backdrop.length) {
			backdrop.remove();
		}
		modalContainer.one('hidden.bs.modal', callback);
	},
}

jQuery(document).ready(function () {
	var container = jQuery('body');
	app.showSelectElement(container);
//	app.registerSideLoading(container);
	// Instantiate Page Controller
	var pageController = app.getPageController();
	if (pageController)
		pageController.registerEvents();
});
