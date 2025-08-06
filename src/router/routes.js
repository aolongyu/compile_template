export default [
  { path: "/", redirect: "/intro" },
  { path: "/intro", component: () => import("@/views/Intro") },
  { path: "/compile", component: () => import("@/views/Compile") },
];
