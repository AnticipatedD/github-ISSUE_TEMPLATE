import { logger } from '../src/util/logger';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      logger.info('Worker health endpoint pinged', { status: 'healthy' });
      return new Response(JSON.stringify({ status: 'ok', uptime: process.uptime() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('Cloudflare Docs Worker', { status: 200 });
  },
};
