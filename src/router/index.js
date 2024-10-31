import { createMemoryHistory, createWebHashHistory,createRouter } from "vue-router";

import MsgView from "../views/Msg/index.vue";
import MenuView from "../views/Menu/index.vue"
import AppView from "../views/index.vue";

const routes = [
  { path: "/", component: AppView },
  { path: "/msg", component: MsgView },
  { path: "/menu", component: MenuView },

];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
