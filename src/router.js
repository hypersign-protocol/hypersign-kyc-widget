import Vue from "vue";
import Router from "vue-router";
// import config from "./config";
// import fetch from "node-fetch";
// import eventBus from "./eventBus";
// import Auth from './components/login/Auth'
Vue.use(Router);

const router = new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "dash-board",
            component: () =>
                import( /* webpackChunkName: "adminLogin" */ "./day-pass/dash-board.vue")
        },
        {
            path: "/kyc",
            name: "kyc",
            component: () =>
                import( /* webpackChunkName: "adminLogin" */ "./day-pass/id-module/aadhaar-id.vue"),
        },
        {
            path: "/pay",
            name: "pay",
            component: () =>
                import( /* webpackChunkName: "adminLogin" */ "./day-pass/payment-module/payment-gateway.vue"),
        },
        {
            path: "/day-pass",
            name: "kyc",
            component: () =>
                import( /* webpackChunkName: "adminLogin" */ "./day-pass/day-pass-issuance/day-pass-form.vue"),
        },
        {
            path: "/day-pass-verify",
            name: "kyc",
            component: () =>
                import( /* webpackChunkName: "adminLogin" */ "./day-pass/day-pass-verification/verify-day-pass.vue"),
        },
    ]
});

// router.beforeEach((to, from, next) => {

//     if (to.matched.length < 1) {
//         document.title = to.meta.title;
//         next(false);
//         return router.push('/404');
//     }

//     if (to.matched.some((record) => record.meta.requiresAuth)) {
//         const authToken = localStorage.getItem("authToken");

//         if (authToken) {
//             let usage = true;
//             if (to.path === "/admin/subscription") {
//                 usage = false;
//             }
//             const url = `${config.studioServer.BASE_URL}hs/api/v2/auth/protected?usage=${usage}`;
//             fetch(url, {
//                 headers: {
//                     Authorization: `Bearer ${authToken}`,
//                 },
//                 method: "POST",
//             })
//                 .then((res) => res.json())
//                 .then((json) => {
//                     if (json.status == 403) {
//                         next({
//                             path: to.meta.admin ? "/admin/login" : "/login",
//                             params: { nextUrl: to.fullPath },
//                         });
//                     } else {
//                         localStorage.setItem("user", JSON.stringify(json.message));
//                         Vue.prototype.$accounts = json.accounts;
//                         if (json.accounts.length == 0) {

//                             localStorage.removeItem("accessToken")
//                             localStorage.removeItem("accessuser")
//                         }
//                         if (
//                             to.meta.admin
//                         ) {
//                             if (!json.message.isSubscribed &&
//                                 (to.path != "/admin/subscription" && to.path != "/admin/dashboard")) {
//                                 eventBus.$emit("UpdateAdminNav", false);
//                                 next({
//                                     path: "/admin/subscription",
//                                     params: { nextUrl: to.fullPath },
//                                 });
//                             } else {
//                                 // if he is subscired
//                                 const usage = json.message.usage;
//                                 if (usage && usage.totalUsed >= usage.totalAvailable) {
//                                     next({
//                                         path: "/admin/subscription",
//                                         params: { nextUrl: to.fullPath },
//                                     });
//                                     eventBus.$emit("UpdateAdminNav", false);
//                                 } else {
//                                     eventBus.$emit("UpdateAdminNav", true);
//                                     next();
//                                 }
//                             }
//                         } else {
//                             next();
//                         }
//                     }
//                 })
//                 .catch((e) => {
//                     console.log(e);
//                     next({
//                         path: to.meta.admin ? "/admin/login" : "/login",
//                         params: { nextUrl: to.fullPath },
//                     });
//                 });
//         } else {
//             next({
//                 path: to.meta.admin ?
//                     "/admin/login" :
//                     !to.query["referrer"] ?
//                         `/login/${to.params["slug"]}` : `/login/${to.params["slug"]}?referrer=${to.query["referrer"]}`,
//                 params: { nextUrl: to.fullPath },
//             });
//         }
//     } else {
//         next();
//     }
// });
export default router;