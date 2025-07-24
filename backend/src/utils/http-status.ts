/**
 * Enum for standard HTTP status codes.
 * Grouped by category for clarity.
 * Usage: res.status(HttpStatus.OK).json({ message: 'Success' });
 */
export enum HttpStatus {
  // 1xx Informational
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,

  // 2xx Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // 3xx Redirection
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,

  // 4xx Client Error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,

  // 5xx Server Error
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * @param code The HTTP status code.
 * @returns A human-readable message.
 */
export function getStatusMessage(code: HttpStatus): string {
  switch (code) {
    case HttpStatus.OK:
      return "OK";
    case HttpStatus.CREATED:
      return "Created";
    case HttpStatus.BAD_REQUEST:
      return "Bad Request";
    case HttpStatus.UNAUTHORIZED:
      return "Unauthorized";
    case HttpStatus.FORBIDDEN:
      return "Forbidden";
    case HttpStatus.NOT_FOUND:
      return "Not Found";
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return "Internal Server Error";
    // Add more as needed
    default:
      return "Unknown Status";
  }
}
