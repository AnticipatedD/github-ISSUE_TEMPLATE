export class Logger {
  info(message: string, context: Record<string, unknown> = {}) {
    console.log(JSON.stringify({ level: 'info', message, timestamp: new Date().toISOString(), ...context }));
  }
  error(message: string, context: Record<string, unknown> = {}) {
    console.error(JSON.stringify({ level: 'error', message, timestamp: new Date().toISOString(), ...context }));
  }
}
export const logger = new Logger();
