import type { AppConfig } from './config.d';

const config: AppConfig = {
	WEB_URL: 'localhost', //the base URL for the web server, used for constructing links Should not include protocol or port.
	LEGACY_URL: 'https://mason.dev.tabroom.com',
	S3_BASE: 'https://s3.amazonaws.com/tabroom-files',

	vite: {
		host: 'localhost',
		port: 9000,
		clientPort: 443, // The port on the other side of the NGINX proxy with SSL
		previewPort: 9003,
	},

	indexcards: {
		host: 'http://localhost:8001', // Host for SSR
		clientHost: 'http://localhost:9000', // Host for client-side (browser) access, proxied through Vite in development
		basePath: '/v1',
		authCookieName: 'Tabroom_Cookie',
		csrfCookieName: 'CSRF_Token',
		csrfTokenHeader: 'x-csrf-token',
		sessionHeader: 'tabroom-sessionkey',
	},

	logging: {
		level: 'info', // error, warn, info, debug
		file: {
			enabled: true,
			path: 'logs',
			maxSize: '20m',
			maxFiles: 14,
		},
	},
};

export default config;