import * as React from 'react';
import './style';

var DEFAULT_BASE_FREQ = 18; // hertz
var DEFAULT_NUM_STEPS = 120;

/* How normal scales are created:
     -take full length (pretermined bandwidth)
     -keep diving by integers (1, 2, 3, etc...)
     -notes are made by different combinations of these integer ratios
 */

const cl = (window as any).cl;


function sineWaveAt(audioContext, sampleNumber, tone) {
	var sampleFreq = audioContext.sampleRate / tone
	return Math.sin(sampleNumber / (sampleFreq / (Math.PI*2)))
}

// Play each note in the spectrum
function playSound(audioContext, freq, length, volume) {
	var arr: any = [], volume = volume, seconds = length, tone = freq

	for (var i = 0; i < audioContext.sampleRate * seconds; i++) {
		arr[i] = sineWaveAt(audioContext, i, tone) * volume
	}

	var buf = new Float32Array(arr.length)
	for (var i = 0; i < arr.length; i++) buf[i] = arr[i]
	var buffer = audioContext.createBuffer(1, buf.length, audioContext.sampleRate)
	buffer.copyToChannel(buf, 0)
	var source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(audioContext.destination);
	source.start(0);
}

class Spectrum {
	id = null;
	name: string;
	baseFreq: number;
	minFreq: number;
	maxFreq: number;
	numSteps: number;
	stepMultiply: number;
	stepAdd: number;
	shift: number;
	notes: Array<any>;
	playLength: number;
	showDetails: boolean;

	constructor(id?) {
		this.id = id || 0;
		this.name = '';

		this.baseFreq = DEFAULT_BASE_FREQ;
		this.minFreq = this.baseFreq; // lowest frequency that will be generated
		this.maxFreq = 50000; //  highest frequency that will be generated

		this.numSteps =  DEFAULT_NUM_STEPS;

		this.stepMultiply = 2; // double each next note
		this.stepAdd = 0; // added to each note during the step sequence. The result will be used as the value for the next step.
		this.shift = 0; // added to each note after the spectrum is generated

		this.notes = []; // notes that will be generated for this spectrum

		this.playLength = 1; // seconds

		this.showDetails = false;
	}
}

export default class Project extends React.Component<any,any> {
	audioContext: any = undefined;

	constructor(props) {
		super(props);

		this.state = {
			project: {
				id: this.props.id || undefined,
				spectrums: [],
				scales: []
			},
			flashMessages: []
		};

	    (window as any).AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
	    this.audioContext = new AudioContext();
	}

	componentDidMount() {
		if (this.props.id) {
			this.load(this.props.id);
		}
	}

	load(id) {
		if (!id) id = this.props.id;

		if (window.localStorage) {
			let project;
			let data = window.localStorage.getItem('project#' + id);
			if (data) {
				project = JSON.parse(data);
			} else {
				return alert("Project " + id + " hasn't been saved.");
			}

			cl("Loading...", project);
			this.setState({ project: project });
		} else{
			alert("No local storage to load.");
		}

		this.forceUpdate();
	}

	save() {
		if (window.localStorage) {
			window.localStorage.setItem( 'project#' + this.state.project.id, JSON.stringify(this.state.project) );
			cl("Save...", window.localStorage.getItem('project#' + this.state.project.id));
		} else{
			alert("No local storage to save.");
		}
	}

	onAddNewSpectrum(e) {
		var s = new Spectrum(this.state.project.spectrums.length);
		this.state.project.spectrums = [...this.state.project.spectrums, s]
		this.forceUpdate();
	}

	onAddNewScale(e) {
		var s = { id: this.state.project.scales.length, name: 'blah' };
		this.state.project.scales = [...this.state.project.scales, s]
		this.forceUpdate();
	}

	onOptionChange(s, e) {
		var prop = e.target.name;
		var value = e.target.value;
		s[prop] = value;

		this.generateSpectrum(s);

		this.forceUpdate();
	}

