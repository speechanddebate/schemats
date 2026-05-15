import winston from 'winston';
import config from '$config';
import os from 'os';

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

if (config.logging.file.enabled) {
	transports.push(
		new winston.transports.File({
			filename: `${config.logging.file.path}/error.log`,
			level: 'error',
			maxsize: parseInt(config.logging.file.maxSize) || 20971520,
			maxFiles: config.logging.file.maxFiles,
		}),
		new winston.transports.File({
			filename: `${config.logging.file.path}/combined.log`,
			maxsize: parseInt(config.logging.file.maxSize) || 20971520,
			maxFiles: config.logging.file.maxFiles,
		}),
	);
}

const logger = winston.createLogger({
	level: config.logging.level,
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json(),
	),
	defaultMeta: BASE_META,
	transports,
});

export default logger;
