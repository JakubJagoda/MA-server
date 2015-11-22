export class DuplicatedUsernameError extends Error {
    constructor() {
        super();
        this.name = 'DuplicatedUsernameError';
        this.message = 'Username already exists.'
    }
}
