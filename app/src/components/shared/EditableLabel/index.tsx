import * as React from 'react';

export default class EditableLabel extends React.Component {
	constructor(props) {
		super(props);

		this.onLabelClick = this.onLabelClick.bind(this);
		this.onBlur = this.onBlur.bind(this);

		this.state = {
			editing: false,
			title: props.title
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ title: nextProps.title });
	}

	onLabelClick() {
		this.setState({ editing: true });
	}

	onBlur() {
		this.setState({ editing: false, title: this.textInput.value });
	}

	onKeyPress(e) {
		if (e.charCode == 13) {
			this.textInput.blur();
		}
	}

	render() {
		return (
			<div className="editable-label">

				{ ! this.state.editing && <span className="label" onClick={this.onLabelClick}>{this.state.title}</span> }

				{ this.state.editing && 
					<input type="text" placeholder="" 
						defaultValue={this.state.title}
						onBlur={this.onBlur}
						onKeyPress={this.onKeyPress.bind(this)} 
						ref={(input) => { 
							if (input) {
								this.textInput = input;
								window.setTimeout(function() { input.focus() });
							}
						}} /> 
				}

			</div>
		);
	}
};



