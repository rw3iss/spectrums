import * as React from 'react';
import { browserHistory, Link } from 'react-router-dom';
import EventBus from 'eventbusjs'
import * as Auth from 'utils/Auth'
import { serializeForm, $ } from 'utils/js-utils';
import { UserApi } from 'data/api';
import { UserStore } from 'data/stores';

import './style';

export default class Login extends React.Component<any, any> {

   constructor(props) {
      super(props);
      var self = this;

      this.state = {
         loginErrors: null
         , signupErrors: null
      };

      // EventBus.addEventListener("USER_LOGGED_IN", function(r) {
      //     self.forceUpdate();
      // });
   }

   componentWillMount() {
      //Automatic logout
      if (this.props.location.pathname == "/logout") {
         this.logout();
      }
   }

   logout() {
      if (Auth.loggedIn()) {
         Auth.logout();
         EventBus.dispatch("USER_LOGOUT");
      }

      browserHistory.push('/login');
   }

   loginSubmit(e) {
      e.preventDefault();

      var self = this;
      var creds = serializeForm(document.getElementById('login-form'));

      if (!Auth.isValidLogin(creds.login)) {
         return this.setState({ loginErrors: ['Invalid login.'] });
      }

      UserApi.login(creds)
         .then((r) => {
            if (r.success) {
               UserStore.setCurrentUser(r.user, r.token);
               EventBus.dispatch('USER_LOGGED_IN', r);
               browserHistory.push('/dashboard');
            }
         })
         .catch((e) => {
            cl("Error logging in (login)", e);
            self.setState({ loginErrors: e.errors });
         });
   }

   loginWithFacebook() {
      alert('login');
   }

   signupSubmit(e) {
      e.preventDefault();

      var self = this;
      var data = serializeForm($('#signup-form'));
      var errors = [];

      if (!Auth.isValidEmail(data.email)) {
         errors.push('Invalid email.');
      }

      if (!Auth.isValidUsername(data.username)) {
         errors.push('Invalid username.');
      }

      if (errors.length) {
         return self.setState({ signupErrors: errors });
      }

      UserApi.createUser(data)
         .then((r) => {
            if (r.success) {
               cl("user created", r);
               UserStore.setCurrentUser(r.user, r.token);
               EventBus.dispatch('USER_LOGGED_IN', r);
               self.setState({ signupSuccess: true });
            }
         })
         .catch((e) => {
            cl("Error with signup", e);
            self.setState({ signupErrors: e.errors });
         });
   }

   render() {
      var loggedIn = Auth.loggedIn();

		return (
            <div className="view">

            { loggedIn && 
                <div className="logged-in">
                  You are logged in.
                  <Link to="dashboard" className="btn">Go to dashboard</Link>
                  <button className="btn" onClick={this.logout.bind(this)}>Logout</button>
                </div>
            }

            { !loggedIn && 
                <div className="login-signup fill-width">

                    <div className="login form">
                        <h2>Login</h2>
                        <form id="login-form" action="" onSubmit={this.loginSubmit.bind(this)}>
                            <div className="group row">
                                <input className="item" type="text" placeholder="Username or E-mail" name="login" />
                                <input className="item" type="password" placeholder="Password" name="password" />
                            </div>
                            <div className="group row">
                                <input className="item btn" type="submit" name="submit" value="Submit"/>
                                <div className="btn" onClick={this.loginWithFacebook.bind(this)}>Login with Facebook</div>
                            </div>
                        </form>

                        { this.state.loginErrors &&
                            <div className="errors">
                                <ul>
                                    { this.state.loginErrors.map(function(e) {
                                        return <li key={e}>{e}</li>;
                                    }) }
                                </ul>
                            </div>
                        }
                    </div>

                    <div className="signup form">
                        <h2>Signup</h2>
                        <form id="signup-form" action="" onSubmit={this.signupSubmit.bind(this)}>
                          <div className="group row">
                              <input className="item" type="text" placeholder="E-mail" name="email" />
                              <input className="item" type="text" placeholder="Username" name="username" />
                          </div>
                          <div className="group row">
                              <input className="item" type="password" placeholder="Password" name="password" />
                              <input className="item" type="password" placeholder="Password (confirm)" name="passwordConfirm" />
                          </div>
                          <div className="group row">
                             <input className="item btn" type="submit" name="submit" value="Create an Account"/>
                          </div>
                        </form>

                        { this.state.signupErrors &&
                            <div className="errors">
                                <ul>
                                    { this.state.signupErrors.map(function(e) {
                                        return <li key={e}>{e}</li>;
                                    }) }
                                </ul>
                            </div>
                        }

                        { this.state.signupSuccess &&
                            <div className="success">
                                Success!
                            </div>
                        }
                    </div>
                </div>
            }
            </div>
		);
	}

}