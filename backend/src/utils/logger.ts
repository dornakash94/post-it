import pino from "pino";
import pretty from "pino-pretty";

const logger = pino(pretty({ sync: true, translateTime: true }));

export default logger;
