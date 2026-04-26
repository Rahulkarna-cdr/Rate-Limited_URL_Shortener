const buildRateLimiter = ({ windowMs, maxRequests, message }) => {
  const buckets = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket?.remoteAddress || "unknown";
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (bucket.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({ msg: message });
    }

    bucket.count += 1;
    return next();
  };
};

export const shortenRateLimiter = buildRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 5,
  message: "Too many shorten requests. Please try again in a minute.",
});

export default buildRateLimiter;
