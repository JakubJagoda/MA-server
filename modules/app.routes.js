import AuthRoutes from './auth/auth.routes';
import UserRoutes from './users/users.routes';
import ShoppingListRoutes from './shoppingLists/shoppingLists.routes';

export default [
    {
        path: '/',
        method: 'GET',
        config: {
            handler(request, reply) {
                reply('Hello!');
            }
        }
    },
    ...AuthRoutes,
    ...UserRoutes,
    ...ShoppingListRoutes
];
