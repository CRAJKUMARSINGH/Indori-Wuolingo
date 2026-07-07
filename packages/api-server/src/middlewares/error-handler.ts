import type { ErrorRequestHandler, RequestHandler } from "express";
import { logger } from "../lib/logger";

const isProduction = process.env.NODE_ENV === "production";

// Detect a Zod validation error without importing zod directly (it is only a
// transitive dependency here). Response-schema `.parse()` failures surface as
// ZodError instances and indicate a server-side contract bug.
function isZodError(err: unknown): boolean {
  return err instanceof Error && err.name === "ZodError";
}

/**
 * Catch-all for requests that did not match any route. Returns a consistent
 * JSON body instead of Express's default HTML 404 page.
 */
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
};

/**
 * Centralized error-handling middleware. Express 5 forwards rejected promises
 * from async handlers here, so every uncaught route error is logged with the
 * request-scoped logger and returned as a consistent JSON body rather than
 * silently hanging or leaking a stack trace via the default handler.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // Response validation failures (e.g. a Zod `.parse()` on the response body)
  // indicate a server-side contract bug, not a client error.
  const isValidationError = isZodError(err);
  const status =
    typeof (err as { status?: unknown })?.status === "number"
      ? (err as { status: number }).status
      : typeof (err as { statusCode?: unknown })?.statusCode === "number"
        ? (err as { statusCode: number }).statusCode
        : 500;

  // Prefer the request-scoped pino logger attached by pino-http; fall back to
  // the base logger when it is unavailable.
  const log = req.log ?? logger;
  log.error({ err, status }, "Unhandled error while processing request");

  if (res.headersSent) {
    return;
  }

  const message =
    isValidationError || status >= 500
      ? isProduction
        ? "Internal Server Error"
        : err instanceof Error
          ? err.message
          : String(err)
      : err instanceof Error
        ? err.message
        : String(err);

  res.status(status >= 400 ? status : 500).json({ error: message });
};
