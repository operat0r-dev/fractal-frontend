export class ValidationError extends Error {
  invalidFields?: { [key: string]: string[] };

  constructor(message?: string, invalidFields?: { [key: string]: string[] }) {
    super(message);
    this.message = message || 'validationException';
    this.invalidFields = invalidFields;
  }
}

export class AccessForbiddenError extends Error {
  constructor(message?: string) {
    super(message);
    this.message = message || 'accessForbiddenException';
  }
}
