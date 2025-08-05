import VueRouter from "vue-router";

const routes = [
  { path: "/", redirect: "/intro" },
  { path: "/intro", component: () => import("@/views/Intro") },
  { path: "/compile", component: () => import("@/views/Compile") },
];

export const router = new VueRouter({
  mode: "hash",
  routes,
});
