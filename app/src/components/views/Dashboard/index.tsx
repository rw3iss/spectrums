import * as React from 'react';
import { Link } from 'react-router-dom';
import { ProjectStore } from 'data/stores';
import './style';

const cl = (window as any).cl;

export default class Dashboard extends React.Component<any, any> {
	mounted = false;

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			projects: []
		};
		this.mounted = false;
	}

	componentWillMount() {
		this.mounted = true;
	}

	componentDidMount() {
		this.loadData();
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	loadData() {
		var self = this;

		cl('getting projects');

		// todo: get users trips
		// ProjectStore.getProjects()
		// 	.then((r) => {
		// 		if (this.mounted) {
		// 			self.setState({
		// 				project: r.projects,
		// 				loaded: true
		// 			});
		// 		}
		// 	});
	}

	createNewProject() {
		ProjectStore.createNewProject()
			.then((r) => {
				console.log("new project result", r);
			})
			.catch((e) => {
				console.log("createNewProject error", e);
			});
	}

	render() {
		return (
			<div className={'view pad'}>
				<h1>Dashboard</h1>

<br/>
		{ false && <div onClick={this.createNewProject} className="btn">Create new project</div> }

                <Link to='/project/0' className="btn">Load Test Project</Link>

				{ this.state.loaded && 
					<div>
						Project:
						<ul>
                  	{ this.state.projects.map(function(p) {
                        return (
                        	<div key={p.id}>
                        		<Link to={'/project/' + p.id} className="btn">{p.id} - {p.name}</Link>
                        	</div>
                        );
                  	}) }
	               </ul>
	            </div>
				}
		
			</div>
		);
	}

}