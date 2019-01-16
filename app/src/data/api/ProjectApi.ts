import Api from 'data/api/Api'
import config from 'config/config';

const cl = (window as any).cl;

class ProjectApi extends Api {
	baseUrl = '';

	constructor() {
		super();
		this.baseUrl = config.apiBaseUrl + '/project';
	}
	
	getProject(id) {
		return this.get(this.baseUrl + '/' + id);
	}

	getProjects(filter) {
		return this.get(
			this.baseUrl + 's', 
			filter
		);
		//filter = { type(latest, etc), author (anything they've edited), user (anything they've touched), sorted_by }
	}

	saveProject(project) { 
		return this.post(
			this.baseUrl + (project && project.id ? ('/'+project.id) : ''), 
			project
		);
	}
}

export default new ProjectApi();
