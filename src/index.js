import Vue from "vue";

// element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

// vue-router
import { router } from "./router";
Vue.use(router.constructor);

import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
