import rateLimit from "express-rate-limit";
import * as requestIp from "request-ip";
import * as status from "http-status";
import * as StandardError from "standard-error";

const apiCallRateLimiter = rateLimit({
  windowMs: 1440 * 60 * 1000, // 1 Day
  max: 10, // Maximum requests in the given timeframe
  message: new StandardError({
    message: "Too many requests",
    code: status.TOO_MANY_REQUESTS,
  }),
  statusCode: 429,
  headers: true,
  keyGenerator(req: any) {
    return requestIp.getClientIp(req);
  },
});

export default apiCallRateLimiter;
