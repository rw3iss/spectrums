import config from 'config';

export default {

	// Constructs asset url from current configuration and the given path.
	asset: function(path) {
		return config.assetUrl + path; 
	}

}