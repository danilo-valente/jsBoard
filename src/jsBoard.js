/*jslint vars: true*/
/*
 * to-do: remap keys
 */
(function (window) {
	'use strict';
	
	var addEvent = window.document.addEventListener
		? function (target, event, fn) {
			if (target) {
				return target.addEventListener(event, fn, false);
			}
		}
		: function (target, event, fn) {
			if (target) {
				return target.attachEvent(('on' + event), fn);
			}
		};
	
	var remEvent = window.document.removeEventListener
		? function (target, event, fn) {
			if (target) {
				return target.removeEventListener(event, fn, false);
			}
		}
		: function (target, event, fn) {
			if (target) {
				return target.detachEvent(('on' + event), fn);
			}
		};
	
	var MAC = window.navigator.userAgent.indexOf('Mac') !== -1;
	
	var keyboard = {
		BACKSPACE		: 8,
		TAB				: 9,
		ENTER			: MAC ? 3 : 13,
		SHIFT			: 16,
		CTRL			: 17,
		ALT				: 18,
		PAUSE			: 19,
		BREAK			: 19,
		CAPSLOCK		: 20,
		ESCAPE			: 27,
		ESC				: 27,
		SPACE			: 32,
		SPACEBAR		: 32,
		PG_UP			: 33,
		PG_DOWN			: 34,
		END				: 35,
		HOME			: 36,
		LEFT			: 37,
		UP				: 38,
		RIGHT			: 39,
		DOWN			: 40,
		PRINT_SCREEN	: 44,
		INSERT			: 45,
		INS				: 45,
		DELETE			: 46,
		DEL				: 46,
		0				: 48,
		1				: 49,
		2				: 50,
		3				: 51,
		4				: 52,
		5				: 53,
		6				: 54,
		7				: 55,
		8				: 56,
		9				: 57,
		COLON			: 59,
		SEMICOLON		: 59,
		EQUAL			: 61,
		QUESTION_MARK	: 63,
		A				: 65,
		B				: 66,
		C				: 67,
		D				: 68,
		E				: 69,
		F				: 70,
		G				: 71,
		H				: 72,
		I				: 73,
		J				: 74,
		K				: 75,
		L				: 76,
		M				: 77,
		N				: 78,
		O				: 79,
		P				: 80,
		Q				: 81,
		R				: 82,
		S				: 83,
		T				: 84,
		U				: 85,
		V				: 86,
		W				: 87,
		X				: 88,
		Y				: 89,
		Z				: 90,
		LEFT_WIN		: 91,
		META			: MAC ? 224 : 91,
		RIGHT_WIN		: 92,
		MENU			: 93,
		NUM_0			: 96,
		NUM_1			: 97,
		NUM_2			: 98,
		NUM_3			: 99,
		NUM_4			: 100,
		NUM_5			: 101,
		NUM_6			: 102,
		NUM_7			: 103,
		NUM_8			: 104,
		NUM_9			: 105,
		NUM_MULTIPLY	: 106,
		NUM_PLUS		: 107,
		NUM_MINUS		: 109,
		NUM_PERIOD		: 110,
		NUM_DIVIDE		: 111,
		F1				: 112,
		F2				: 113,
		F3				: 114,
		F4				: 115,
		F5				: 116,
		F6				: 117,
		F7				: 118,
		F8				: 119,
		F9				: 120,
		F10				: 121,
		F11				: 122,
		F12				: 123,
		NUM_LOCK		: MAC ? 12 : 144,
		SCROLL_LOCK		: 145,
		SEMICOLON_2		: 186,
		EQUAL_2			: 187,
		PLUS			: 187,
		COMMA			: 188,
		LA_BRACKET		: 188,
		DASH			: 189,
		UNDERSCORE		: 189,
		PERIOD			: 190,
		RA_BRACKET		: 190,
		SLASH			: 191,
		QUESTION_MARK_2	: 191,
		TILDE			: 192,
		APOSTROPHE		: 192,
		SLASH_2			: 193,
		NUM_PERIOD_2	: 194,
		OPEN_BRACKET	: 219,
		CO_BRACKET		: 219,
		BACKSLASH		: 220,
		PIPE			: 220,
		CLOSE_BRACKET	: 221,
		CC_BRACKET		: 221,
		SINGLE_QUOTE	: 222,
		QUOTE			: 222,
		WIN				: 224
	};
	
	var handle = function (target) {
		if (!target || !target.nodeName) {
			target = window.document;
		}
		
		var that = this;
		var stopped = true;
		var pressing = [];
		var listeners = {
			press: [],
			release: []
		};
		
		var fire = function (type, e) {
			for (var i = 0, len = listeners[type].length; i < len; i++) {
				listeners[type][i].call(that, e, that.pressing());
			}
		};
		
		var getKey = function (e) {
			var l = e.location || e.keyLocation;
			var key = e.keyCode || e.which;
			return l !== 3 && key >= 0x61 && key <= 0x7A ? key - 0x20 : key;
		}
		
		// pushes pressed key to array and fires 'press' listeners
		var press = function (e) {
			e = e || window.event;
			var key = getKey(e);
			if (pressing.indexOf(key) === -1) {
				pressing.push(key);
			}
			fire('press', e);
		};
		
		// fires 'release' listeners and pops released key
		var release = function (e) {
			e = e || window.event;
			fire('release', e);
			var key = getKey(e);
			var i = pressing.indexOf(key);
			if (i !== -1) {
				pressing.splice(i, 1);
			}
		};
		
		// just clears the array
		this.reset = function () {
			pressing.length = 0;
		};
		
		this.start = function () {
			if (stopped) {
				addEvent(target, 'keydown', press);
				addEvent(target, 'keyup', release);
				stopped = false;
			}
		}
		
		this.stop = function () {
			if (!stopped) {
				remEvent(target, 'keydown', press);
				remEvent(target, 'keyup', release);
				stopped = true;
			}
		};
		var type = function (arg) {
			return Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
		}
		var parseArg = function (keys) {
			var keysType = type(keys);
			if (keysType === 'string') {
				keys = String.prototype.match.call(keys, /\w+/g);
				for (var i = 0, len = keys.length; i < len; i++) {
					var kid = keys[i].toUpperCase();
					keys[i] = keyboard[kid];
					if (keys[i] === undefined) {
						throw new Error('Unrecognized key \'' + kid + '\'');
					}
				}
			} else if (keysType !== 'array') {
				keys = [keys];
			}
			return keys;
		};
		
		this.pressing = function (keys, strict) {
			keys = parseArg(keys);
			if (keys) {
				if (!strict) {
					for (var i = 0, len = keys.length; i < len; i++) {
						return pressing.indexOf(keys[i]) !== -1;
					}
				}
				if (pressing.length !== keys.length) {
					return false;
				}
				for (var i = 0, len = keys.length; i < len; i++) {
					if (pressing[i] !== keys[i]) {
						return false;
					}
				}
				return true;
			}
			return pressing.slice();
		};
		
		// instantiates a new listener
		var newListener = function (type, action, check) {
			var listener = function (e) {
				if (check.call(that, e, pressing)) {
					action.call(that, e, pressing);
				}
			};
			listener.on = function () {
				if (listeners[type].indexOf(this) === -1) {
					listeners[type].push(this);
				}
			};
			listener.off = function () {
				var i = listeners[type].indexOf(this);
				if (i !== -1) {
					listeners[type].splice(i, 1);
				}
			};
			listener.on();
			return listener;
		};
		
		var on = function (etype, keys, action) {
			var check;
			if (type(keys) === 'function') {
				check = keys;
			} else {
				keys = parseArg(keys);
				check = function () {
					return that.pressing(keys, true);
				};
			}
			return newListener(etype, action, check);
		};
		
		this.press = function (keys, action) {
			return on('press', keys, action);
		};
		
		this.release = function (keys, action) {
			return on('release', keys, action);
		};
		
		this.pressAny = function (action) {
			return this.press(function () {
				return true;
			}, action);
		};
		
		this.releaseAny = function (action) {
			return this.release(function () {
				return true;
			}, action);
		};
		
		// start the service
		this.start();
	};
	
	handle.prototype.keyboard = keyboard;
	
	var jsBoard = function (target) {
		return new handle(target);
	};
	
	jsBoard.version = '1.0.0';
	jsBoard.keyboard = keyboard;
	jsBoard.extend = function (extension) {
		for (var key in extension) {
			if (extension.hasOwnProperty(key)) {
				handle.prototype[key] = extension[key];
			}
		}
	};
	jsBoard.keyName = function (code) {
		for (var key in keyboard) {
			if (keyboard[key] === code) {
				return key;
			}
		}
		return '';
	}
	
	window.jsBoard = jsBoard;
})(window);
