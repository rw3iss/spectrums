import * as React from 'react';
import Header from 'components/shared/Header';
import Routes from 'config/Routes';

import 'style/global'; // include all global styles once on the app
import './style';

export default class AppShell extends React.Component {

	constructor(props) {
		super(props);
		console.log("App");
		//cl('loading preserved children', preservedViews);
	}

	render() {
		return (
			<div id="app-container" className="app-container">

				<Header />

				<div className="app-view" id="app-view">

					<Routes />

				</div>

			</div>
		);
	}
	
}
