import { LogLevel } from './services/Logger/interface';

export interface Config {
  LOG_LEVEL: LogLevel;
  APP_PORT: unknown | number;
  DATA_DIR: string;
  DEBUG_HTTP: boolean;
  API_URL: string;
}

const logLevelFromString = (level: string): LogLevel => {
  const index = ['ERROR', 'WARNING', 'NOTICE', 'INFO', 'DEBUG'].indexOf(level);
  return (index === -1 ? 3 : index) as LogLevel;
};

const env = (varName: string, defaultValue: string = '') => {
  const envVar = process.env[varName]!;
  return envVar !== '' ? envVar : defaultValue;
};

export const config: Config = {
  LOG_LEVEL: logLevelFromString(env('LOG_LEVEL', 'INFO')),
  DEBUG_HTTP: env('DEBUG_HTTP', '0') === '1',
  APP_PORT: 8080,
  DATA_DIR: '/data',
  API_URL: env('API_URL', 'http://localhost:8989'),
};

export default config;
