import morgan from 'morgan';

export const logger = morgan('dev');

export function log(message: unknown) {
  console.log(message);
}
