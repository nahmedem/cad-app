var $ = jQuery;

var Core = new function() {
	
	this.functions = {}; // Store functions
	this.reference = {};
	
	this.store_unique_id = 1;

	this.unique_id = function() {

		return ++this.store_unique_id;

	};

	this.local_time = function(raw, format) { // Output UTC time as local datetime string

		var tmp_date = new Date()
		var utc_offset = tmp_date.getTimezoneOffset()*-1;

		if(format == null) { format = 'MMM D, YYYY @ h:mm a'; }

		return moment(raw).add('m', utc_offset).format(format);

	};

	this.ucwords = function(str) {
	  return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
	    return $1.toUpperCase();
	  });
	};

	this.checkdate = function(m, d, y) {
	  return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
	}

	this.ensure_defaults = function(defaults, options) { // Ensure that the options variable has all options set according to the defaults variable

		var k = '';

		if(options == undefined) { options = {}; }
          if(defaults == undefined) { defaults = {}; }

		for(k in defaults) {

			if(options[k] == undefined) {

				options[k] = defaults[k];

			}

		}

		return options;

	}

	// Set the max length for an input field
	this.max_length = function(options) {

		options = Core.ensure_defaults({
			holder: '',
			max_length: 200
		}, options);

		$(options['holder']).attr('max-len', options['max_length']);

		$(options['holder']).bind("keypress keyup", function() {
			
			var el = $(this);
			var val = el.val();
			var max = el.attr('max-len')*1;
			
			if(val.length > el.attr('max-len')) {

				el.val( val.substr(0, max) );

			}

		});

	}

	this.log = function(options) {

		if(window.console) {

			console.log(options);

		}

	};

	this.points = function(options) {

		options = Core.ensure_defaults({
			points: 0,
			text: '',
			html: '',
			extra_class: '',
			front: 1
		}, options);

		if(options['html'] != '') { options['html'] = ' '+options['html']; }
		if(options['extra_class'] != '') { options['extra_class'] = ' '+options['extra_class']; }
		
		var use_class = '';
		var front = '';

		if(options['points'] > 0) {

			use_class = 'points-up';
			front = '+';

		} else if(options['points'] < 0) {

			use_class = 'points-down';

		} else {

			use_class = 'points-none';

		}

		if(options['front'] == 0) { front = ''; }

		return '<div class="'+use_class+''+options['extra_class']+'"'+options['html']+'>'+front+''+options['points']+''+options['text']+'</div>';

	};

	this.modal_to = '';

	this.modal = function(options) {

		clearTimeout(Core.modal_to);

		options = Core.ensure_defaults({
			title: '!',
			msg: '',
			header: 0,
			footer: '<button class="btn" data-dismiss="modal" aria-hidden="true">Okay</button>',
			alert: '',
			close: 0,
			hide: 0
		}, options);

		if(options['hide'] == 1) {

			$('#result-modal').modal('hide');
			return false;

		}

		if($('#result-modal').length == 0) { // Ensure that the modal exists

			var html = '<div id="result-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="result-modal-Label" aria-hidden="true">'
			  + '<div id="result-modal-header" class="modal-header">'
			   + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>'
			    + '<h3 id="result-modal0Label"><div id="result-modal-title"></div></h3>'
			  + '</div>'
			  + '<div id="result-modal-msg" class="modal-body">'
			  + '</div>'
			  + '<div id="result-modal-footer" class="modal-footer">'
			  + '</div>'
			+ '</div>';

			$('body').append(html);

		}

		if(options['header'] == 1) {

			$('#result-modal-header').show();

		} else {

			$('#result-modal-header').hide();

		}

		if(options['alert'] != '') {

			options['msg'] = '<div class="alert alert-'+options['alert']+'">'+options['msg']+'</div>';

		}
		
		$('#result-modal-title').html(options['title']);
		$('#result-modal-msg').html(options['msg']);
		$('#result-modal-footer').html(options['footer']);

		$('#result-modal').modal('show');

		if(options['close'] > 0) {

			Core.modal_to = setTimeout(function() {

				$('#result-modal').modal('hide');


			}, options['close']);

		}

	};

	this.alert_settings = {};

	this.alert = function(options) {

		options = Core.ensure_defaults({
			msg: "",
			type: "danger",
		}, options);
		
		if(options['msg'] == Core.alert_settings['msg']
			&& options['type'] == Core.alert_settings['type']) {

			return true;

		}

		Core.alert_settings = options;

		$("#core-alert").remove();

		if(options['type'] == 'remove') {

			return true;

		}
		
		var html = '<div class="float alert-'+options['type']+'" style="width:100%;text-align:center;padding:1em;opacity:0.95;display:none" id="core-alert">'+options['msg']+'</div>';

		$('body').append(html);

		$("#core-alert").fadeIn(300);

	};

	this.msg = function(options) {

		options = Core.ensure_defaults({
			msg: "",
			type: "danger",
			holder: "#"
		}, options);

		$("[core-msg]").remove();

		if(options['type'] == 'remove') {

			return true;

		}

		var html = '<div style="color:#ff0000" core-msg="1" style="display:none">'+options['msg']+'<br></div>';

		$("[core-msg]").remove();
		$(options['holder']).append(html);

		$("[core-msg]").fadeIn(250);

	}

	this.escape_html = function(string) {

		  return (string+'')
		      .replace(/&/g, "&amp;")
		      .replace(/</g, "&lt;")
		      .replace(/>/g, "&gt;")
		      .replace(/"/g, "&quot;")
		      .replace(/'/g, "&#039;");

	};
	
	this.get_inputs = function(options) { // Get all inputs that are exist in a selector

		options = Core.ensure_defaults({
			holder: '',
			replace: '',
			replace_with: ''
		}, options);
		
		var inputs = {};
		
		$(options['holder']).find(':input').each(function() {
			
			inputs[ ($(this).attr('id')+'').replace(options['replace'], options['replace_with']) ] = $(this).val();

		});

		return inputs;

	};

	this.count = function(arr) {

		var c = 0;

		for(k in arr) {

			++c;

		}

		return c;

	};

	this.multi_find = function(arr, items) { // Search a multi-dimensional array by key

          var item_qty = Core.count(items);
          var match_qty = 0;

          for(k in arr) {

               match_qty = 0;

               for(k2 in items) {

                    if(arr[k][k2] = items[k2]) { ++match_qty; }

               }

               if(match_qty == item_qty) {

                    return k;

               }

          }

          return -1;

     }

	this.anchor_based = Array();

	this.anchor_based_run = function(params) { // Sets form values to something from the page anchor

		// params = value from Core.anchor_params()
		
		var key = '';

		for(k in Core.anchor_based) {

			selector = Core.anchor_based[k]['selector'];

			if(params[selector] != null && params[selector] != undefined) {
				
				$('#'+selector).val(params[selector]);

			}

		}		

	};

	this.anchor_string = '';

	this.anchor_params = function() { // Retrieve anchor values as parameters

		var raw = (window.location.hash+'');

		if(raw.indexOf('#') == 0) {

			raw = raw.substr(1);

		}

		var result = {
			updated: 0,
			params: {}
		};

		if(raw != Core.anchor_string) {

			this.anchor_string = raw;
			result['updated'] = 1;

		}

		var raw_split = raw.split('&');
		var raw_var = {};

		for(k in raw_split) {

			raw_var = (raw_split[k]+'').split('=');

			if(raw_var[1] != undefined && raw_var[1] != null) {

				raw_var[0] = decodeURIComponent(raw_var[0]);
				raw_var[1] = decodeURIComponent(raw_var[1]);
				result['params'][raw_var[0]] = raw_var[1];

			}

		}

		return result;

	};

	this.process_error = function() {

		Core.modal({
	        msg: "There was an error while processing your request. Please refresh the page and try again",
	        footer: '<button class="btn" data-dismiss="modal" aria-hidden="true">Okay</button>'
	    });

	};

	this.trim = function(str, charlist) {
		  // http://kevin.vanzonneveld.net
		  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		  // +   improved by: mdsjack (http://www.mdsjack.bo.it)
		  // +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
		  // +      input by: Erkekjetter
		  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		  // +      input by: DxGx
		  // +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
		  // +    tweaked by: Jack
		  // +   bugfixed by: Onno Marsman
		  // *     example 1: trim('    Kevin van Zonneveld    ');
		  // *     returns 1: 'Kevin van Zonneveld'
		  // *     example 2: trim('Hello World', 'Hdle');
		  // *     returns 2: 'o Wor'
		  // *     example 3: trim(16, 1);
		  // *     returns 3: 6
		  var whitespace, l = 0,
		    i = 0;
		  str += '';

		  if (!charlist) {
		    // default list
		    whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
		  } else {
		    // preg_quote custom list
		    charlist += '';
		    whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
		  }

		  l = str.length;
		  for (i = 0; i < l; i++) {
		    if (whitespace.indexOf(str.charAt(i)) === -1) {
		      str = str.substring(i);
		      break;
		    }
		  }

		  l = str.length;
		  for (i = l - 1; i >= 0; i--) {
		    if (whitespace.indexOf(str.charAt(i)) === -1) {
		      str = str.substring(0, i + 1);
		      break;
		    }
		  }

		  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
		};

	this.ucwords = function(str) {
	  // http://kevin.vanzonneveld.net
	  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	  // +   improved by: Waldo Malqui Silva
	  // +   bugfixed by: Onno Marsman
	  // +   improved by: Robin
	  // +      input by: James (http://www.james-bell.co.uk/)
	  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // *     example 1: ucwords('kevin van  zonneveld');
	  // *     returns 1: 'Kevin Van  Zonneveld'
	  // *     example 2: ucwords('HELLO WORLD');
	  // *     returns 2: 'HELLO WORLD'
	  return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
	    return $1.toUpperCase();
	  });
	}

	this.safe_echo = function(string, quote_style, charset, double_encode) {
		  // http://kevin.vanzonneveld.net
		  // +   original by: Mirek Slugen
		  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		  // +   bugfixed by: Nathan
		  // +   bugfixed by: Arno
		  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		  // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
		  // +      input by: Ratheous
		  // +      input by: Mailfaker (http://www.weedem.fr/)
		  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
		  // +      input by: felix
		  // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
		  // %        note 1: charset argument not supported
		  // *     example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
		  // *     returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
		  // *     example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
		  // *     returns 2: 'ab"c&#039;d'
		  // *     example 3: htmlspecialchars("my "&entity;" is still here", null, null, false);
		  // *     returns 3: 'my &quot;&entity;&quot; is still here'
		  string += "";
		  var optTemp = 0,
		    i = 0,
		    noquotes = false;
		  if (typeof quote_style === 'undefined' || quote_style === null) {
		    quote_style = 2;
		  }
		  string = string.toString();
		  if (double_encode !== false) { // Put this first to avoid double-encoding
		    string = string.replace(/&/g, '&amp;');
		  }
		  string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

		  var OPTS = {
		    'ENT_NOQUOTES': 0,
		    'ENT_HTML_QUOTE_SINGLE': 1,
		    'ENT_HTML_QUOTE_DOUBLE': 2,
		    'ENT_COMPAT': 2,
		    'ENT_QUOTES': 3,
		    'ENT_IGNORE': 4
		  };
		  if (quote_style === 0) {
		    noquotes = true;
		  }
		  if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
		    quote_style = [].concat(quote_style);
		    for (i = 0; i < quote_style.length; i++) {
		      // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
		      if (OPTS[quote_style[i]] === 0) {
		        noquotes = true;
		      }
		      else if (OPTS[quote_style[i]]) {
		        optTemp = optTemp | OPTS[quote_style[i]];
		      }
		    }
		    quote_style = optTemp;
		  }
		  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
		    string = string.replace(/'/g, '&#039;');
		  }
		  if (!noquotes) {
		    string = string.replace(/"/g, '&quot;');
		  }

		  return string;
		}

	this.serialize = function serialize(mixed_value) {
		  // http://kevin.vanzonneveld.net
		  // +   original by: Arpad Ray (mailto:arpad@php.net)
		  // +   improved by: Dino
		  // +   bugfixed by: Andrej Pavlovic
		  // +   bugfixed by: Garagoth
		  // +      input by: DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html)
		  // +   bugfixed by: Russell Walker (http://www.nbill.co.uk/)
		  // +   bugfixed by: Jamie Beck (http://www.terabit.ca/)
		  // +      input by: Martin (http://www.erlenwiese.de/)
		  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net/)
		  // +   improved by: Le Torbi (http://www.letorbi.de/)
		  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net/)
		  // +   bugfixed by: Ben (http://benblume.co.uk/)
		  // %          note: We feel the main purpose of this function should be to ease the transport of data between php & js
		  // %          note: Aiming for PHP-compatibility, we have to translate objects to arrays
		  // *     example 1: serialize(['Kevin', 'van', 'Zonneveld']);
		  // *     returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
		  // *     example 2: serialize({firstName: 'Kevin', midName: 'van', surName: 'Zonneveld'});
		  // *     returns 2: 'a:3:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";s:7:"surName";s:9:"Zonneveld";}'
		  var val, key, okey,
		    ktype = '', vals = '', count = 0,
		    _utf8Size = function (str) {
		      var size = 0,
		        i = 0,
		        l = str.length,
		        code = '';
		      for (i = 0; i < l; i++) {
		        code = str.charCodeAt(i);
		        if (code < 0x0080) {
		          size += 1;
		        }
		        else if (code < 0x0800) {
		          size += 2;
		        }
		        else {
		          size += 3;
		        }
		      }
		      return size;
		    },
		    _getType = function (inp) {
		      var match, key, cons, types, type = typeof inp;

		      if (type === 'object' && !inp) {
		        return 'null';
		      }
		      if (type === 'object') {
		        if (!inp.constructor) {
		          return 'object';
		        }
		        cons = inp.constructor.toString();
		        match = cons.match(/(\w+)\(/);
		        if (match) {
		          cons = match[1].toLowerCase();
		        }
		        types = ['boolean', 'number', 'string', 'array'];
		        for (key in types) {
		          if (cons == types[key]) {
		            type = types[key];
		            break;
		          }
		        }
		      }
		      return type;
		    },
		    type = _getType(mixed_value)
		  ;

		  switch (type) {
		    case 'function':
		      val = '';
		      break;
		    case 'boolean':
		      val = 'b:' + (mixed_value ? '1' : '0');
		      break;
		    case 'number':
		      val = (Math.round(mixed_value) == mixed_value ? 'i' : 'd') + ':' + mixed_value;
		      break;
		    case 'string':
		      val = 's:' + _utf8Size(mixed_value) + ':"' + mixed_value + '"';
		      break;
		    case 'array': case 'object':
		      val = 'a';
		  /*
		        if (type == 'object') {
		          var objname = mixed_value.constructor.toString().match(/(\w+)\(\)/);
		          if (objname == undefined) {
		            return;
		          }
		          objname[1] = this.serialize(objname[1]);
		          val = 'O' + objname[1].substring(1, objname[1].length - 1);
		        }
		        */

		      for (key in mixed_value) {
		        if (mixed_value.hasOwnProperty(key)) {
		          ktype = _getType(mixed_value[key]);
		          if (ktype === 'function') {
		            continue;
		          }

		          okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
		          vals += this.serialize(okey) + this.serialize(mixed_value[key]);
		          count++;
		        }
		      }
		      val += ':' + count + ':{' + vals + '}';
		      break;
		    case 'undefined':
		      // Fall-through
		    default:
		      // if the JS object has a property which contains a null value, the string cannot be unserialized by PHP
		      val = 'N';
		      break;
		  }
		  if (type !== 'object' && type !== 'array') {
		    val += ';';
		  }
		  return val;
		}

};

