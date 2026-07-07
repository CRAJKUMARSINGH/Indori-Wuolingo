import type { ErrorRequestHandler } from "express";
import type { ExerciseRow, UserRow } from "@indori/db";
import { logger } from "./logger";

/**
 * Error carrying an HTTP status code. Thrown from route handlers and translated
 * into a JSON response by {@link errorHandler}. Express 5 forwards rejected
 * promises from async handlers to error middleware automatically.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/** Anything with a Zod-style `safeParse` method (schema or effect). */
interface Parseable<T> {
  safeParse(
    data: unknown,
  ):
    | { success: true; data: T }
    | { success: false; error: { message: string } };
}

/**
 * Validate `data` against `schema`, returning the parsed value or throwing an
 * {@link HttpError} with status 400 on failure.
 */
export function parse<T>(schema: Parseable<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new HttpError(400, result.error.message);
  }
  return result.data;
}

/**
 * Return `value` if present, otherwise throw an {@link HttpError} with status
 * 404 and a `"<entity> not found"` message.
 */
export function orNotFound<T>(value: T | null | undefined, entity: string): T {
  if (value == null) {
    throw new HttpError(404, `${entity} not found`);
  }
  return value;
}

/** Normalize an exercise row for API responses (nullable fields default to null). */
export function serializeExercise(exercise: ExerciseRow) {
  return {
    ...exercise,
    romanization: exercise.romanization ?? null,
    nativeScript: exercise.nativeScript ?? null,
  };
}

/** Normalize a user row for API responses (`createdAt` as an ISO string). */
export function serializeUser(user: UserRow) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Express error-handling middleware. Sends the status/message for
 * {@link HttpError}s and a generic 500 for anything else.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  logger.error({ err }, "Unhandled error in request");
  res.status(500).json({ error: "Internal server error" });
};
