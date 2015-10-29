import AuthRoutes from './auth/auth.routes';
import UserRoutes from './users/users.routes';

export default [
    ...AuthRoutes,
    ...UserRoutes
];
