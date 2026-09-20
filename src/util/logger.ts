export interface LogPayload {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  context?: Record<string, unknown>;
}

export function scriptLog(level: LogPayload['level'], message: string, context?: Record<string, unknown>): LogPayload {
  const payload: LogPayload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context && { context }),
  };

  if (level === 'ERROR') {
    console.error(JSON.stringify(payload));
  } else {
    console.log(JSON.stringify(payload));
  }

  return payload;
}
