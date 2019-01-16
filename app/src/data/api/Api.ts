import Request from 'utils/Request'
import * as EventBus from 'eventbusjs'

const cl = (window as any).cl;

export default class Api {

	// Meant to be abstract.
    constructor() {
	    if (this.constructor === Api) {
	      throw new TypeError("Can not construct abstract class.");
	    }
	}

	get(url, data?) {
		return this.request({
			type: 'get',
			url: url,
			data: data
		});
	}

	post(url, data?) {
		return this.request({
			type: 'post',
			url: url,
			data: data
		});
	}

	delete(url, data?) {
		return this.request({
			type: 'delete',
			url: url,
			data: data
		});
	}

	// takes a Request object and handles the response
	request(opts) {
		cl("Request", opts);
		return new Promise(async (resolve, reject) => {
			let req = new Request(opts);
			try {
				let r: any = await req.send()
				console.log('request finished...', r, status);
				if (r.success == false || typeof r.errors != 'undefined') {
					// parse error
					return this.handleApiError(r, resolve, reject);
				}

				return resolve(r);
			} catch(e) {
				this.handleApiError(e, resolve, reject);
				return reject(e);
			}
		});
	}
	
	// Talks to the rest of the app when an error occurs
	// Todo: move these into ErrorHandler component 
	handleApiError(e, resolve, reject) {
		if (e.status == 401) {
			//auth.logout();
			EventBus.dispatch('APP_NEEDS_LOGIN', { type: 'api', error: e });
			return resolve(e);
		} else {
			EventBus.dispatch('APP_ERROR', { type: 'api', error: e });
			return reject(e);
		}
	}
	
	// doesn't work fuck technology
	streamGet(url, cb) {
		var jsonStream = new EventSource(url, { withCredentials: true });

		jsonStream.onmessage = function (e) {
			cl("event source data", e);
			var message = JSON.parse(e.data);
			cb(message);
		};

		jsonStream.onerror = function (e) {
			cl("event source error", e, (e.target as any).readyState);
			jsonStream.close();
		};
	}

}


