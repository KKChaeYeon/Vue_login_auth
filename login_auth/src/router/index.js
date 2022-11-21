import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/HomeView.vue";
import Login from "../views/LoginView.vue";
import VueCookies from "vue-cookies";

import { refreshToken } from "../service/login";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { unauthorized: true },
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (
    VueCookies.get("token") === null &&
    VueCookies.get("refresh_token") !== null
  ) {
    await refreshToken();
  }

  if (
    to.matched.some((record) => record.meta.unauthorized) ||
    VueCookies.get("token")
  ) {
    return next();
  }

  alert("로그인 해주세요");
  return next("/login");
});

export default router;
