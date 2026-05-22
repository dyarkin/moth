import { MOTH_ERROR_CODES, MothError } from './moth-error';

export class ModulesTargetFileConflictError extends MothError {
  path: string;

  constructor(path: string) {
    super({
      code: MOTH_ERROR_CODES.MODULES_RESOURCE_CONFLICT,
      message: `Conflict occurred while combining modules: multiple modules compete for the same target file (${path}).`,
    });
    this.path = path;
    this.name = 'ModulesTargetFileConflictError';
  }
}

export class ModulesTargetPathNotDirectoryError extends MothError {
  path: string;

  constructor(path: string) {
    super({
      code: MOTH_ERROR_CODES.TARGET_PATH_NOT_DIRECTORY,
      message: `Cannot combine modules: target path is not a directory (${path}).`,
    });
    this.path = path;
    this.name = 'ModulesTargetPathNotDirectoryError';
  }
}
