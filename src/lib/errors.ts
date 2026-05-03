export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export class AuthError extends ServiceError {
  constructor(message = 'Sesion expirada. Inicia sesion de nuevo.') {
    super(message, 'AUTH_REQUIRED', 401, false);
    this.name = 'AuthError';
  }
}
