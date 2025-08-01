import VueRouter from "vue-router";

const routes = [
  { path: "/", redirect: "/compile" },
  { path: "/home", component: () => import("@/views/Home") },
  { path: "/compile", component: () => import("@/views/Compile") },
];

export const router = new VueRouter({
  mode: "hash",
  routes,
});
