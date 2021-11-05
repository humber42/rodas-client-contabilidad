import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../components/Dashboard";
import Login from "../components/auth/Login";
import TipoActividades from "../components/codifiers/activities/TipoActividades";
import Actividades from "../components/codifiers/activities/Actividades";
import Clientes from "../components/codifiers/clients/Clientes";
import UnidadesDeMedidas from "../components/codifiers/clients/UnidadesDeMedidas";
import GastosDirectos from "../components/codifiers/directCost/GastosDirectos";
import TiposGastosDirectos from "../components/codifiers/directCost/TiposGastosDirectos";
import CategoriaAgrupacion from "../components/codifiers/elementCost/CategoriaAgrupacion";
import ElementoGasto from "../components/codifiers/elementCost/ElementoGasto";
import SubElementoGasto from "../components/codifiers/elementCost/SubElementoGasto";
import Coeficientes from "../components/codifiers/indirectCost/Coeficientes";
import GastosIndirectos from "../components/codifiers/indirectCost/GastosIndirectos";
import TiposGastosIndirectos from "../components/codifiers/indirectCost/TiposGastosIndirectos";
import Cargos from "../components/codifiers/personsUebs/Cargos";
import Etapas from "../components/codifiers/personsUebs/Etapas";
import PersonasAutorizadas from "../components/codifiers/personsUebs/PersonasAutorizadas";
import UnidadesEmpresarialesBase from "../components/codifiers/personsUebs/UnidadesEmpresarialesBase";
import OrdenesDeTrabajo from "../components/orders/OrdenesDeTrabajo";
import FichaDeCosto from "../components/orders/FichaDeCosto";
import PlanProduccion from "../components/orders/PlanProduccion";
import Presupuesto from "../components/orders/Presupuesto";
import Planificacion from "../components/process/Planificacion";
import Calculo from "../components/process/Calculo";
import Informe1 from "../components/reports/Informe1";
import ConfiguracionSistema from "../components/utilities/ConfiguracionSistema";
import ImportarDatosVersionAnterior from "../components/utilities/ImportarDatosVersionAnterior";
import Trabajador from "../components/codifiers/personsUebs/Trabajador";


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
  },
  {
    path: "/activity",
    name: "Actividades",
    component: Actividades
  },
  {
    path: "/clients",
    name: "Clientes",
    component: Clientes
  },
  {
    path: "/metrics",
    name: "UnidadesDeMedidas",
    component: UnidadesDeMedidas
  },
  {
    path:"/direct-spend",
    name: "GastosDirectos",
    component: GastosDirectos
  },
  {
    path: "/direct-spend-type",
    name: "TipoGastosDirectos",
    component: TiposGastosDirectos
  },
  {
    path: "/agrupation-category",
    name: "CategoriaAgrupacion",
    component: CategoriaAgrupacion
  },
  {
    path: "/element-spend",
    name: "ElementoGasto",
    component: ElementoGasto
  },
  {
    path: "/subelement-spend",
    name: "SubElementoGasto",
    component: SubElementoGasto
  },
  {
    path: "/coeficientes",
    name: "Coeficientes",
    component: Coeficientes
  },
  {
    path: "/indirect-spend",
    name: "GastosIndirectos",
    component: GastosIndirectos
  },
  {
    path: "/indirect-spend-type",
    name: "TiposGastosIndirectos",
    component: TiposGastosIndirectos
  },
  {
    path: "/charge",
    name: "Cargos",
    component: Cargos
  },
  {
    path: "/steps",
    name: "Etapas",
    component: Etapas
  },
  {
    path: "/authorized-persons",
    name: "PersonasAutorizadas",
    component: PersonasAutorizadas
  },
  {
    path: "/uebs",
    name: "UnidadesEmpresarialesBase",
    component: UnidadesEmpresarialesBase
  },
  {   path:"/work-order",
    name:"OrdenesDeTrabajo",
    component:OrdenesDeTrabajo
  },
  {
    path: "/cost-sheet",
    name: "FichaDeCosto",
    component: FichaDeCosto
  },
  {
    path: "/production-plan",
    name: "PlanProduccion",
    component: PlanProduccion
  },
  {
    path: "/budget",
    name: "Presupuesto",
    component: Presupuesto
  },
  {
    path:"/planification",
    name:"Planificacion",
    component:Planificacion
  },
  {
    path: "/calculate",
    name: "Calculo",
    component: Calculo
  },
  {
    path:"/inform1",
    name:"Informe1",
    component:Informe1
  },
  {
    path:"/configuration",
    name:"ConfiguracionSistema",
    component: ConfiguracionSistema
  },
  {
    path: "/import-data-from-old-version",
    name: "ImportarDatosVersionAnterior",
    component: ImportarDatosVersionAnterior
  },
  {
    path: "/worker",
    name: "Trabajador",
    component: Trabajador
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
