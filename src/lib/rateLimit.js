//
// Upstash Rate Limiter for Bot Protection
//
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create rate limiter only if Upstash is configured
let ratelimit = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        // Allow 3 requests per 5 minutes per IP
        limiter: Ratelimit.slidingWindow(3, '5 m'),
        analytics: true,
        prefix: 'reservation_ratelimit'
    });
}

export async function checkRateLimit(ip) {
    // If Upstash is not configured, allow all requests (for local dev)
    if (!ratelimit) {
        console.warn('⚠️ Upstash not configured, rate limiting disabled');
        return { success: true, limit: 0, remaining: 0, reset: 0 };
    }

    try {
        const result = await ratelimit.limit(ip);

        if (!result.success) {
            console.warn(`🚫 Rate limit exceeded for IP: ${ip}`);
        }

        return result;
    } catch (error) {
        // If Redis is unreachable (DNS error, network issue, etc.),
        // allow the request through instead of blocking users
        console.warn('⚠️ Rate limit check failed (Redis unreachable), allowing request:', error.message);
        return { success: true, limit: 0, remaining: 0, reset: 0 };
    }
}
