import Vue from "vue";
import Router from "vue-router";
import Auth from './components/commons/Auth.vue'
Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: "/home",
            name: "MainPage",
            component: () =>
                import(
                    /* webpackChunkName: "MainPage" */
                    "./components/MainPage.vue"
                ),
            meta: () => (
                {
                    requiresAuth: false,
                    title: `Widget - User Home`
                })
        },

        {
            path: '/auth/google',
            name: 'AuthTication',
            component: Auth,
            meta: () => (
                {
                    requiresAuth: false,
                    title: `Widget - Google Auth`
                })
        },

    ],
});
export default router;