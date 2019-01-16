// Uses the fetch API (only support in Chrome and Firefox - use polyfills otherwise)
import { cookie, store } from 'utils/Storage';
//import xhr from 'xhr';

export default class Request {
	request = null;
	type = '';
	url = '';
	data = {};
	onSuccess = null;
	onFailure = null;

	constructor(opts: any = {}) {
		if (typeof opts.type != 'undefined') 
			this.type = opts.type;

		this.request = null;
		this.type = 'get';
		this.url = opts.url || '';
		this.data = opts.data || {};
		this.onSuccess = opts.onSuccess || null;
		this.onFailure = opts.onFailure || null;
	}

	setData(value) {
		this.data = value;
		return this;
	}

	addData(key, value) {
		this.data[key] = value;
		return this;
	}

	setUrl(url) {
		this.url = url;
		return this;
	}

	setType(type) {
		this.type = type;
		return this;
	}

	setSuccessCallback(cb) {
		this.onSuccess = cb;
	}

	setFailureCallback(cb) {
		this.onFailure = cb;
	}

	// Returns a prommise
    send(type = this.type) {
    	var self = this;

    	if (!this.url) 
    		throw new Error("Need a url for the Request");

    	// todo: use some native request 
    	return new Promise((resolve, reject) => {
			var url = this.url;

   			var opts: any = {
				method: type,
				mode: 'cors',
				headers: {},
				useXDR: true
			};

			if (type == 'post' || type == 'delete') {
				opts.body = JSON.stringify( self.data );
			} else if (type == 'get') {
				if (self.data) {
					var hasParams = url.indexOf('?') >= 0;
					var qs = (hasParams ? '&' : '?') + 
				        Object.keys(self.data).map(function(key) {
				            return encodeURIComponent(key) + '=' +
				                encodeURIComponent(self.data[key]);
				        }).join('&');
				    url += qs;
				}
			}

			opts.headers['Access-Control-Allow-Headers'] = true;

			// Add Authorization header to all requests if we're authenticated:
			var token = cookie('token') || store('token');
			if (token) {
				opts.headers["Authorization"] = token;
			}

			// xhr(url, opts, function(err, resp) {
			// 	if (err) {
			// 		console.log("REQUEST ERROR", err, this.url);
			// 		return reject(err);
			// 	}

			//   	var json = JSON.parse(resp.body);

   //  			if (json.success == false) {
   //  				if (self.onFailure)
   //  					self.onFailure(json);
   //  				return reject(r);
   //  			}

			// 	if (self.onSuccess)
			// 		self.onSuccess(json);

			// 	return resolve(json);

			// })

     		fetch(url, opts)
    		.then((r) => {
    			r.json()
    			.then((data) => {
    				data.status = r.status;
    				return resolve(data);
    			});

    // 			cl('done', json);

    // 			if (json.success == false || typeof json.errors != 'undefined') {
    // 				if (self.onFailure)
    // 					self.onFailure(json, r.status);
    // 				return reject(json, r.status);
    // 			}

				// if (self.onSuccess)
				// 	self.onSuccess(json, r.status);

				// cl("resolving request...");

				// return resolve(json, r.status);
			})
			.catch((e) => {
				console.log("REQUEST ERROR", e, this.url,);
				return reject(e);
			})
    	});
	}
}