import winston from 'winston';
import os from 'os';
import {
	LOG_LEVEL,
	LOGGING_PATH,
	LOGGING_FILE_MAXSIZE,
	LOGGING_FILE_MAXFILES,
} from '$app/env/private';

const BASE_META = {
	app: 'schemats',
	host: os.hostname(),
};

const transports: winston.transport[] = [
	new winston.transports.Console({
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple(),
		),
	}),
];

if (LOGGING_PATH) {
	transports.push(
		new winston.transports.File({
			filename: `${LOGGING_PATH}/error.log`,
			level: 'error',
			maxsize: LOGGING_FILE_MAXSIZE,
			maxFiles: LOGGING_FILE_MAXFILES,
		}),
		new winston.transports.File({
			filename: `${LOGGING_PATH}/combined.log`,
			maxsize: LOGGING_FILE_MAXSIZE,
			maxFiles: LOGGING_FILE_MAXFILES,
		}),
	);
}

const logger = winston.createLogger({
	level: LOG_LEVEL,
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json(),
	),
	defaultMeta: BASE_META,
	transports,
});

export default logger;
