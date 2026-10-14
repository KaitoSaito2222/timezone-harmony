import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

// Thrown by route code for intentional 4xx responses; anything else becomes a 500.
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly details: string | string[],
  ) {
    super(Array.isArray(details) ? details.join(', ') : details);
  }
}

export const badRequest = (message: string | string[]) => new HttpError(400, message);
export const unauthorized = () => new HttpError(401, 'Unauthorized');
export const notFound = (message: string) => new HttpError(404, message);

// Wraps a route handler so errors produce the same JSON shape the old API returned,
// without leaking stack traces or database messages to the client.
export function route<C>(handler: (req: NextRequest, ctx: C) => Promise<unknown>) {
  return async (req: NextRequest, ctx: C) => {
    try {
      const result = await handler(req, ctx);
      if (result instanceof Response) return result;
      return NextResponse.json(result ?? null);
    } catch (error) {
      let status = 500;
      let message: string | string[] = 'Internal server error';
      if (error instanceof HttpError) {
        status = error.status;
        message = error.details;
      } else {
        console.error(`Unhandled exception on ${req.method} ${req.nextUrl.pathname}`, error);
      }
      return NextResponse.json(
        {
          statusCode: status,
          message,
          path: req.nextUrl.pathname,
          timestamp: new Date().toISOString(),
        },
        { status },
      );
    }
  };
}

// The old Express API rejected bodies over 100 KB; every valid request here is far smaller.
const MAX_BODY_BYTES = 64 * 1024;

// Parses a JSON body against a schema. Unknown fields are stripped.
// Requiring application/json also keeps other sites from posting here with a plain form
// or a no-preflight fetch.
export async function parseBody<T extends z.ZodType>(req: NextRequest, schema: T): Promise<z.output<T>> {
  if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json');
  }
  const text = await req.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    throw new HttpError(413, 'Request body too large');
  }
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw badRequest('Invalid JSON body');
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    throw badRequest(
      result.error.issues.map((issue) => (issue.path.length ? `${issue.path.join('.')}: ${issue.message}` : issue.message)),
    );
  }
  return result.data;
}
