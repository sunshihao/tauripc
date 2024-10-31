import {
  createWebHashHistory,
  createRouter,
} from "vue-router";

import AppView from "../views/index.vue";

const routes = [
  { path: "/", name: "home", component: AppView },
  {
    path: "/msg",
    name: "msg",
    component: () => import("../views/Msg/index.vue"),
  },
  {
    path: "/menu",
    name: "menu",
    component: () => import("../views/Menu/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
