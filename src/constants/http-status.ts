export const HTTP_BAD_REQUEST = 400;
export const HTTP_NOT_FOUND = 404;
export const HTTP_INTERNAL_SERVER_ERROR = 500;

export type HttpStatus =
  | typeof HTTP_BAD_REQUEST
  | typeof HTTP_NOT_FOUND
  | typeof HTTP_INTERNAL_SERVER_ERROR;