	generateSpectrum(s) {
		s.notes = [];

		function _addNoteToSpectrum(s, freq) {
			if ( freq < parseFloat(s.minFreq) ) {
				freq *= 2;
				return _addNoteToSpectrum(s, freq);
			} else if ( freq > parseFloat(s.maxFreq) ) {
				freq *= .5;
				return _addNoteToSpectrum(s, freq);
			} else {
				// Only add if the frequency doesn't exist:
				var existing = s.notes.filter((f) => {
					return f == freq;
				})
				if (!existing.length)
					s.notes.push(freq);
			}
		}

		var currFreq: any = parseFloat(s.baseFreq);
		_addNoteToSpectrum(s, currFreq);

		for (var i=0; i < s.numSteps; i++) {
			//cl("generating note", i, 'curr', currFreq, 'next', parseInt(currFreq) * parseInt(s.stepMultiply) + parseInt(s.stepAdd));
			currFreq = parseFloat(currFreq) * parseFloat(s.stepMultiply) + parseFloat(s.stepAdd);
			_addNoteToSpectrum(s, currFreq);
		}

		// shift each generated note
		s.notes.forEach((item, i) => {
			s.notes[i] = s.notes[i] + parseFloat(s.shift);
		});

		cl("Generated spectrum = ", s.notes.length + ' notes.');
	}

	playSpectrum(s) {
		if (!s.notes.length) {
			this.generateSpectrum(s);
		}

		var self = this;
		var masterVolume = 1;
		var soundLength = 1;

		// plays all the notes
		s.notes.forEach((note, i) => {
			playSound(self.audioContext, note, s.playLength || soundLength, masterVolume);
		});
	}

	toggleSpectrumDetails(s) {
		if (!s.notes.length) {
			this.generateSpectrum(s);
		}

		s.showDetails = ( typeof s.showDetails != 'undefined' ? !s.showDetails : true);
		this.forceUpdate();
	}

	_parseFrequency(f) {
		return Math.round(f*100)/100;
	}

	onNoteClick(e, freq, i) {
		cl("Click", e.target, freq, i);

		var range = document.createRange();
    	range.selectNode(e.target);
		window.getSelection().addRange(range);
		document.execCommand("copy");

		this.flashMessage('Copied ' + e.target.innerHTML);

		playSound(this.audioContext, freq, 1, 1);
	}

	flashMessage(msg) {
		var self = this;
		var m: any = new Object();
		m.message = msg;
		this.state.flashMessages.push(m);
		this.forceUpdate();

		// Create closure to preserve state for the timeout
		(function() {
			var _m = m;
			window.setTimeout(() => {
				var msgs = self.state.flashMessages;
				
				msgs.forEach((mm, i) => {
					cl("Message match?", mm, _m)
					var match = _m === mm;
					if(match) {
						cl("MATCH", i);
						msgs.splice(i,1);
					}
				});

				self.setState({ flashMessages: msgs });
			}, 3000);
		})();
	}

	removeSpectrum(s) {
		if (confirm("Are you sure you want to delete this spectrum?")) {
			var project = this.state.project;
			project.spectrums = this.state.project.spectrums.filter((_s, i) => _s !== s);
			this.setState({
				project: project
			})
		}
	}

