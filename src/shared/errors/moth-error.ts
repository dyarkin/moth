export const MOTH_ERROR_CODES = {
  UNKNOWN: 'UNKNOWN',
  MODULES_RESOURCE_CONFLICT: 'MODULES_RESOURCE_CONFLICT',
  TARGET_PATH_NOT_DIRECTORY: 'TARGET_PATH_NOT_DIRECTORY',
} as const;

export type MothErrorCode =
  (typeof MOTH_ERROR_CODES)[keyof typeof MOTH_ERROR_CODES];

type MothErrorArgs = {
  message: string;
  code?: MothErrorCode;
};

export class MothError extends Error {
  code: MothErrorCode;

  constructor({ message, code = MOTH_ERROR_CODES.UNKNOWN }: MothErrorArgs) {
    super(message);
    this.name = 'MothError';
    this.code = code;
  }
}

export function isMothError(error: unknown): error is MothError {
  return error instanceof MothError;
}
