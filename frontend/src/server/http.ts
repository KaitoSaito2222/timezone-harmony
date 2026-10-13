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

// Parses a JSON body against a schema. Unknown fields are stripped.
export async function parseBody<T extends z.ZodType>(req: NextRequest, schema: T): Promise<z.output<T>> {
  let body: unknown;
  try {
    body = await req.json();
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
