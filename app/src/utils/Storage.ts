// Inspired by https://gist.github.com/Fluidbyte/4718380
function store(key, value?) {
    var lsSupport = false;
    
    // Check for native support
    if (localStorage) {
        lsSupport = true;
    }
    
    // If value is detected, set new or modify store
    if (typeof value !== "undefined" && value !== null) {
        // Convert object values to JSON
        if ( typeof value === 'object' ) {
            value = JSON.stringify(value);
        }
        // Set the store
        if (lsSupport) { // Native support
            localStorage.setItem(key, value);
        } else { // Use Cookie
            cookie(key, value, 30);
        }
    }
    
    // No value supplied, return value
    if (typeof value === "undefined") {
        var data: any = null;
        
        // Get value
        if (lsSupport) { // Native support
            data = localStorage.getItem(key);
        } else { // Use cookie 
            data = cookie(key);
        }
        
        // Try to parse JSON...
        try {
           data = JSON.parse(data);
        }
        catch(e) {
           data = data;
        }
        
        return data;
    }
    
    // Null specified, remove store
    if (value === null) {
        if (lsSupport) { // Native support
            localStorage.removeItem(key);
        } else { // Use cookie
            cookie(key, '', -1);
        }
    }
};

function cookie(key, value?, exp?) {
    // If value is detected, set new or modify store   .
    // If no value supplied, return value.

    /**
     * Creates new cookie or removes cookie with negative expiration
     * @param  key       The key or identifier for the store
     * @param  value     Contents of the store
     * @param  exp       Expiration - creation defaults to 30 days
     */
    if (typeof value !== "undefined") {
        value = value == null ? '' : value;
        
        // Convert object values to JSON
        if ( typeof value === 'object' ) {
            value = JSON.stringify(value);
        }

        var exp = exp || 30;
        var date = new Date();
        date.setTime(date.getTime() + (exp * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toUTCString();
        document.cookie = key + "=" + value + expires + "; path=/";
    }
    
    /**
     * Returns contents of cookie
     * @param  key       The key or identifier for the store
     */
    if (typeof value === "undefined") {
        var nameEQ = key + "=";
        var ca = document.cookie.split(';');
        for (var i = 0, max = ca.length; i < max; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    return null;
}

export {
    store,
    cookie
}