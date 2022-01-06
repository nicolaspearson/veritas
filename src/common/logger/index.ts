import morgan from 'morgan';

export const logger = morgan('dev');

export function log(message: string) {
  console.log(message);
}
