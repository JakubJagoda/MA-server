class UserError extends Error {
    constructor() {
        super();
        Error.captureStackTrace(this, this.constructor);
    }
}

export class DuplicatedUsernameError extends UserError {
    constructor() {
        super();
        this.name = 'DuplicatedUsernameError';
        this.message = 'Username already exists.'
    }
}