$(document).ready(function() {

	$.fn.hasAttr = function(attr) {

	   	var attr_value = this.attr(attr);

	   	return (typeof attr_value !== 'undefined' && attr_value !== false);

	}

	// Make it so that if the enter key is pressed while focused on an input, it's input method is triggered
	$('input[origin_form]').keyup(function(ev) {

		if(ev['keyCode'] == 13) {
			
			$('#'+($(this).attr('origin_form'))).find('*[is-submit]').trigger('click');

		}

	});

	// Create functionality for checkbox binding
	$(':checkbox').on('change', null, function() {

          $("*[check-bind='"+$(this).attr('id')+"']").filter(function() {

               return (!$(this).hasAttr('check-bind-skip-bold'));

          }).css({
               fontWeight: ($(this).prop('checked')) ? 'bold' : 'normal'
          });

     });

     $('*[check-bind]').on('click', 'button', function() {

          var check = $('#'+$(this).attr('check-bind'));

          check.prop('checked', !check.prop('checked')).trigger('change');

     }).on('mouseenter', function() {

     	$(this).css('cursor', 'pointer');

     });

     setInterval(function() {

     	var params = Core.anchor_params();

     	if(params['updated'] == 1) {

     		Core.anchor_based_run(params['params']);

     	}

     }, 500);

     var hash = window.location.hash;

     if((hash+"").indexOf("delay:")) {

     	var hash_split = hash.split("delay:");
     	if(hash_split[1] != null && hash_split[1] != undefined) {

     		setTimeout(function() {

     			window.location.hash = hash_split[1];

     		}, 500);

     	}

     }
     
     // Setup button select group
     $(document).on("click", "[radio-group]", function() {
     	
     	var group = $(this).attr('radio-group');

     	$("[radio-group='"+group+"']").attr('radio-group-active', 0).removeClass('register_button_active').addClass('register_button');

     	$(this).attr("radio-group-active", 1).removeClass('register_button').addClass('register_button_active');
     	
     	$("#"+group).val($(this).attr('use-value')).trigger("change");

     });

});

