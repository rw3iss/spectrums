import Api from 'data/api/Api'
import config from 'config/config';

const cl = (window as any).cl;

class UserApi extends Api {
	baseUrl = config.apiBaseUrl + '/user';

	constructor() {
		super();
	}
	
	login(creds) {
		console.log("LOGIN", this.baseUrl, config.apiBaseUrl)
		return this.request({
			type: 'post',
			url: this.baseUrl + '/login',
			data: creds
		});
	}

	createUser(data) {
		cl("create user...");
		return this.request({
			type: 'post',
			url: this.baseUrl + '/create',
			data: data
		})
	}

	getUsersTrips(userId) {
		return this.get( this.baseUrl + '/' + userId + '/trips' );
	}
}

export default new UserApi();
