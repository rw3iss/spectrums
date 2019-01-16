import * as React from 'react';

// Mainly used to assign a blank component to a 'dummy route' (but still have the router pick it up)

export default class EmptyComponent extends React.Component {
	
	render() {
		return (
			<div></div>
		);
	}

};



