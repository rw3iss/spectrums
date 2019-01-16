import * as React from 'react';
import EventBus from 'eventbusjs';
import { serializeForm } from 'utils/js-utils';
import { store, cookie } from 'utils/storage'
import Auth from 'utils/Auth';
import { UserApi } from 'data/api';
import UserStore from 'data/stores';
import './style';

export default class LoginPrompt extends React.Component {

	constructor(props) {
		super(props);
		var self = this;

    	this.loginSubmit = this.loginSubmit.bind(this);

		EventBus.addEventListener("APP_NEEDS_LOGIN", function(r) {
			console.log("app needs login (loginprompt)");
			self.setState({ enabled: true });
		});

		EventBus.addEventListener("USER_LOGGED_IN", function(r) {
			self.setState({ enabled: false });
		});

		EventBus.addEventListener("USER_LOGGED_OUT", function(r) {
			self.setState({ enabled: true });
		});

		EventBus.addEventListener("HIDE_LOGIN", function(r) {
			self.setState({ enabled: false });
		});
	}

	loginSubmit(e) {
		var self = this;
		e.preventDefault();
		var form = document.getElementById('login-form'); // Todo: use react reference
		var creds = serializeForm(form);
		delete creds.submit; //todo: remove

		if ( ! Auth.isValidLogin(creds.login) ) {
			return this.setState({ errors: ['Invalid login.'] });
		}

		// Clear out the current token as we'll be getting a new one and don't want to send the old.
		cookie('token', null);
		store('token', null);
		
		UserApi.login(creds)
	        .then((r) => {
	          	console.log("Login returned...", r);
	        	
	          if (r.success) {
	            var message = r.message;

	            store('token', r.token);
	            cookie('token', r.token);
	            EventBus.dispatch('USER_LOGGED_IN', r);

	            UserStore.setCurrentUser(r.user);
	          }
	        })
	        .catch((e) => {
	        	cl("Error logging in (loginprompt", e);
	        	self.setState({ errors: e.errors });
	       });


		// authUtils.login(creds)
		// 	.then((r) => {
		// 		console.log("login result", r);
		// 	})
		// 	.catch((e) => {
		// 		console.log("login error", e);
		// 		this.setState({ errors: e.errors });
		// 	});
	}

	loginWithFacebook() {
		
	}

	componentWillMount() {
    	this.setState({
    		enabled: this.props.enabled,
    		errors: null
    	});
	}
	componentWillReceiveProps(nextProps) {
	}

	render() {
		var self = this;
		return (
			<div>
			{ (this.state.enabled || this.props.enabled) &&
				<div className={style.loginprompt + ' enabled'}>
					<h1>Login Prompt</h1>
					<form id="login-form" action="" onSubmit={this.loginSubmit}>
						<input type="text" placeholder="Username or E-mail" name="login" />
						<input type="password" placeholder="Password" name="password" />
						<input type="submit" name="submit" value="Submit"/>

						<div className="btn btn-default" onClick={this.loginWithFacebook}>Login with Facebook</div>
					</form>

					{(self.state.errors ?
						<div className="errors">
							<ul>
								{self.state.errors.map(function(e, i) {
					            	return <li key={i}>{e}</li>;
					        	})}
							</ul>
						</div>
						: <div></div>
					)}
				</div>
			}
			</div>
			
		);
	}
}
