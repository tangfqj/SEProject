import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';
import Admin from '../views/Admin.vue';
import { useAuthStore } from '../stores/auth';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        beforeEnter: (_to, _from, next) => {
            const authStore = useAuthStore();
            if (!authStore.checkLoginStatus()) {
                next('/login');
            } else {
                next();
            }
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        beforeEnter: (_to, _from, next) => {
            const authStore = useAuthStore();
            if (!authStore.checkLoginStatus() || !authStore.isAdmin) {
                next('/login');
            } else {
                next();
            }
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;