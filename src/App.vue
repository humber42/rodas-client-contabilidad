<template>
    <v-app id="inspire">
        <v-navigation-drawer v-if="user" permanent expand-on-hover app v-model="drawer" class="text-center">
            <v-toolbar dark color="primary">
                <v-toolbar-title class="font-weight-thin">
                    <v-icon style="margin-top: -6px">mdi-calculator</v-icon>
                    Rodas Costos
                </v-toolbar-title>
            </v-toolbar>
            <v-list dense>
                    <v-list-group :value="false" v-for="group in itemsGroup" :key="group.title" :prepend-icon="group.icon">
                        <template v-slot:activator>
                            <v-list-item-title>{{group.title}}</v-list-item-title>
                        </template>
                        <v-list-item v-for="item in group.items" :key="item.title" link :to="item.link">
                            <v-list-item-icon>
                                <v-icon>{{item.icon}}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content >
                                <v-list-item-title>{{item.title}}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>

            </v-list>

        </v-navigation-drawer>

        <!--        Barra de arriba-->
        <v-app-bar app color="primary" dark v-if="user">
            <v-app-bar-title>
                <router-link to="/" tag="button" class="hidden-md-and-down">
                    <v-img src="cropped-logotipo.png" contain width="175px"></v-img>
                </router-link>
            </v-app-bar-title>
            <v-spacer></v-spacer>
            <v-menu offset-y fixed allow-overflow>
                <template v-slot:activator="{on,attrs}">
                    <v-btn dark text v-bind="attrs" v-on="on" class="hidden-sm-and-down">
                        Clasificadores
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-item link to="/activity-type">
                        <v-list-item-title>Tipos de actividades</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/activity">
                        <v-list-item-title>Actividades</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item link to="/direct-spend-type">
                        <v-list-item-title>Tipos de gastos directos</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/direct-spend">
                        <v-list-item-title>Gastos directos</v-list-item-title>
                    </v-list-item>
                    <v-divider/>
                    <v-list-item link to="/indirect-spend-type">
                        <v-list-item-title>Tipos de gastos indirectos</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/indirect-spend">
                        <v-list-item-title>Gastos indirectos</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/coeficientes">
                        <v-list-item-title>Coeficientes</v-list-item-title>
                    </v-list-item>
                    <v-divider/>
                    <v-list-item link to="/agrupation-category">
                        <v-list-item-title>Categorías de agrupación</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/element-spend">
                        <v-list-item-title>Elementos de gasto</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/subelement-spend">
                        <v-list-item-title>Subelementos de gasto</v-list-item-title>
                    </v-list-item>
                    <v-divider/>
                    <v-list-item link to="/charge">
                        <v-list-item-title>Cargos</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/steps">
                        <v-list-item-title>Etapas</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/uebs">
                        <v-list-item-title>Unidades Empresariales de Base</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/authorized-persons">
                        <v-list-item-title>Personas autorizadas</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item link to="/clients">
                        <v-list-item-title>Clientes</v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/metrics">
                        <v-list-item-title>Unidades de medida</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu offset-y fixed allow-overflow>
                <template v-slot:activator="{on,attrs}">
                    <v-btn dark text v-bind="attrs" v-on="on" class="hidden-sm-and-down">Órdenes</v-btn>
                </template>
                <v-list dense>
                    <v-list-item v-for="order in orderMenu" :key="order.title" :to="order.to">
                        <v-list-item-title>{{order.title}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu offset-y fixed allow-overflow>
                <template v-slot:activator="{on,attrs}">
                    <v-btn dark text v-bind="attrs" v-on="on" class="hidden-sm-and-down">Procesos</v-btn>
                </template>
                <v-list dense>
                    <v-list-item to="/planification">
                        <v-list-item-title>Planificación</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/calculate">
                        <v-list-item-title>Cálculo</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu offset-y fixed allow-overflow>
                <template v-slot:activator="{on,attrs}">
                    <v-btn dark text v-bind="attrs" v-on="on" class="hidden-sm-and-down">Informes</v-btn>
                </template>
                <v-list dense>
                    <v-list-item to="/inform1">
                        <v-list-item-title>Informe 1</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu offset-y fixed allow-overflow>
                <template v-slot:activator="{on,attrs}">
                    <v-btn dark text v-bind="attrs" v-on="on" class="hidden-sm-and-down">{{$vuetify.lang.t('$vuetify.appBar.utilities')}}</v-btn>
                </template>
                <v-list dense>
                    <v-list-item to="/configuration">
                        <v-list-item-title>Configurar Sistema</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/import-data-from-old-version">
                        <v-list-item-title>Importar datos de la versión anterior</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <v-btn to="/configuration" icon>
                <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
            <v-menu offset-y fixed allow-overflow>
                <template v-slot:activator="{on,attrs}">
                    <v-btn icon v-on="on" v-bind="attrs">
                        <v-icon>mdi-translate</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item>
                        <v-list-item-avatar class="mdi mdi-web"></v-list-item-avatar>
                        <v-list-item-title>Idiomas</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-list-item-content>
                            <v-btn text @click="toSpanish"><v-icon color="red" class="mdi mdi-flag" left>mdi-</v-icon>Español</v-btn>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-btn text @click="toEnglish"><v-icon color="blue" left>mdi-flag</v-icon>English</v-btn>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn icon>
                <v-icon>mdi-shield-account</v-icon>
            </v-btn>
            <v-btn  icon @click="logout">
                <v-icon>mdi-key</v-icon>
            </v-btn>

        </v-app-bar>

        <v-main>
            <v-container>
                <transition name="fade">
                    <router-view/>
                </transition>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
    import {mapGetters} from "vuex"

    export default {
        name: "App",
        data() {
            return {
                drawer: false,
                orderMenu: [
                    {title: "Órdenes de trabajo", to: "/work-order"},
                    {title: "Ficha de costo", to: "/cost-sheet"},
                    {title: "Plan Producción", to: "/production-plan"},
                    {title: "Presupuesto", to: "/budget"}
                ]
            }
        }
        ,
        methods: {
            logout() {
                this.$store.dispatch('logoutUser')
            },
            toSpanish(){
                this.$vuetify.lang.current='es';
            },
            toEnglish(){
                this.$vuetify.lang.current='en';
            }
        },
        computed: {
            ...mapGetters(["user"]),
          itemsGroup(){
              let items=[];

              const codificadores ={
                title:"Codificadores",
                icon:"mdi-newspaper-variant-outline",
                items:[
                  {title:"Tipo de actividades",link:"/activity-type",icon:""},
                  {title:"Actividades",link:"/activity",icon:""},
                  {title:"Tipos de gastos directos",link:"/direct-spend-type",icon:""},
                  {title:"Gastos directos",link:"/direct-spend",icon:""},
                  {title:"Tipos de gastos indirectos",link:"/indirect-spend-type",icon:""},
                  {title:"Gastos indirectos",link:"/indirect-spend",icon:""},
                  {title:"Coeficientes",link:"/coeficientes",icon:""},
                  {title:"Categorías de agrupación",link:"/agrupation-category",icon:""},
                  {title:"Elementos de gasto",link:"/element-spend",icon:""},
                  {title:"Subelementos de gasto",link:"/subelement-spend",icon:""},
                  {title:"Cargos",link:"/charge",icon:""},
                  {title:"Etapas",link:"/steps",icon:""},
                  {title:"Unidades Empresariales de Base",link:"/uebs",icon:""},
                  {title:"Personas autorizadas",link:"/authorized-persons",icon:""},
                  {title:"Clientes",link:"/clients",icon:""},
                  {title:"Unidades de medida",link:"/metrics",icon:""},
                ]
              };

              const process ={
                  title:"Procesos",
                  icon:"mdi-state-machine",
                  items:[
                      {title:"Planificación",link:"/planification",icon:""},
                      {title:"Cálculo",link:"/calculate",icon:""},
                  ]
              }

              const ordenes={
                  title:"Órdenes",
                  icon:"mdi-book-open-page-variant",
                  items:[
                      {title:"Órdenes de trabajo",link:"/work-order",icon:""},
                      {title:"Ficha de costo",link:"/cost-sheet",icon:""},
                      {title: "Plan Producción", link: "/production-plan",icon:""},
                      {title: "Presupuesto", link: "/budget",icon:""}
                  ]
              };

              const informes={
                  title:"Informes",
                  icon:"mdi-chart-scatter-plot",
                  items:[
                      {title:"Informe 1",link:"/inform1",icon:"mdi-chart-donut"},
                  ]
              };

              const utilidades={
                  title:"Utilidades",
                  icon:"mdi-cog-outline",
                  items:[
                      {title:"Configurar Sistema",link:"/configuration",icon:"mdi-tune"},
                      {title:"Importar datos",link:"/import-data-from-old-version",icon:"mdi-database-import-outline"},
                  ]
              }

              items.push(codificadores);
              items.push(ordenes);
              items.push(process);
              items.push(informes);
              items.push(utilidades);
              return items;
          }
        },
        created() {

        },
        watch:{
            user(value){
                this.$vuetify.lang.current=value.lang;
            }
        }

    };
</script>
