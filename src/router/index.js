import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../components/Dashboard";
import Login from "../components/auth/Login";
import TipoActividades from "../components/codifiers/TipoActividades";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Dashboard,
  },
  {
    path:"/login",
    name:"Login",
    component: Login
  },
  {
    path:"/activity-type",
    name: "TipoActividades",
    component: TipoActividades
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
