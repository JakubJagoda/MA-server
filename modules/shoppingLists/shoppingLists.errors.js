export class ShoppingListSyncConflict extends Error {
    constructor() {
        super();
        this.name = 'ShoppingListSyncConflict';
        this.message = 'Conflicted data!'
    }
}
