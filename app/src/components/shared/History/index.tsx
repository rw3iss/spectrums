import * as React from 'react';
import './style';

export default class History extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
	}

	componentWillReceiveProps(nextProps) {
	} 

	render() {
        const { HistoryStore } = this.props;
		return (
			<div class={style.history}>
				<h1>History:</h1>	
				<ul>
					{ HistoryStore.history.map((h) => {
		            	return <li>History: {h.name}</li>;
		        	}) }
				</ul>
			</div>
		);
	}
};