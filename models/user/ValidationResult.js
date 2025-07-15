

export class ValidationResult {
    constructor(isValid, errors = []) {
      this.isValid = isValid;
      this.errors = errors;
    }
  }