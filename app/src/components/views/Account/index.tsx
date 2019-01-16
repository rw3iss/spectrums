import * as React from 'react';
import { Link } from 'react-router-dom';
//import { UserStore } from 'lib/data/stores';

export default class Account extends React.Component {

	render() {
		var user = { username: 'test' }; //UserStore.getCurrentUser();

		return (
			<div className={'view pad'}>
				<h1>Account: { user.username }</h1>
				<Link to="/dashboard" className="btn">Dashboard</Link>
			</div>
		);
	}
	
}
