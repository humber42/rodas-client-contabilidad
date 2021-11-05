<template>
    <v-app id="inspire">
        <v-navigation-drawer v-if="user" permanent expand-on-hover app v-model="drawer" class="text-center">
            <v-toolbar dark color="primary">
                <v-toolbar-title class="font-weight-thin">
                    <v-icon style="margin-top: -6px">mdi-calculator</v-icon>
                    <router-link to="/" tag="button">
                        Rodas Costos
                    </router-link>
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
                        <v-list-item-content>
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
                <v-virtual-scroll height="450" width="250" item-height="40" :items="clasificadoresMenu">
                    <template v-slot:default="{item}">
                    <v-list-item :key="item.to" link :to="item.to">
                        <v-list-item-title>{{item.title}}</v-list-item-title>
                    </v-list-item>
                    <v-divider v-if="item.divider"></v-divider>
                    </template>
                </v-virtual-scroll>
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
                    <v-btn dark text v-bind="attrs" v-on="on" class="hidden-sm-and-down">
                        {{$vuetify.lang.t('$vuetify.appBar.utilities')}}
                    </v-btn>
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
                            <v-btn text @click="toSpanish">
                                <v-icon color="red" class="mdi mdi-flag" left>mdi-</v-icon>
                                Español
                            </v-btn>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-btn text @click="toEnglish">
                                <v-icon color="blue" left>mdi-flag</v-icon>
                                English
                            </v-btn>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn icon>
                <v-icon>mdi-shield-account</v-icon>
            </v-btn>
            <v-btn icon @click="logout">
                <v-icon>mdi-key</v-icon>
            </v-btn>

        </v-app-bar>

        <v-main :class="user===null?'div-background':''">

            <transition name="fade">
                <router-view/>
            </transition>

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
                ],
                clasificadoresMenu:[
                     {title:"Tipos de actividades",to:"/activity-type",divider:false},
                     {title:"Actividades",to:"/activity",divider:true},
                     {title:"Tipos de gastos directos",to:"/direct-spend-type",divider:false},
                     {title:"Gastos directos",to:"/direct-spend",divider:true},
                     {title:"Tipos de gastos indirectos",to:"/indirect-spend-type",divider:false},
                     {title:"Gastos indirectos",to:"/indirect-spend",divider:false},
                     {title:"Coeficientes",to:"/coeficientes",divider:true},
                     {title:"Categorías de agrupación",to:"/agrupation-category",divider:false},
                     {title:"Elementos de gasto",to:"/element-spend",divider:false},
                     {title:"Subelementos de gasto",to:"/subelement-spend",divider:true},
                    {title:"Trabajador",to:"/worker",divider: false},
                     {title:"Cargos",to:"/charge",divider:false},
                     {title:"Etapas",to:"/steps",divider:false},
                     {title:"Unidades Empresariales de Base",to:"/uebs",divider:false},
                     {title:"Personas autorizadas",to:"/authorized-persons",divider:true},
                     {title:"Clientes",to:"/clients",divider:false},
                     {title:"Unidades de medida",to:"/metrics",divider:false},

                ]
            }
        }
        ,
        methods: {
            logout() {
                this.$store.dispatch('logoutUser')
            },
            toSpanish() {
                this.$vuetify.lang.current = 'es';
            },
            toEnglish() {
                this.$vuetify.lang.current = 'en';
            }
        },
        computed: {
            ...mapGetters(["user"]),
            itemsGroup() {
                let items = [];

                const codificadores = {
                    title: "Codificadores",
                    icon: "mdi-newspaper-variant-outline",
                    items: [
                        {title: "Tipo de actividades", link: "/activity-type", icon: ""},
                        {title: "Actividades", link: "/activity", icon: ""},
                        {title: "Tipos de gastos directos", link: "/direct-spend-type", icon: ""},
                        {title: "Gastos directos", link: "/direct-spend", icon: ""},
                        {title: "Tipos de gastos indirectos", link: "/indirect-spend-type", icon: ""},
                        {title: "Gastos indirectos", link: "/indirect-spend", icon: ""},
                        {title: "Coeficientes", link: "/coeficientes", icon: ""},
                        {title: "Categorías de agrupación", link: "/agrupation-category", icon: ""},
                        {title: "Elementos de gasto", link: "/element-spend", icon: ""},
                        {title: "Subelementos de gasto", link: "/subelement-spend", icon: ""},
                        {title: "Cargos", link: "/charge", icon: ""},
                        {title: "Etapas", link: "/steps", icon: ""},
                        {title: "Unidades Empresariales de Base", link: "/uebs", icon: ""},
                        {title: "Personas autorizadas", link: "/authorized-persons", icon: ""},
                        {title: "Clientes", link: "/clients", icon: ""},
                        {title: "Unidades de medida", link: "/metrics", icon: ""},
                    ]
                };

                const process = {
                    title: "Procesos",
                    icon: "mdi-state-machine",
                    items: [
                        {title: "Planificación", link: "/planification", icon: ""},
                        {title: "Cálculo", link: "/calculate", icon: ""},
                    ]
                }

                const ordenes = {
                    title: "Órdenes",
                    icon: "mdi-book-open-page-variant",
                    items: [
                        {title: "Órdenes de trabajo", link: "/work-order", icon: ""},
                        {title: "Ficha de costo", link: "/cost-sheet", icon: ""},
                        {title: "Plan Producción", link: "/production-plan", icon: ""},
                        {title: "Presupuesto", link: "/budget", icon: ""}
                    ]
                };

                const informes = {
                    title: "Informes",
                    icon: "mdi-chart-scatter-plot",
                    items: [
                        {title: "Informe 1", link: "/inform1", icon: "mdi-chart-donut"},
                    ]
                };

                const utilidades = {
                    title: "Utilidades",
                    icon: "mdi-cog-outline",
                    items: [
                        {title: "Configurar Sistema", link: "/configuration", icon: "mdi-tune"},
                        {
                            title: "Importar datos",
                            link: "/import-data-from-old-version",
                            icon: "mdi-database-import-outline"
                        },
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
        watch: {
            user(value) {
                this.$vuetify.lang.current = value.lang;
            }
        }

    };
</script>
