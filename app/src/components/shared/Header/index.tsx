import * as React from 'react';
import { Link } from 'react-router-dom';
//import * as Auth from 'utils/Auth';
import './style';

export default class Header extends React.Component<any,any> {

	constructor(props) {
		super(props);
	}

	render() {
		var loggedIn = false;//Auth.loggedIn();

		return (
			<div className="header">

				<Link className="logo" to="/"><h1>Spectrums</h1></Link>

				<nav>
					{ loggedIn && <Link to="/dashboard">Dashboard</Link> }

					{ loggedIn && <Link to="/logout">Logout</Link> }

					{ !loggedIn && <Link to="/login">Login</Link> }
				</nav>

			</div>
		);
	}
}
