import { environments } from '../config/Environments';

export const environment: string = process.env.ENVIRONMENT?.toUpperCase() ?? 'UNDEFINED';

export const getBaseUrl = (): string => {
  if (environments.has(environment)) {
    return `https://${environments.get(environment)?.appHost}`;
  }
  throw new Error(`Unable to identify test environment! env.ENVIRONMENT = ${environment}`);
};