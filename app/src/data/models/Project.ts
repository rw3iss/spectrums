import * as utils from 'utils/js-utils';
import { ProjectStore } from 'data/stores';

export default class Project {

	constructor(projectData) {
	}

	save() {
		cl("Project.save()");
		ProjectStore.saveProject( this )
		.then((r) => {
			cl("Project.save() finished.", r);
		})
		.catch((e) => {
			cl('Project.save() error", e');
		})
	}

}