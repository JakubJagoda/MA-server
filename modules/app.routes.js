import AuthRoutes from './auth/auth.routes';
import UserRoutes from './users/users.routes';
import ShoppingListRoutes from './shoppingLists/shoppingLists.routes';
import ProductsRoutes from './products/products.routes';

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
    ...ShoppingListRoutes,
    ...ProductsRoutes
];
