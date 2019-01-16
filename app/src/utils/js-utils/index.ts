'use strict';

/* Todo: make this a sort of Site module, or separate:

   DomUtils: {},
   Debug: {},
   etc...

*/


/* This file contains pending functions which should be moved to the above @rw3iss/js-utils library */

var Trace = function() {
  var err = new Error();
  return err.stack;
  //(Error as any).captureStackTrace((this as any), Trace);
  //return obj.stack;
};

var cl = function(...args) {
  var args = new Array();

  for(var arg = 0; arg < arguments.length; ++ arg) {
    var arr = arguments[arg];
    args.push(arr);
  }

  // if last argument is 'trace', print console trace:
  if (arguments[arguments.length] == 'trace') {
    console.trace();
  }

  console.log.apply(console, args);
}

var _debugEnabled = true;
var db = function() {
  if (_debugEnabled) {
    cl(arguments);
  }
}

var _suppressWarnings = true
var consoleError = function(e) {
  if ( (e.indexOf('Warning:') == 0) && _suppressWarnings) return;
  console.log("%c[ERROR]", 'color: red;', e);
}

var on = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};  

var select = function(selector) {
  var els = document.querySelectorAll(selector);
  
  if(els.length == 1) {
    els = els[0];
  }
  return els;
}

var serializeForm = function(form) {
  var obj = {};
  var elements = form.querySelectorAll( "input, select, textarea" );

  for ( var i = 0; i < elements.length; ++i ) {
    var element = elements[i];
    var name = element.name;
    var value = element.value;

    if ( name && element.type != 'submit' ) { 
      obj[ name ] = value;
    }
  }

  return obj;
};

// Returns json object with parts.
var parseUrl = function(path) {
  var urlSections = path.split('/');
  urlSections = urlSections.filter(function(sectionString) {
    return sectionString.length > 0;
  });

  var urlPath = path;

  return {
    urlSections: urlSections,
    urlPath: urlPath
  }
}

// Determines if the given object contains all of the given properties.
var hasProperties = function(object, properties) {
  for(const p of properties) {
    if(!object.hasOwnProperty(p))
      return false;
  }

  return true;
}

// Open external (new) window, auto-centers.
var popupWindow = function(url, w, h) {
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  return window.open(url, '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}

var loadScript = function(url, callback) {
  var script: any  = document.createElement( "script" )
  script.type = "text/javascript";
  if(script.readyState) {  //IE
    script.onreadystatechange = function() {
      if ( script.readyState === "loaded" || script.readyState === "complete" ) {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  //Others
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName( "head" )[0].appendChild( script );
}

var loadStyle = function(url, callback) {
  var script: any = document.createElement( "link" )
  script.rel = "stylesheet";
  if(script.readyState) {  //IE
    script.onreadystatechange = function() {
      if ( script.readyState === "loaded" || script.readyState === "complete" ) {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  //Others
    script.onload = function() {
      callback();
    };
  }

  script.href = url;
  document.getElementsByTagName( "head" )[0].appendChild( script );
}

var getOffset = function(el) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

// Removes a given element from the array
var removeEl = function(array, element) {
  const index = array.indexOf(element);
  if (index != -1)
    array.splice(index, 1);
}



// hack to add cl(console.log) as a global so it's available to any file that requires this one:
if (typeof window != 'undefined') {
  (window as any).cl = cl;
  window.console.error = consoleError;
}

// hack to add cl(console.log) as a global so it's available to any file that requires this one:
if (typeof window != 'undefined') {
  (window as any).db = db;
}




export {
  /* general */
  cl, // console.log shortcut
  db,// "debug" output shortcut, if enabled
  //getTrace: getTrace,
  parseUrl,

  /* objects */
  hasProperties,
  removeEl,

  /* dom stuff */
  select,
  on,
  serializeForm,
  popupWindow,
  loadScript,
  loadStyle,
  getOffset
}