import type { AppConfig } from './config.d';

const config: AppConfig = {
	ENV        : 'development', // 'development' | 'production' | 'test'
	WEB_URL    : 'https://schemats.debatefail.com',
	LEGACY_URL : 'https://mason.debatefail.com',
	S3_BASE    : 'https://s3.amazonaws.com/tabroom-files',

	vite: {
		host		: 'schemats.debatefail.com',
		port		: 9000,
		clientPort  : 443, // The port on the other side of the NGINX proxy with SSL
		previewPort : 9003,
	},

	indexcards         : {
		host           : 'https://api.debatefail.com',
		clientHost     : 'https://api.debatefail.com',
		basePath       : '/v1',
		authCookieName : 'TabroomLocal',
		csrfCookieName  : 'CSRF_Token',
		csrfTokenHeader : 'x-csrf-token',
		sessionHeader   : 'tabroom-sessionkey',
	},

	logging: {
		level: 'info', // error, warn, info, debug
		file: {
			enabled  : true,
			path     : '/var/log/schemats/',
			maxSize  : '512m',
			maxFiles : 16,
		},
	},
};

export default config;
