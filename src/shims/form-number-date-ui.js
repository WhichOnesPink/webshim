jQuery.webshims.register('form-number-date-ui', function($, webshims, window, document, undefined, options){
	"use strict";
	var curCfg;
	var formcfg = $.webshims.formcfg;
	var stopPropagation = function(e){
		e.stopImmediatePropagation(e);
	};
	var labelWidth = (function(){
		var getId = function(){
			return webshims.getID(this);
		};
		return function(element, labels, noFocus){
			$(element).attr({'aria-labelledby': labels.map(getId).get().join(' ')});
			if(!noFocus){
				labels.on('click', function(e){
					element.focus();
					e.preventDefault();
					return false;
				});
			}
		};
	})();
	var addZero = function(val){
		if(!val){return "";}
		val = val+'';
		return val.length == 1 ? '0'+val : val;
	};
	
		
	(function(){
		
		
		formcfg.de = {
			numberFormat: {
				",": ".",
				".": ","
			},
			timeSigns: ":. ",
			numberSigns: ',',
			dateSigns: '.',
			dFormat: ".",
			patterns: {
				d: "dd.mm.yy"
			},
			month:  {
				currentText: 'Aktueller Monat'
			},
			date: {
				close: 'schließen',
				clear: 'Löschen',
				prevText: 'Zurück',
				nextText: 'Vor',
				currentText: 'Heute',
				monthNames: ['Januar','Februar','März','April','Mai','Juni',
				'Juli','August','September','Oktober','November','Dezember'],
				monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun',
				'Jul','Aug','Sep','Okt','Nov','Dez'],
				dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
				dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
				dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
				weekHeader: 'KW',
				firstDay: 1,
				isRTL: false,
				showMonthAfterYear: false,
				yearSuffix: ''
			}
		};
		
		formcfg.en = {
			numberFormat: {
				".": ".",
				",": ","
			},
			numberSigns: '.',
			dateSigns: '/',
			timeSigns: ":. ",
			dFormat: "/",
			patterns: {
				d: "mm/dd/yy"
			},
			month:  {
				currentText: 'This month'
			},
			date: {
				"closeText": "Done",
				clear: 'Clear',
				"prevText": "Prev",
				"nextText": "Next",
				"currentText": "Today",
				"monthNames": ["January","February","March","April","May","June","July","August","September","October","November","December"],
				"monthNamesShort": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
				"dayNames": ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
				"dayNamesShort": ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
				"dayNamesMin": ["Su","Mo","Tu","We","Th","Fr","Sa"],
				"weekHeader": "Wk",
				"firstDay": 0,
				"isRTL": false,
				"showMonthAfterYear": false,
				"yearSuffix": ""
			}
		};
		
		formcfg['en-US'] = formcfg['en-US'] || formcfg['en'];
		formcfg[''] = formcfg[''] || formcfg['en-US'];
		curCfg = formcfg[''];
		
		var createMonthKeys = function(langCfg){
			if(!langCfg.date.monthkeys){
				var create = function(i, name){
					var strNum;
					var num = i + 1;
					strNum = (num < 10) ? '0'+num : ''+num;
					
					langCfg.date.monthkeys[num] = strNum;
					langCfg.date.monthkeys[name] = strNum;
				};
				langCfg.date.monthkeys = {};
				$.each(langCfg.date.monthNames, create);
				$.each(langCfg.date.monthNamesShort, create);
			}
		};
		
		createMonthKeys(curCfg);
		$.webshims.ready('dom-extend', function(){
			$.webshims.activeLang({
				register: 'form-core', 
				callback: function(){
					$.each(arguments, function(i, val){
						if(formcfg[val]){
							curCfg = formcfg[val];
							createMonthKeys(curCfg);
							$(document).triggerHandler('wslocalechange');
							return false;
						}
					});
				}
			});
		});
	})();
		
	
	
	(function(){
		
		
		var mousePress = function(e){
			$(this)[e.type == 'mousepressstart' ? 'addClass' : 'removeClass']('mousepress-ui');
		};
		
		var retDefault = function(val, def){
			if(!(typeof val == 'number' || (val && val == val * 1))){
				return def;
			}
			return val * 1;
		};
		
		var createOpts = ['step', 'min', 'max', 'readonly', 'title', 'disabled', 'tabindex', 'placeholder', 'value'];
		
		var createFormat = function(name){
			if(!curCfg.patterns[name+'Obj']){
				var obj = {};
				$.each(curCfg.patterns[name].split(curCfg[name+'Format']), function(i, name){
					obj[name] = i;
				});
				curCfg.patterns[name+'Obj'] = obj;
			}
		};
		
		var formatVal = {
			number: function(val){
				return (val+'').replace(/\,/g, '').replace(/\./, curCfg.numberFormat['.']);
			},
			time: function(val){
				return val;
			},
			month: function(val, options){
				var names;
				var p = val.split('-');
				if(p[0] && p[1]){
					names = curCfg.date[options.monthNames] || curCfg.date.monthNames;
					p[1] = names[(p[1] * 1) - 1];
					if(p[1]){
						val = curCfg.date.showMonthAfterYear ? p.join(' ') : p[1]+' '+p[0];
					}
				}
				return val;
			},
			date: function(val){
				var p = (val+'').split('-');
				if(p[2] && p[1] && p[0]){
					val = curCfg.patterns.d.replace('yy', p[0] || '');
					val = val.replace('mm', p[1] || '');
					val = val.replace('dd', p[2] || '');
				}
				
				return val;
			}
		};
		
		var parseVal = {
			number: function(val){
				return (val+'').replace(curCfg.numberFormat[','], '').replace(curCfg.numberFormat['.'], '.');
			},
			time: function(val){
				return val;
			},
			month: function(val){
				var p = val.trim().split(/[\s-\/\\]+/);
				if(p.length == 2){
					p[0] = curCfg.date.monthkeys[p[0]] || p[0];
					p[1] = curCfg.date.monthkeys[p[1]] || p[1];
					if(p[1].length == 2){
						val = p[0]+'-'+p[1];
					} else if(p[0].length == 2){
						val = p[1]+'-'+p[0];
					}
				}
				return val;
			},
			date: function(val){
				createFormat('d');
				var i;
				var obj = curCfg.patterns.dObj;
				val = val.split(curCfg.dFormat);
				return val.length == 3 ? ([addZero(val[obj.yy]), addZero(val[obj.mm]), addZero(val[obj.dd])]).join('-') : '';
			}
		};
		
		var steps = {
			number: {
				step: 1
			},
			time: {
				step: 60
			},
			month: {
				step: 1,
				start: new Date()
			},
			date: {
				step: 1,
				start: new Date()
			}
		};
		
		var createAsNumber = (function(){
			var types = {};
			return function(type){
				var input;
				if(!types[type]){
					input = $('<input type="'+type+'" />');
					types[type] = function(val){
						var type = (typeof val == 'object') ? 'valueAsDate' : 'value';
						return input.prop(type, val).prop('valueAsNumber');
					};
				}
				return types[type];
			};
		})();
		
		steps.range = steps.number;
		
		
		var spinBtnProto = {
			_create: function(){
				var i;
				this.type = this.options.type;
				this.orig = this.options.orig;
				this.elemHelper = $('<input type="'+ this.type+'" />');
				this.asNumber = createAsNumber(this.type);
				this.buttonWrapper = $('<span class="input-buttons '+this.type+'-input-buttons"><span unselectable="on" class="step-controls"><span class="step-up"></span><span class="step-down"></span></span></span>')
					.insertAfter(this.element)
				;
				
				this.options.containerElements.push(this.buttonWrapper[0]);
				
				if(typeof steps[this.type].start == 'object'){
					steps[this.type].start = this.asNumber(steps[this.type].start);
				}
				
				
				
				for(i = 0; i < createOpts.length; i++){
					this[createOpts[i]](this.options[createOpts[i]]);
				}
				var elem = this.element.attr('autocomplete', 'off').data('wsspinner', this);
				this.addBindings();
				this._init = true;
			},
			parseValue: function(val){
				return parseVal[this.type](val);
			},
			formatValue: function(val){
				return formatVal[this.type](val, this.options);
			},
			placeholder: function(val){
				var hintValue;
				this.options.placeholder = val;
				if(this.type == 'date'){
					hintValue = (val || '').split('-');
					if(hintValue.length == 3){
						this.options.placeholder = curCfg.patterns.d.replace('yy', hintValue[0]).replace('mm', hintValue[1]).replace('dd', hintValue[2]);
					}
				}
				this.element.prop('placeholder', this.options.placeholder);
			},
			
			addZero: addZero,
			_setStartInRange: function(){
				var start = steps[this.type].start || 0;
				if(this.options.relDefaultValue){
					start += this.options.relDefaultValue;
				}
				if(!isNaN(this.minAsNumber) && start < this.minAsNumber){
					start = this.minAsNumber;
				} else if(!isNaN(this.maxAsNumber) && start > this.maxAsNumber){
					start = this.maxAsNumber;
				}
				this.elemHelper.prop('valueAsNumber', start).prop('value');
				this.options.defValue = this.elemHelper.prop('value');
				
			},
			value: function(val){
				this.valueAsNumber = this.asNumber(val);
				this.options.value = val;
				if(isNaN(this.valueAsNumber)){
					this._setStartInRange();
				} else {
					this.elemHelper.prop('value', val);
					this.options.defValue = "";
				}
				
				this.element.prop('value', formatVal[this.type](val, this.options));
				this._propertyChange('value');
			},
			initDataList: function(){
				var listTimer;
				var that = this;
				var updateList = function(){
					$(that.orig)
						.jProp('list')
						.off('updateDatalist', updateList)
						.on('updateDatalist', updateList)
					;
					clearTimeout(listTimer);
					listTimer = setTimeout(function(){
						if(that.list){
							that.list();
						}
					}, 9);
					
				};
				
				$(this.orig).onTrigger('listdatalistchange', updateList);
			},
			getOptions: function(){
				var options = {};
				var datalist = $(this.orig).jProp('list');
				datalist.find('option').each(function(){
					options[$.prop(this, 'value')] = $.prop(this, 'label');
				});
				return [options, datalist.data('label')];
			},
			list: function(val){
				if(this.type == 'number' || this.type == 'time'){
					this.element.attr('list', $.attr(this.orig, 'list'));
				}
				this.options.list = val;
				this._propertyChange('list');
			},
			_propertyChange: $.noop,
			tabindex: function(val){
				this.options.tabindex = val;
				this.element.prop('tabindex', this.options.tabindex);
			},
			title: function(val){
				this.options.title = val;
				this.element.prop('tabindex', this.options.title);
			},
			
			min: function(val){
				this.elemHelper.prop('min', val);
				this.minAsNumber = this.asNumber(val);
				if(this.valueAsNumber != null && isNaN(this.valueAsNumber)){
					this._setStartInRange();
				}
				this.options.min = val;
				this._propertyChange('min');
			},
			max: function(val){
				this.elemHelper.prop('max', val);
				this.maxAsNumber = this.asNumber(val);
				if(this.valueAsNumber != null && isNaN(this.valueAsNumber)){
					this._setStartInRange();
				}
				this.options.max = val;
				this._propertyChange('max');
			},
			step: function(val){
				var defStep = steps[this.type];
				this.options.step = val;
				this.elemHelper.prop('step', retDefault(val, defStep.step));
			},
			addBindings: function(){
				var isFocused;
				
				var that = this;
				var o = this.options;
				
				var eventTimer = (function(){
					var events = {};
					return {
						init: function(name, curVal, fn){
							if(!events[name]){
								events[name] = {fn: fn};
								$(that.orig).on(name, function(){
									events[name].val = $.prop(that.orig, 'value');
								});
							}
							events[name].val = curVal;
						},
						call: function(name, val){
							if(events[name] && events[name].val != val){
								clearTimeout(events[name].timer);
								events[name].val = val;
								events[name].timer = setTimeout(function(){
									events[name].fn(val, that);
								}, 0);
							}
						}
					};
				})();
				
				var step = {};
				
				var preventBlur = function(e){
					if(preventBlur.prevent){
						e.preventDefault();
						that.element.focus();
						e.stopImmediatePropagation();
						return true;
					}
				};
				var elementEvts = {
					blur: function(e){
						if(!preventBlur(e) && !o.disabled && !o.readonly){
							eventTimer.call('input', $.prop(that.orig, 'value'));
							eventTimer.call('change', $.prop(that.orig, 'value'));
							if(!preventBlur.prevent){
								isFocused = false;
							}
						}
					},
					focus: function(){
						eventTimer.init('input', $.prop(that.orig, 'value'), that.options.input);
						eventTimer.init('change', $.prop(that.orig, 'value'), that.options.change);
						isFocused = true;
					},
					change: function(){
						var val = parseVal[that.type]($.prop(this, 'value'));
						$.prop(that.orig, 'value', val);
						eventTimer.call('input', val);
						eventTimer.call('change', val);
					},
					keydown: function(e){
						if(e.isDefaultPrevented()){return;}
						var stepped = true;
						var code = e.keyCode;
						if (code == 38) {
							step.stepUp();
						} else if (code == 40) {
							step.stepDown();
						} else {
							stepped = false;
						}
						if(stepped){
							e.preventDefault();
						}
					},
					keypress: function(e){
						if(e.isDefaultPrevented()){return;}
						var chr;
						var stepped = true;
						var code = e.keyCode;
						if(!e.ctrlKey && !e.metaKey && curCfg[that.type+'Signs']){
							chr = String.fromCharCode(e.charCode == null ? code : e.charCode);
							stepped = !(chr < " " || (curCfg[that.type+'Signs']+'0123456789').indexOf(chr) > -1);
						} else {
							stepped = false;
						}
						if(stepped){
							e.preventDefault();
						}
					}
				};
				var mouseDownInit = function(){
					if(!o.disabled && !isFocused){
						that.element[0].focus();
					}
					preventBlur.set();
					
					return false;
				};
				
				preventBlur.set = (function(){
					var timer;
					var reset = function(){
						preventBlur.prevent = false;
					};
					return function(){
						clearTimeout(timer);
						preventBlur.prevent = true;
						setTimeout(reset, 9);
					};
				})();
				
				['stepUp', 'stepDown'].forEach(function(name){
					step[name] = function(factor){
						if(!o.disabled && !o.readonly){
							if(!isFocused){
								mouseDownInit();
							}
							var ret = false;
							if (!factor) {
								factor = 1;
							}
							try {
								that.elemHelper[name](factor);
								ret = that.elemHelper.prop('value');
								that.value(ret);
								eventTimer.call('input', ret);
							} catch (er) {}
							return ret;
						}
					};
				});
				
				
				this.buttonWrapper.on('mousedown', mouseDownInit);
				
				this.setInput = function(value){
					that.value(value);
					eventTimer.call('input', value);
				};
				this.setChange = function(value){
					that.setInput(value);
					eventTimer.call('change', value);
				};
				elementEvts[$.fn.mwheelIntent ? 'mwheelIntent' : 'mousewheel'] = function(e, delta){
					if(delta && isFocused && !o.disabled){
						step[delta > 0 ? 'stepUp' : 'stepDown']();
						e.preventDefault();
					}
				};
				this.element.on(elementEvts);
				
				$(document).on('wslocalechange',function(){
					that.value(that.options.value);
				});
				
				$('.step-up', this.buttonWrapper)
					.on({
						'mousepressstart mousepressend': mousePress,
						'mousedown mousepress': function(e){
							step.stepUp();
						}
					})
				;
				$('.step-down', this.buttonWrapper)
					.on({
						'mousepressstart mousepressend': mousePress,
						'mousedown mousepress': function(e){
							step.stepDown();
						}
					})
				;
				
			}
		};
		
		['readonly', 'disabled'].forEach(function(name){
			spinBtnProto[name] = function(val){
				if(this.options[name] != val || !this._init){
					this.options[name] = !!val;
					if(name == 'readonly' && this.options.noInput){
						this.element
							.prop(name, true)
							.attr({'aria-readonly': this.options[name]})
						;
					} else {
						this.element.prop(name, this.options[name]);
					}
					this.buttonWrapper[this.options[name] ? 'addClass' : 'removeClass']('ws-'+name);
				}
			};
		});
		
		
		$.fn.spinbtnUI = function(opts){
			opts = $.extend({
				monthNames: 'monthNames',
				size: 1,
				startView: 0
			}, opts);
			return this.each(function(){
				$.webshims.objectCreate(spinBtnProto, {
					element: {
						value: $(this)
					}
				}, opts);
			});
		};
	})();
	
	(function(){
		var picker = {};
		var disable = {
			
		};
		
		var getDateArray = function(date){
			var ret = [date.getFullYear(), addZero(date.getMonth() + 1), addZero(date.getDate())];
			ret.month = ret[0]+'-'+ret[1];
			ret.date = ret[0]+'-'+ret[1]+'-'+ret[2];
			return ret;
		};
		var today = getDateArray(new Date());
		
		var _setFocus = function(element, _noFocus){
			element = $(element || this.activeButton);
			this.activeButton.attr({tabindex: '-1', 'aria-selected': 'false'});
			this.activeButton = element.attr({tabindex: '0', 'aria-selected': 'true'});
			this.index = this.buttons.index(this.activeButton[0]);
			
			
			clearTimeout(this.timer);
			
			if(!this.popover.openedByFocus && !_noFocus){
				this.popover.activateElement(element);
				this.timer = setTimeout(function(){
					element[0].focus();
				}, this.popover.isVisible ? 20 : 99);
			}
			
		};
		
		var _initialFocus = function(){
			var sel;
			if(this.popover.navedInitFocus){
				sel = this.popover.navedInitFocus.sel || this.popover.navedInitFocus;
				if((!this.activeButton || !this.activeButton[0]) && this.buttons[sel]){
					this.activeButton = this.buttons[sel]();
				} else if(sel){
					this.activeButton = $(sel, this.element);
				}
				
				if(!this.activeButton[0] && this.popover.navedInitFocus.alt){
					this.activeButton = this.buttons[this.popover.navedInitFocus.alt]();
				}
			}
			
			
			if(!this.activeButton || !this.activeButton[0]){
				this.activeButton = this.buttons.filter('.checked-value');
			}
			
			if(!this.activeButton[0]){
				this.activeButton = this.buttons.filter('.this-value');
			}
			if(!this.activeButton[0]){
				this.activeButton = this.buttons.eq(0);
			}
			if(this.popover.openedByFocus){
				this.popover.activeElement = this.activeButton;
			}
			this.setFocus(this.activeButton, this.opts.noFocus);
		};
		
		
		webshims.ListBox = function (element, popover, opts){
			this.element = $('ul', element);
			this.popover = popover;
			this.opts = opts || {};
			this.buttons = $('button:not(:disabled)', this.element);
			
			
			this.ons(this);
			this._initialFocus();
		};
		
		webshims.ListBox.prototype = {
			setFocus: _setFocus,
			_initialFocus: _initialFocus,
			prev: function(){
				var index = this.index - 1;
				if(index < 0){
					if(this.opts.prev){
						this.popover.navedInitFocus = 'last';
						this.popover.actionFn(this.opts.prev);
						this.popover.navedInitFocus = false;
					}
				} else {
					this.setFocus(this.buttons.eq(index));
				}
			},
			next: function(){
				var index = this.index + 1;
				if(index >= this.buttons.length){
					if(this.opts.next){
						this.popover.navedInitFocus = 'first';
						this.popover.actionFn(this.opts.next);
						this.popover.navedInitFocus = false;
					}
				} else {
					this.setFocus(this.buttons.eq(index));
				}
			},
			ons: function(that){
				this.element
					.on({
						'keydown': function(e){
							var handled;
							var key = e.keyCode;
							if(e.ctrlKey){return;}
							if(key == 36 || key == 33){
								that.setFocus(that.buttons.eq(0));
								handled = true;
							} else if(key == 34 || key == 35){
								that.setFocus(that.buttons.eq(that.buttons.length - 1));
								handled = true;
							} else if(key == 38 || key == 37){
								that.prev();
								handled = true;
							} else if(key == 40 || key == 39){
								that.next();
								handled = true;
							}
							if(handled){
								return false;
							}
						}
					})
				;
			}
		};
		
		webshims.Grid = function (element, popover, opts){
			this.element = $('tbody', element);
			this.popover = popover;
			this.opts = opts || {};
			this.buttons = $('button:not(:disabled,.othermonth)', this.element);
			
			this.ons(this);
			
			this._initialFocus();
		};
		
		
		
		webshims.Grid.prototype = {
			setFocus: _setFocus,
			_initialFocus: _initialFocus,
			
			first: function(){
				this.setFocus(this.buttons.eq(0));
			},
			last: function(){
				this.setFocus(this.buttons.eq(this.buttons.length - 1));
			},
			upPage: function(){
				$('.ws-picker-header > button:not(:disabled)', this.popover.element).trigger('click');
			},
			downPage: function(){
				this.activeButton.filter(':not([data-action="changeInput"])').trigger('click');
			},
			ons: function(that){
				this.element
					.on({
						'keydown': function(e){
							var handled;
							var key = e.keyCode;
							
							if(e.shiftKey){return;}
							
							if((e.ctrlKey && key == 40)){
								handled = 'downPage';
							} else if((e.ctrlKey && key == 38)){
								handled = 'upPage';
							} else if(key == 33 || (e.ctrlKey && key == 37)){
								handled = 'prevPage';
							} else if(key == 34 || (e.ctrlKey && key == 39)){
								handled = 'nextPage';
							} else if(e.keyCode == 36 || e.keyCode == 33){
								handled = 'first';
							} else if(e.keyCode == 35){
								handled = 'last';
							} else if(e.keyCode == 38){
								handled = 'up';
							} else if(e.keyCode == 37){
								handled = 'prev';
							} else if(e.keyCode == 40){
								handled = 'down';
							} else if(e.keyCode == 39){
								handled = 'next';
							}
							if(handled){
								that[handled]();
								return false;
							}
						}
					})
				;
			}
		};
		$.each({
			prevPage: {get: 'last', action: 'prev'}, 
			nextPage: {get: 'first', action: 'next'}
		}, function(name, val){
			webshims.Grid.prototype[name] = function(){
				if(this.opts[val.action]){
					this.popover.navedInitFocus = {
						sel: 'button[data-id="'+ this.activeButton.attr('data-id') +'"]:not(:disabled,.othermonth)',
						alt: val.get
					};
					this.popover.actionFn(this.opts[val.action]);
					this.popover.navedInitFocus = false;
				}
			};
		});
		
		$.each({
			up: {traverse: 'prevAll', get: 'last', action: 'prev', reverse: true}, 
			down: {traverse: 'nextAll', get: 'first', action: 'next'}
		}, function(name, val){
			webshims.Grid.prototype[name] = function(){
				var cellIndex = this.activeButton.closest('td').prop('cellIndex');
				var sel = 'td:nth-child('+(cellIndex + 1)+') button:not(:disabled,.othermonth)';
				var button = this.activeButton.closest('tr')[val.traverse]();
				
				if(val.reverse){
					button = $(button.get().reverse());
				}
				button = button.find(sel)[val.get]();
				if(cellIndex == null){
					webshims.warn("cellIndex not implemented. abort keynav");
					return;
				}
				if(!button[0]){
					if(this.opts[val.action]){
						this.popover.navedInitFocus = sel+':'+val.get;
						this.popover.actionFn(this.opts[val.action]);
						this.popover.navedInitFocus = false;
					}
				} else {
					this.setFocus(button.eq(0));
				}
			};
		});
		
		$.each({
			prev: {traverse: 'prevAll',get: 'last', reverse: true}, 
			next: {traverse: 'nextAll', get: 'first'}
		}, function(name, val){
			webshims.Grid.prototype[name] = function(){
				var sel = 'button:not(:disabled,.othermonth)';
				var button = this.activeButton.closest('td')[val.traverse]('td');
				if(val.reverse){
					button = $(button.get().reverse());
				}
				button = button.find(sel)[val.get]();
				if(!button[0]){
					button = this.activeButton.closest('tr')[val.traverse]('tr');
					if(val.reverse){
						button = $(button.get().reverse());
					}
					button = button.find(sel)[val.get]();
				}
				
				if(!button[0]){
					if(this.opts[name]){
						this.popover.navedInitFocus = val.get;
						this.popover.actionFn(this.opts[name]);
						this.popover.navedInitFocus = false;
						
					}
				} else {
					this.setFocus(button.eq(0));
				}
			};
		});
		
		picker.getWeek = function(date){
			var onejan = new Date(date.getFullYear(),0,1);
			return Math.ceil((((date - onejan) / 86400000) + onejan.getDay()+1)/7);
		};
		picker.getYearList = function(value, data){
			var j, i, val, disabled, lis, prevDisabled, nextDisabled, classStr, classArray;
			
			value = value[0] * 1;
			
			var size = data.options.size;
			var xth = value % (12 * size);
			var start = value - xth;
			var max = data.options.max.split('-');
			var min = data.options.min.split('-');
			var currentValue = data.options.value.split('-');
			var enabled = 0;
			var str = '';
			var rowNum = 0;
			for(j = 0; j < size; j++){
				if(j){
					start += 12;
				}  else {
					prevDisabled = picker.isInRange([start-1], max, min) ? {'data-action': 'setYearList','value': start-1} : false;
				}
				
				str += '<div class="year-list picker-list ws-index-'+ j +'"><div class="ws-picker-header"><h3>'+ start +' - '+(start + 11)+'</h3></div>';
				lis = [];
				for(i = 0; i < 12; i++){
					val = start + i ;
					classArray = [];
					if( !picker.isInRange([val], max, min) ){
						disabled = ' disabled=""';
					} else {
						disabled = '';
						enabled++;
					}
					
					
					if(val == today[0]){
						classArray.push('this-value');
					}
					
					if(currentValue[0] == val){
						classArray.push('checked-value');
					}
					
					classStr = classArray.length ? ' class="'+ (classArray.join(' ')) +'"' : '';
					
					if(i && !(i % 3)){
						rowNum++;
						lis.push('</tr><tr class="ws-row-'+ rowNum +'">');
					}
					lis.push('<td class="ws-item-'+ i +'" role="presentation"><button  data-id="year-'+ i +'" type="button"'+ disabled + classStr +' data-action="setMonthList" value="'+val+'" tabindex="-1" role="gridcell">'+val+'</button></td>');
				}
				if(j == size - 1){
					nextDisabled = picker.isInRange([val+1], max, min) ? {'data-action': 'setYearList','value': val+1} : false;
				}
				str += '<table role="grid" aria-label="'+ start +' - '+(start + 11)+'"><tbody><tr class="ws-row-0">'+ (lis.join(''))+ '</tr></tbody></table></div>';
			}
			
			return {
				enabled: enabled,
				main: str,
				next: nextDisabled,
				prev: prevDisabled,
				type: 'Grid'
			};
		};
		
		
		picker.getMonthList = function(value, data){
			
			var j, i, name, val, disabled, lis, fullyDisabled, prevDisabled, nextDisabled, classStr, classArray;
			var o = data.options;
			var size = o.size;
			var max = o.max.split('-');
			var min = o.min.split('-');
			var currentValue = o.value.split('-');
			var enabled = 0;
			var rowNum = 0;
			var str = '';
			
			value = value[0] - Math.floor((size - 1) / 2);
			for(j = 0; j < size; j++){
				if(j){
					value++;
				} else {
					prevDisabled = picker.isInRange([value-1], max, min) ? {'data-action': 'setMonthList','value': value-1} : false;
				}
				if(j == size - 1){
					nextDisabled = picker.isInRange([value+1], max, min) ? {'data-action': 'setMonthList','value': value+1} : false;
				}
				lis = [];
				
				if( !picker.isInRange([value, '01'], max, min) && !picker.isInRange([value, '12'], max, min)){
					disabled = ' disabled=""';
					fullyDisabled = true;
				} else {
					fullyDisabled = false;
					disabled = '';
				}
				
				if(o.minView >= 1){
					disabled = ' disabled=""';
				}
				
				str += '<div class="month-list picker-list ws-index-'+ j +'"><div class="ws-picker-header">';
				
				str += o.selectNav ? 
					'<select data-action="setMonthList">'+ picker.createYearSelect(value, max, min).join('') +'</select>' : 
					'<button data-action="setYearList"'+disabled+' value="'+ value +'" tabindex="-1">'+ value +'</button>';
				str += '</div>';
				
				for(i = 0; i < 12; i++){
					val = curCfg.date.monthkeys[i+1];
					name = (curCfg.date[o.monthNames] || curCfg.date.monthNames)[i];
					classArray = [];
					if(fullyDisabled || !picker.isInRange([value, val], max, min) ){
						disabled = ' disabled=""';
					} else {
						disabled = '';
						enabled++;
					}
					
					if(value == today[0] && today[1] == val){
						classArray.push('this-value');
					}
					
					if(currentValue[0] == value && currentValue[1] == val){
						classArray.push('checked-value');
					}
					
					classStr = (classArray.length) ? ' class="'+ (classArray.join(' ')) +'"' : '';
					if(i && !(i % 3)){
						rowNum++;
						lis.push('</tr><tr class="ws-row-'+ rowNum +'">');
					}
					lis.push('<td class="ws-item-'+ i +'" role="presentation"><button data-id="month-'+ i +'" type="button"'+ disabled + classStr +' data-action="'+ (data.type == 'month' ? 'changeInput' : 'setDayList' ) +'" value="'+value+'-'+val+'" tabindex="-1" role="gridcell">'+name+'</button></td>');
					
				}
				
				str += '<table role="grid" aria-label="'+value+'"><tbody><tr class="ws-row-0">'+ (lis.join(''))+ '</tr></tbody></table></div>';
			}
			
			return {
				enabled: enabled,
				main: str,
				prev: prevDisabled,
				next: nextDisabled,
				type: 'Grid'
			};
		};
		
		
		picker.getDayList = function(value, data){
			
			var j, i, k, day, nDay, name, val, disabled, lis,  prevDisabled, nextDisabled, addTr, week, rowNum;
			
			var lastMotnh, curMonth, otherMonth, dateArray, monthName, buttonStr, date2, classArray;
			var o = data.options;
			var size = o.size;
			var max = o.max.split('-');
			var min = o.min.split('-');
			var currentValue = o.value.split('-');
			var monthNames = curCfg.date[o.monthNames] || curCfg.date.monthNames; 
			var enabled = 0;
			var str = [];
			var date = new Date(value[0], value[1] - 1, 1);
			
			date.setMonth(date.getMonth()  - Math.floor((size - 1) / 2));
			
			for(j = 0;  j < size; j++){
				lastMotnh = date.getMonth();
				rowNum = 0;
				if(!j){
					date2 = new Date(date.getTime());
					date2.setDate(-1);
					dateArray = getDateArray(date2);
					prevDisabled = picker.isInRange(dateArray, max, min) ? {'data-action': 'setDayList','value': dateArray[0]+'-'+dateArray[1]} : false;
				}
				
				dateArray = getDateArray(date);
				
				str.push('<div class="day-list picker-list ws-index-'+ j +'"><div class="ws-picker-header">');
				if( o.selectNav ){
					monthName = ['<select data-action="setDayList" tabindex="0">'+ picker.createMonthSelect(dateArray, max, min, monthNames).join('') +'</select>', '<select data-action="setDayList" tabindex="0">'+ picker.createYearSelect(dateArray[0], max, min, '-'+dateArray[1]).join('') +'</select>'];
					if(curCfg.date.showMonthAfterYear){
						monthName.reverse();
					}
					str.push( monthName.join(' ') );
				} 
				
				monthName = [monthNames[(dateArray[1] * 1) - 1], dateArray[0]];
				if(curCfg.date.showMonthAfterYear){
					monthName.reverse();
				}
				
				if(!data.options.selectNav) {
					str.push(  
						'<button data-action="setMonthList"'+ (o.minView >= 2 ? ' disabled="" ' : '') +' value="'+ dateArray.date +'" tabindex="-1">'+ monthName.join(' ') +'</button>'
					);
				}
				
				
				str.push('</div><table role="grid" aria-label="'+ monthName.join(' ')  +'"><thead><tr>');
				
				if(data.options.showWeek){
					str.push('<th class="week-header">'+ curCfg.date.weekHeader +'</th>');
				}
				for(k = curCfg.date.firstDay; k < curCfg.date.dayNamesShort.length; k++){
					str.push('<th class="day-'+ k +'"><abbr title="'+ curCfg.date.dayNames[k] +'">'+ curCfg.date.dayNamesShort[k] +'</abbr></th>');
				}
				k = curCfg.date.firstDay;
				while(k--){
					str.push('<th class="day-'+ k +'"><abbr title="'+ curCfg.date.dayNames[k] +'">'+ curCfg.date.dayNamesShort[k] +'</abbr></th>');
				}
				str.push('</tr></thead><tbody><tr class="ws-row-0">');
				
				if(data.options.showWeek) {
					week = picker.getWeek(date);
					str.push('<td class="week-cell">'+ week +'</td>');
				}
				
				for (i = 0; i < 99; i++) {
					addTr = (i && !(i % 7));
					curMonth = date.getMonth();
					otherMonth = lastMotnh != curMonth;
					day = date.getDay();
					classArray = [];
					
					if(addTr && otherMonth ){
						str.push('</tr>');
						break;
					}
					if(addTr){
						rowNum++;
						str.push('</tr><tr class="ws-row-'+ rowNum +'">');
						if(data.options.showWeek) {
							week++;
							str.push('<td class="week-cell">'+ week +'</td>');
						}
					}
					
					if(!i){
						
						if(day != curCfg.date.firstDay){
							nDay = day - curCfg.date.firstDay;
							if(nDay < 0){
								nDay += 7;
							}
							date.setDate(date.getDate() - nDay);
							day = date.getDay();
							curMonth = date.getMonth();
							otherMonth = lastMotnh != curMonth;
						}
					}
					
					dateArray = getDateArray(date);
					buttonStr = '<td role="presentation" class="day-'+ day +'"><button data-id="day-'+ date.getDate() +'" role="gridcell" data-action="changeInput" value="'+ (dateArray.join('-')) +'"';
					
					if(otherMonth){
						classArray.push('othermonth');
					} else {
						classArray.push('day-'+date.getDate());
					}
					
					if(dateArray[0] == today[0] && today[1] == dateArray[1] && today[2] == dateArray[2]){
						classArray.push('this-value');
					}
					
					if(currentValue[0] == dateArray[0] && dateArray[1] == currentValue[1] && dateArray[2] == currentValue[2]){
						classArray.push('checked-value');
					}
					
					if(classArray.length){
						buttonStr += ' class="'+ classArray.join(' ') +'"';
					}
					
					if(!picker.isInRange(dateArray, max, min) || (data.options.disableDays && $.inArray(day, data.options.disableDays) != -1)){
						buttonStr += ' disabled=""';
					}
					
					str.push(buttonStr+' tabindex="-1">'+ date.getDate() +'</button></td>');
					
					date.setDate(date.getDate() + 1);
				}
				str.push('</tbody></table></div>');
				if(j == size - 1){
					dateArray = getDateArray(date);
					dateArray[2] = 1;
					nextDisabled = picker.isInRange(dateArray, max, min) ? {'data-action': 'setDayList','value': dateArray.date} : false;
				}
			}
					
			
			return {
				enabled: 9,
				main: str.join(''),
				prev: prevDisabled,
				next: nextDisabled,
				type: 'Grid'
			};
		};
		
		picker.isInRange = function(values, max, min){
			var i;
			var ret = true;
			for(i = 0; i < values.length; i++){
				
				if(min[i] && min[i] > values[i]){
					ret = false;
					break;
				} else if( !(min[i] && min[i] == values[i]) ){
					break;
				}
			}
			if(ret){
				for(i = 0; i < values.length; i++){
					
					if((max[i] && max[i] < values[i])){
						ret = false;
						break;
					} else if( !(max[i] && max[i] == values[i]) ){
						break;
					}
				}
			}
			return ret;
		};
		
		picker.createMonthSelect = function(value, max, min, monthNames){
			if(!monthNames){
				monthNames = curCfg.date.monthNames;
			}
			
			var selected;
			var i = 0;
			var options = [];
			var tempVal = value[1]-1;
			for(; i < monthNames.length; i++){
				selected = tempVal == i ? ' selected=""' : '';
				if(selected || picker.isInRange([value[0], i+1], max, min)){
					options.push('<option value="'+ value[0]+'-'+addZero(i+1) + '"'+selected+'>'+ monthNames[i] +'</option>');
				}
			}
			return options;
		};
		
		picker.createYearSelect = function(value, max, min, valueAdd){
			
			var temp;
			var goUp = true;
			var goDown = true;
			var options = ['<option selected="">'+ value + '</option>'];
			var i = 0;
			if(!valueAdd){
				valueAdd = '';
			}
			while(i < 8 && (goUp || goDown)){
				i++;
				temp = value-i;
				if(goUp && picker.isInRange([temp], max, min)){
					options.unshift('<option value="'+ (temp+valueAdd) +'">'+ temp +'</option>');
				} else {
					goUp = false;
				}
				temp = value + i;
				if(goDown && picker.isInRange([temp], max, min)){
					options.push('<option value="'+ (temp+valueAdd) +'">'+ temp +'</option>');
				} else {
					goDown = false;
				}
			}
			return options;
		};
			
		var actions = {
			changeInput: function(val, popover, data){
				popover.stopOpen = true;
				data.element.focus();
				setTimeout(function(){
					popover.stopOpen = false;
				}, 9);
				popover.hide();
				data.setChange(val);
			}
		};
		
		(function(){
			var retNames = function(name){
				return 'get'+name+'List';
			};
			var retSetNames = function(name){
				return 'set'+name+'List';
			};
			var stops = {
				date: 'Day',
				week: 'Day',
				month: 'Month'
			};
			
			$.each({'setYearList' : ['Year', 'Month', 'Day'], 'setMonthList': ['Month', 'Day'], 'setDayList': ['Day']}, function(setName, names){
				var getNames = names.map(retNames);
				var setNames = names.map(retSetNames);
				actions[setName] = function(val, popover, data, startAt){
					val = ''+val;
					var o = data.options;
					var values = val.split('-');
					if(!startAt){
						startAt = 0;
					}
					$.each(getNames, function(i, item){
						if(i >= startAt){
							var content = picker[item](values, data);
							
							if( values.length < 2 || content.enabled > 1 || stops[data.type] === names[i]){
								popover.element
									.attr({'data-currentview': setNames[i]})
									.addClass('ws-size-'+o.size)
									.data('pickercontent', {
										data: data,
										content: content,
										values: values
									})
								;
								popover.bodyElement.html(content.main);
								if(content.prev){
									popover.prevElement
										.attr(content.prev)
										.prop({disabled: false})
									;
								} else {
									popover.prevElement
										.removeAttr('data-action')
										.prop({disabled: true})
									;
								}
								if(content.next){
									popover.nextElement
										.attr(content.next)
										.prop({disabled: false})
									;
								} else {
									popover.nextElement
										.removeAttr('data-action')
										.prop({disabled: true})
									;
								}
								if(webshims[content.type]){
									new webshims[content.type](popover.bodyElement.children(), popover, content);
								}
								popover.element.trigger('pickerchange');
								return false;
							}
						}
					});
				};
			});
		})();
		
		picker.commonInit = function(data, popover){
			var actionfn = function(e){
				popover.actionFn({
					'data-action': $.attr(this, 'data-action'),
					value: $(this).val() || $.attr(this, 'value')
				});
				return false;
			};
			var id = new Date().getTime();
			var generateList = function(o, max, min){
				var options = [];
				var label = '';
				var labelId = '';
				o.options = data.getOptions() || {};
				$('div.ws-options', popover.contentElement).remove();
				$.each(o.options[0], function(val, label){
					var disabled = picker.isInRange(val.split('-'), o.maxS, o.minS) ?
						'' :
						' disabled="" '
					options.push('<li role="presentation"><button value="'+ val +'" '+disabled+' data-action="changeInput" tabindex="-1"  role="option">'+ (label || data.formatValue(val)) +'</button></li>');
				});
				if(options.length){
					id++;
					if(o.options[1]){
						labelId = 'datalist-'+id;
						label = '<h5 id="'+labelId+'">'+ o.options[1] +'</h5>';
						labelId = ' aria-labelledbyid="'+ labelId +'" ';
					}
					new webshims.ListBox($('<div class="ws-options">'+label+'<ul role="listbox" '+ labelId +'>'+ options.join('') +'</div>').insertAfter(popover.bodyElement)[0], popover, {noFocus: true});
				}
			};
			var updateContent = function(){
				if(popover.isDirty){
					var o = data.options;
					
					o.maxS = o.max.split('-');
					o.minS = o.min.split('-');
					
					$('button', popover.buttonRow).each(function(){
						var text;
						if($(this).is('.ws-empty')){
							text = curCfg.date.clear;
							if(!text){
								text = formcfg[''].date.clear || 'clear';
								webshims.warn("could not get clear text from form cfg");
							}
						} else if($(this).is('.ws-current')){
							text = (curCfg[data.type] || {}).currentText;
							if(!text){
								text = (formcfg[''][[data.type]] || {}).currentText || 'current';
								webshims.warn("could not get currentText from form cfg");
							}
							$.prop(this, 'disabled', !picker.isInRange(today[data.type].split('-'), o.maxS, o.minS));
						}
						if(text){
							$(this).text(text).attr({'aria-label': text});
						}
						
					});
					popover.nextElement.attr({'aria-label': curCfg.date.nextText});
					$('> span', popover.nextElement).html(curCfg.date.nextText);
					popover.prevElement.attr({'aria-label': curCfg.date.prevText});
					$('> span', popover.prevElement).html(curCfg.date.prevText);
					
					generateList(o, o.maxS, o.minS);
				}
				$('button.ws-empty', popover.buttonRow).prop('disabled', $.prop(data.orig, 'required'));
				popover.isDirty = false;
			};
			
			popover.actionFn = function(obj){
				if(actions[obj['data-action']]){
					actions[obj['data-action']](obj.value, popover, data, 0);
				} else {
					webshims.warn('no action for '+ obj['data-action']);
				}
			};
			
			popover.contentElement.html('<button class="ws-prev" tabindex="0"><span></span></button> <button class="ws-next" tabindex="0"><span></span></button><div class="ws-picker-body"></div><div class="ws-button-row"><button type="button" class="ws-current" data-action="changeInput" value="'+today[data.type]+'" tabindex="0"></button> <button type="button" data-action="changeInput" value="" class="ws-empty" tabindex="0"></button></div>');
			popover.nextElement = $('button.ws-next', popover.contentElement);
			popover.prevElement = $('button.ws-prev', popover.contentElement);
			popover.bodyElement = $('div.ws-picker-body', popover.contentElement);
			popover.buttonRow = $('div.ws-button-row', popover.contentElement);
			
			popover.isDirty = true;
			
			popover.contentElement
				.on('click', 'button[data-action]', actionfn)
				.on('change', 'select[data-action]', actionfn)
			;
			
			popover.contentElement.on({
				keydown: function(e){
					if(e.keyCode == 9){
						var tabbable = $('[tabindex="0"]:not(:disabled)', this).filter(':visible');
						var index = tabbable.index(e.target);
						if(e.shiftKey && index <= 0){
							tabbable.last().focus();
							return false;
						}
						if(!e.shiftKey && index >= tabbable.length - 1){
							tabbable.first().focus();
							return false;
						}
					} else if(e.keyCode == 27){
						data.element.focus();
						popover.hide();
						return false;
					}
				}
			});
			
			$(data.options.orig).on('input', function(){
				var currentView;
				if(data.options.updateOnInput && popover.isVisible && data.options.value && (currentView = popover.element.attr('data-currentview'))){
					actions[currentView]( data.options.value , popover, data, 0);
				}
			});
			
			data._propertyChange = (function(){
				var timer;
				var update = function(){
					if(popover.isVisible){
						updateContent();
					}
				};
				return function(prop){
					if(prop == 'value'){return;}
					popover.isDirty = true;
					if(popover.isVisible){
						clearTimeout(timer);
						timer = setTimeout(update, 9);
					}
				};
			})();
			
			popover.activeElement = $([]);
			
			popover.activateElement = function(element){
				element = $(element);
				if(element[0] != popover.activeElement[0]){
					popover.activeElement.removeClass('ws-focus');
					if(!popover.openedByFocus){
						element.addClass('ws-focus');
					}
				}
				popover.activeElement = element;
			};
			
			popover.element
				.on({
					wspopoverbeforeshow: updateContent,
					wspopoverhide: function(){
						popover.openedByFocus = false;
					},
					focusin: function(e){
						popover.openedByFocus = false;
						popover.activateElement(e.target);
					}
				})
			;
			
			
			$(document).onTrigger('wslocalechange', data._propertyChange);
		};
		
		picker._common = function(data){
			var popover = webshims.objectCreate(webshims.wsPopover, {}, {prepareFor: data.element});
			var opener = $('<button type="button" class="popover-opener" />').appendTo(data.buttonWrapper);
			var options = data.options;
			var init = false;
			
			var show = function(){
				if(!options.disabled && !options.readonly && !popover.isVisible){
					if(!init){
						picker.commonInit(data, popover);
					}
					
					if(!init || data.options.restartView) {
						actions.setYearList( options.defValue || options.value, popover, data, data.options.startView);
					} else {
						actions[popover.element.attr('data-currentview') || 'setYearList']( options.defValue || options.value, popover, data, 0);
					}
					
					init = true;
					popover.show(data.element);
				}
			};
			
			options.containerElements.push(popover.element[0]);
			
			popover.element
				.on({
					focusin: function(e){
						if(popover.activateElement){
							popover.openedByFocus = false;
							popover.activateElement(e.target);
						}
					}
				})
			;
			
			if(!options.startView){
				options.startView = 0;
			}
			if(!options.minView){
				options.minView = 0;
			}
			if(options.startView < options.minView){
				options.minView = options.startView;
				webshims.warn("wrong config for minView/startView.");
			}
			if(!options.size){
				options.size = 1;
			}
			
			popover.element
				.addClass(data.type+'-popover input-picker')
				.attr({role: 'application'})
			;
			
			labelWidth(popover.element.children('div.ws-po-outerbox').attr({role: 'group'}), options.labels, true);
			labelWidth(opener, options.labels, true);
			
			opener
				.attr({
					'tabindex': options.labels.length ? 0 : '-1'
				})
				.on({
					mousedown: function(){
						stopPropagation.apply(this, arguments);
						popover.preventBlur();
					},
					click: function(){
						if(popover.isVisible && popover.activeElement){
							popover.openedByFocus = false;
							popover.activeElement.focus();
						}
						show();
					},
					focus: function(){
						popover.preventBlur();
					}
				})
			;
			
			(function(){
				var mouseFocus = false;
				var resetMouseFocus = function(){
					mouseFocus = false;
				};
				data.element.on({
					focus: function(){
						if(!popover.stopOpen && (data.options.openOnFocus || (mouseFocus && options.openOnMouseFocus))){
							popover.openedByFocus = !options.noInput;
							show();
						}
					},
					mousedown: function(){
						mouseFocus = true;
						setTimeout(resetMouseFocus, 9);
						if(data.element.is(':focus')){
							popover.openedByFocus = !options.noInput;
							show();
						}
					}
				});
			})();
			data.popover = popover;
		};
		
		picker.month = picker._common;
		picker.date = picker.month;
		
		webshims.picker = picker;
	})();
	
	(function(){
		
		var stopCircular, isCheckValidity;
		
		var modernizrInputTypes = Modernizr.inputtypes;
		var inputTypes = {
			
		};
		var copyProps = [
			'disabled',
			'readonly',
			'value',
			'min',
			'max',
			'step',
			'title',
			'placeholder',
			'tabindex'
		];
		
		//
		var copyAttrs = ['data-placeholder'];
			
		$.each(copyProps.concat(copyAttrs), function(i, name){
			var fnName = name.replace(/^data\-/, '');
			
			webshims.onNodeNamesPropertyModify('input', name, function(val){
				if(!stopCircular){
					var shadowData = webshims.data(this, 'shadowData');
					if(shadowData && shadowData.data && shadowData.nativeElement === this && shadowData.data[fnName]){
						shadowData.data[fnName](val);
					}
				}
			});
		});
		
		if(options.replaceUI){
			var reflectFn = function(val){
				if(webshims.data(this, 'hasShadow')){
					$.prop(this, 'value', $.prop(this, 'value'));
				}
			};
			
			webshims.onNodeNamesPropertyModify('input', 'valueAsNumber', reflectFn);
			webshims.onNodeNamesPropertyModify('input', 'valueAsDate', reflectFn);
		}
		
		var extendType = (function(){
			return function(name, data){
				inputTypes[name] = data;
				data.attrs = $.merge([], copyAttrs, data.attrs);
				data.props = $.merge([], copyProps, data.props);
			};
		})();
		
		var stopPropagation = function(e){
			e.stopImmediatePropagation(e);
		};
		var isVisible = function(){
			return $.css(this, 'display') != 'none';
		};
		var sizeInput = function(data){
			var init;
			var updateStyles = function(){
				$.style( data.orig, 'display', '' );
				
				var correctWidth = 0.6;
				if(!init || data.orig.offsetWidth){
					data.element.css({
						marginLeft: $.css( data.orig, 'marginLeft'),
						marginRight: $.css( data.orig, 'marginRight')
					});
					
					if(data.buttonWrapper && data.buttonWrapper.filter(isVisible).length){
						data.element.css({paddingRight: ''});
						
						if((parseInt(data.buttonWrapper.css('marginLeft'), 10) || 0) < 0){
							data.element
								.css({paddingRight: ''})
								.css({
									paddingRight: (parseInt( data.element.css('paddingRight'), 10) || 0) + data.buttonWrapper.outerWidth()
								})
							;
						} else {
							correctWidth = data.buttonWrapper.outerWidth(true) + 0.6;
						}
					}
					
					data.element.outerWidth( $(data.orig).outerWidth() - correctWidth );
				}
				init = true;
				$.style( data.orig, 'display', 'none' );
			};
			$(document).onTrigger('updateshadowdom', updateStyles);
		};
		
		
		var implementType = function(){
			var type = $.prop(this, 'type');
			
			var i, opts, data, optsName, calcWidth, labels;
			if(inputTypes[type]){
				data = {};
				optsName = type;
				//todo: do we need deep extend?
				
				labels = $(this).jProp('labels');
				
				opts = $.extend({}, options[type], $($.prop(this, 'form')).data(type) || {}, $(this).data(type) || {}, {
					orig: this,
					type: type,
					labels: labels,
					options: {},
					input: function(val){
						opts._change(val, 'input');
					},
					change: function(val){
						opts._change(val, 'change');
					},
					_change: function(val, trigger){
						stopCircular = true;
						$.prop(opts.orig, 'value', val);
						stopCircular = false;
						if(trigger){
							$(opts.orig).trigger(trigger);
						}
					},
					containerElements: []
				});
				
				
				for(i = 0; i < copyProps.length; i++){
					opts[copyProps[i]] = $.prop(this, copyProps[i]);
				}
				for(i = 0; i < copyAttrs.length; i++){
					optsName = copyAttrs[i].replace(/^data\-/, '');
					if(!opts[optsName]){
						opts[optsName] = $.attr(this, copyAttrs[i]);
					}
				}
				
				data.shim = inputTypes[type]._create(opts);
				
				webshims.addShadowDom(this, data.shim.element, {
					data: data.shim || {}
				});
				
				data.shim.options.containerElements.push(data.shim.element[0]);
				
				labelWidth($(this).getShadowFocusElement(), labels);
				
				$(this).on('change', function(e){
					if(!stopCircular && e.originalEvent){
						data.shim.value($.prop(this, 'value'));
					}
				});
				
				(function(){
					var has = {
						focusin: true,
						focus: true
					};
					var timer;
					var hasFocusTriggered = false;
					var hasFocus = false;
					
					$(data.shim.options.containerElements)
						.on({
							'focusin focus focusout blur': function(e){
								e.stopImmediatePropagation();
								hasFocus = has[e.type];
								clearTimeout(timer);
								timer = setTimeout(function(){
									if(hasFocus != hasFocusTriggered){
										hasFocusTriggered = hasFocus;
										$(opts.orig).triggerHandler(hasFocus ? 'focus' : 'blur');
										$(opts.orig).trigger(hasFocus ? 'focusin' : 'focusout');
									}
									hasFocusTriggered = hasFocus;
								}, 0);
							}
						})
					;
				})();
								
				
				data.shim.element.on('change input', stopPropagation);
				
				if(Modernizr.formvalidation){
					$(opts.orig).on('firstinvalid', function(e){
						if(!webshims.fromSubmit && isCheckValidity){return;}
						$(opts.orig).off('invalid.replacedwidgetbubble').on('invalid.replacedwidgetbubble', function(evt){
							if(!e.isInvalidUIPrevented() && !evt.isDefaultPrevented()){
								webshims.validityAlert.showFor( e.target );
								e.preventDefault();
								evt.preventDefault();
							}
							$(opts.orig).off('invalid.replacedwidgetbubble');
						});
					});
				}
				
				
				if(data.shim.buttonWrapper && data.shim.buttonWrapper.filter(isVisible).length){
					data.shim.element.addClass('has-input-buttons');
				}
				
				calcWidth = opts.calculateWidth != null ? opts.calculateWidth : options.calculateWidth;
				
				if(calcWidth){
					sizeInput(data.shim);
				}
				$(this).css({display: 'none'});
			}
		};
		
		if(!modernizrInputTypes.range || options.replaceUI){
			extendType('range', {
				_create: function(opts, set){
					return $('<span />').insertAfter(opts.orig).rangeUI(opts).data('rangeUi');
				}
			});
		}
		
		if(Modernizr.formvalidation){
			['input', 'form'].forEach(function(name){
				var desc = webshims.defineNodeNameProperty(name, 'checkValidity', {
					prop: {
						value: function(){
							isCheckValidity = true;
							var ret = desc.prop._supvalue.apply(this, arguments);
							isCheckValidity = false;
							return ret;
						}
					}
				});
			});
		}
		
		
		['number', 'time', 'month', 'date'].forEach(function(name){
			if(!modernizrInputTypes[name] || options.replaceUI){
				extendType(name, {
					_create: function(opts, set){
						var data = $('<input class="ws-'+name+'" type="text" />') //  role="spinbutton"???
							.insertAfter(opts.orig)
							.spinbtnUI(opts)
							.data('wsspinner')
						;
						if(webshims.picker && webshims.picker[name]){
							webshims.picker[name](data);
						}
						data.buttonWrapper.addClass('input-button-size-'+(data.buttonWrapper.children().filter(isVisible).length));
						return data;
					}
				});
			}
		});
		
		
		webshims.addReady(function(context, contextElem){
			$('input', context)
				.add(contextElem.filter('input'))
				.each(implementType)
			;
		});
	})();
});