(function(d){d.fn.numeric=function(a,c){"boolean"===typeof a&&(a={decimal:a});a=a||{};"undefined"==typeof a.negative&&(a.negative=!0);var h=!1===a.decimal?"":a.decimal||".",b=!0===a.negative?!0:!1;c="function"==typeof c?c:function(){};return this.data("numeric.decimal",h).data("numeric.negative",b).data("numeric.callback",c).keypress(d.fn.numeric.keypress).keyup(d.fn.numeric.keyup).blur(d.fn.numeric.blur)};d.fn.numeric.keypress=function(a){var c=d.data(this,"numeric.decimal"),h=d.data(this,"numeric.negative"),
b=a.charCode?a.charCode:a.keyCode?a.keyCode:0;if(13==b&&"input"==this.nodeName.toLowerCase())return!0;if(13==b)return!1;var f=!1;if(a.ctrlKey&&97==b||a.ctrlKey&&65==b||a.ctrlKey&&120==b||a.ctrlKey&&88==b||a.ctrlKey&&99==b||a.ctrlKey&&67==b||a.ctrlKey&&122==b||a.ctrlKey&&90==b||a.ctrlKey&&118==b||a.ctrlKey&&86==b||a.shiftKey&&45==b)return!0;if(48>b||57<b){var e=d(this).val();if(0!==e.indexOf("-")&&h&&45==b&&(0===e.length||0===parseInt(d.fn.getSelectionStart(this),10)))return!0;c&&(b==c.charCodeAt(0)&&
-1!=e.indexOf(c))&&(f=!1);8!=b&&9!=b&&13!=b&&35!=b&&36!=b&&37!=b&&39!=b&&46!=b?f=!1:"undefined"!=typeof a.charCode&&(a.keyCode==a.which&&0!==a.which?(f=!0,46==a.which&&(f=!1)):0!==a.keyCode&&(0===a.charCode&&0===a.which)&&(f=!0));c&&b==c.charCodeAt(0)&&(f=-1==e.indexOf(c)?!0:!1)}else f=!0;return f};d.fn.numeric.keyup=function(a){if((a=d(this).val())&&0<a.length){var c=d.fn.getSelectionStart(this),h=d.fn.getSelectionEnd(this),b=d.data(this,"numeric.decimal"),f=d.data(this,"numeric.negative");if(""!==
b&&null!==b){var e=a.indexOf(b);0===e&&(this.value="0"+a);1==e&&"-"==a.charAt(0)&&(this.value="-0"+a.substring(1));a=this.value}for(var m=[0,1,2,3,4,5,6,7,8,9,"-",b],e=a.length,g=e-1;0<=g;g--){var k=a.charAt(g);0!==g&&"-"==k?a=a.substring(0,g)+a.substring(g+1):0!==g||(f||"-"!=k)||(a=a.substring(1));for(var n=!1,l=0;l<m.length;l++)if(k==m[l]){n=!0;break}n&&" "!=k||(a=a.substring(0,g)+a.substring(g+1))}f=a.indexOf(b);if(0<f)for(e-=1;e>f;e--)a.charAt(e)==b&&(a=a.substring(0,e)+a.substring(e+1));this.value=
a;d.fn.setSelection(this,[c,h])}};d.fn.numeric.blur=function(){var a=d.data(this,"numeric.decimal"),c=d.data(this,"numeric.callback"),h=this.value;""!==h&&(RegExp("^\\d+$|^\\d*"+a+"\\d+$").exec(h)||c.apply(this))};d.fn.removeNumeric=function(){return this.data("numeric.decimal",null).data("numeric.negative",null).data("numeric.callback",null).unbind("keypress",d.fn.numeric.keypress).unbind("blur",d.fn.numeric.blur)};d.fn.getSelectionStart=function(a){if(a.createTextRange){var c=document.selection.createRange().duplicate();
c.moveEnd("character",a.value.length);return""===c.text?a.value.length:a.value.lastIndexOf(c.text)}return a.selectionStart};d.fn.getSelectionEnd=function(a){if(a.createTextRange){var c=document.selection.createRange().duplicate();c.moveStart("character",-a.value.length);return c.text.length}return a.selectionEnd};d.fn.setSelection=function(a,c){"number"==typeof c&&(c=[c,c]);if(c&&c.constructor==Array&&2==c.length)if(a.createTextRange){var d=a.createTextRange();d.collapse(!0);d.moveStart("character",
c[0]);d.moveEnd("character",c[1]);d.select()}else a.setSelectionRange&&(a.focus(),a.setSelectionRange(c[0],c[1]))}})(jQuery);

function cancelZoom()
{
    var d = document,
        viewport,
        content,
        maxScale = ',maximum-scale=',
        maxScaleRegex = /,*maximum\-scale\=\d*\.*\d*/;
 
    // this should be a focusable DOM Element
    if(!this.addEventListener || !d.querySelector) {
        return;
    }
 
    viewport = d.querySelector('meta[name="viewport"]');
    content = viewport.content;
 
    function changeViewport(event)
    {
        // http://nerd.vasilis.nl/prevent-ios-from-zooming-onfocus/
        viewport.content = content + (event.type == 'blur' ? (content.match(maxScaleRegex, '') ? '' : maxScale + 10) : maxScale + 1);
    }
 
    // We could use DOMFocusIn here, but it's deprecated.
    this.addEventListener('focus', changeViewport, true);
    this.addEventListener('blur', changeViewport, false);
}
 
// jQuery-plugin
(function($)
{
    $.fn.cancelZoom = function()
    {
        return this.each(cancelZoom);
    };
 
    // Usage:
    $('input:text,select,textarea').cancelZoom();
})(jQuery);