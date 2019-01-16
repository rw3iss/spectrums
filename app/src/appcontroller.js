import EventBus from 'eventbusjs'
import auth from 'utils/Auth'
import { browserHistory } from 'react-router';

// Can do app init stuff here before the React app is mounted and rendered.

class AppController {

	constructor() {
		EventBus.addEventListener('APP_INIT', 			this.onAppInit.bind(this));
		EventBus.addEventListener('APP_ERROR', 			this.onAppError.bind(this));
		EventBus.addEventListener('APP_NEEDS_LOGIN', 	this.onAppNeedsLogin.bind(this));
	}

	// bootstraps the apps, sets up app-wide events
	onAppInit(e) {
		var self = this;
		this.loadAppData();
		// Todo: set an interval to make sure we're "logged in"?
	}

	onAppError(e) {
	 	console.log("AppController.onAppError()", e, e.target.error.stack)
		if (e.target.type == 'connection') {
			cl(" >>>>> Connection error... HANDLE THIS ");
		} else if (e.target.type == 'api' && e.target.error.message == 'Failed to fetch') {
			cl("  ||  API IS DOWN.  ||  (go to offline mode?)");
		}
	}

	onAppNeedsLogin(e) {
		auth.logout();

		var loginPath = '/login';
		if (typeof e.target.previousRoute != 'undefined') {
			loginPath += '?redirect=' + e.target.previousRoute;
		}

		browserHistory.push(loginPath);
	}

	// Load app-data
	loadAppData() {
	}

	ensureLogin() {
	    if ( !auth.loggedIn() ) {
	        browserHistory.push('/login');
	    }
	}
}

export default new AppController();