class AuthError extends Error {
    constructor() {
        super();
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InvalidCredentialsError extends AuthError {
    constructor() {
        super();
        this.name = 'InvalidCredentialsError';
        this.message = 'Provided credentials were invalid.'
    }
}
