import { createMemoryHistory, createWebHashHistory,createRouter } from "vue-router";

import MsgView from "../views/Msg/index.vue";
import AppView from "../views/index.vue";

const routes = [
  { path: "/", component: AppView },
  { path: "/msg", component: MsgView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