	render() {
   		var self = this;

		return (
			<div className="view project">

				<div className="header">
					New Project
				</div>

				<div className="messages">
					<h3>Messages:</h3>
					<ul className="message-list">
					{ self.state.flashMessages.map(function(m) {
                        return (
                        		<li>{m.message}</li>
                        	);
                    }) }
                    </ul>
                </div>

				<div id="spectrums">

					<div className="heading">
						<div className="btn btn-small" onClick={ ()=>{ this.save.call(self) } }>Save</div>
						<div className="btn btn-small" onClick={ ()=>{ this.load.call(self) } }>Load</div>

						<h2>Frequency spectrums: ({self.state.project.spectrums.length})</h2>
						<div className="btn btn-small" onClick={ ()=>{ this.onAddNewSpectrum.call(self) } }>+ Create New Spectrum</div>
						<div className="sub">Note: generated notes will be halved or doubled if they are outside the given spectrum rangee (ie. to an octave which fits within min/max frequency values)</div>
					</div>

					<ul className="spectrum-list">
					{ self.state.project.spectrums.map(function(s) {
                        return (
                        	<li key={ s.id }>
                        		<div className="options">
                        			<div className="field name">
                        				<label>Name:</label>
                        				<div className="input"><input type="text" name="name" value={s.name} onChange={(e)=>{self.onOptionChange(s, e)}} /></div>
                        			</div>
                        			<div className="field">
                        				<label>Base frequency:</label>
                        				<div className="input"><input type="text" name="baseFreq" value={s.baseFreq} onChange={(e)=>{self.onOptionChange(s, e)}} /></div>
                        			</div>
                        			<div className="field">
                        				<label>Min. frequency:</label>
                        				<div className="input"><input type="text" name="minFreq" value={s.minFreq}  onChange={(e)=>{self.onOptionChange(s, e)}} /></div>
                        			</div>
                        			<div className="field">
                        				<label>Max. frequency:</label>
                        				<div className="input"><input type="text" name="maxFreq" value={s.maxFreq}  onChange={(e)=>{self.onOptionChange(s, e)}} /></div>
                        			</div>
                        			<div className="field">
                        				<label># Steps:</label>
                        				<div className="input"><input type="text" name="numSteps" value={s.numSteps}  onChange={(e)=>{self.onOptionChange(s, e)}} /></div>
                        			</div>
                        			<div className="field">
                        				<label>Step multiplier:</label>
                        				<div className="input"><input type="text" name="stepMultiply" value={s.stepMultiply} onChange={(e)=>{self.onOptionChange(s, e)}} /></div>
                        			</div>
                        			<div className="field">
                        				<label>Step add:</label>
                        				<div className="input"><input type="text" name="stepAdd" value={s.stepAdd} onChange={(e)=>{self.onOptionChange(s, e)}} /></div>
                        			</div>
                        			<div className="field">
                        				<label>Shift:</label>
                        				<div className="input"><input type="text" name="shift" value={s.shift} onChange={(e)=>{self.onOptionChange(s, e)}} /></div>
                        			</div>
                        			<div className="field">
                        				<label>Play length:</label>
                        				<div className="input"><input type="text" name="playLength" value={s.playLength} onChange={(e)=>{self.onOptionChange(s, e)}} /></div>
                        			</div>
                        			<div className="field actions">
                        				<div className="input"><div className="btn btn-small" onClick={(e)=>{self.playSpectrum.call(self, s)}}>Play All</div></div>
                        				<div className="input"><div className="btn btn-small" onClick={(e)=>{self.toggleSpectrumDetails.call(self, s)}}>See Notes</div></div>
                        				<div className="input"><div className="btn btn-small" onClick={(e)=>{self.removeSpectrum.call(self, s)}}>X</div></div>
                        			</div>
                        		</div>
                        		{ s.showDetails &&
                        			<div className="details">
	                        			<ul className="notes">
											{ s.notes.map(function(freq, i) {
												return ( <li className="note" onClick={(e)=>{ self.onNoteClick.call(self, e, freq, i); }}>
														<span className="index">{ i+1 }</span>
														<span className="frequency">{ self._parseFrequency(freq) }</span>
													</li> );
											}) }
	                        			</ul>
                        			</div>
                        		}
                        	</li>
                        );
                  	}) }
                  	</ul>
				</div>

				{ false && <div className="col">
					<h2>Scales:</h2>
					<div className="btn btn-small" onClick={ ()=>{ this.onAddNewScale.call(self); } }>+ Create New Scale</div>

					<ul className="scale-list">
					{ self.state.project.scales.map(function(s) {
                        return (
                        	<li key={ s.id }>
                        		<div>{s.name}</div>
                        	</li>
                        );
                  	}) }
                  	</ul>
				</div>
				}

			</div>
      );
   }
}