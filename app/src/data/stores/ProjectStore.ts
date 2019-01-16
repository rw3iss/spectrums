import { store, cookie } from 'utils/Storage'
import { UserStore } from 'data/stores';
import { ProjectApi } from 'data/api';
import * as EventBus from 'eventbusjs'

//import { UserStore } from 'lib/data/stores/UserStore';

class ProjectStore {
	api = '/api';
	_dataLoaded = false;
	_projects = [];

	constructor() {
	}

	getProjects() {
		return this._projects;
	}

	getProject(id) {
		var self = this;
		return ProjectApi.getProject(id);
	}

    createNewProject(data?) {
    	var self = this;

    	var project = {
    		id: null,
    		name: 'New Project'
    	}

    	if ( typeof data != 'undefined' ) {
    		Object.assign(project, data);
    	}

    	return new Promise((resolve, reject) => {
			ProjectApi.saveProject(project)
				.then( (r) => {
					console.log("saveProject response", r);
				});
    	});
	}

	saveProject(project) {
		return new Promise((result, reject) => {
			ProjectApi.saveProject(project)
				.then( (r) => {
					console.log("saveProject response", r);
				});
		});
	}

}

export default new ProjectStore();
