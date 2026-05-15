export type AppConfig = {
	WEB_URL: string;
	LEGACY_URL: string;
	S3_BASE: string;

	vite: {
		host: string;
		port: number;
		clientPort: number;
		previewPort: number;
	};

	indexcards: {
		host: string;
		clientHost: string;
		basePath: string;
		authCookieName: string;
		csrfCookieName: string;
		csrfTokenHeader: string;
		sessionHeader: string;
	};

	logging: {
		level: 'error' | 'warn' | 'info' | 'debug';
		file: {
			enabled: boolean;
			path: string;
			maxSize: string;
			maxFiles: number;
		};
	};
};