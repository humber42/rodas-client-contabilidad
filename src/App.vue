<template>
    <v-app id="inspire" >

        <v-navigation-drawer v-if="user" permanent expand-on-hover app v-model="drawer" class="text-center">
         <v-toolbar dark color="primary">
            <v-toolbar-title class="font-weight-thin">
              <v-icon style="margin-top: -6px">mdi-calculator</v-icon>
              Rodas Costos
            </v-toolbar-title>
         </v-toolbar>
          <v-list dense>
            <v-list>
              <v-list-item>
                <v-list-item-title>Clasificadores</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-list>

        </v-navigation-drawer>

<!--        Barra de arriba-->
        <v-app-bar v-if="user" app color="primary" dark>
          <v-app-bar-title>
            <router-link to="/" tag="button" class="hidden-sm-only">
             <v-img src="cropped-logotipo.png" contain width="175px"></v-img>
            </router-link>
          </v-app-bar-title>
          <v-spacer></v-spacer>
          <v-menu offset-y fixed  allow-overflow>
            <template v-slot:activator="{on,attrs}">
              <v-btn  dark text v-bind="attrs" v-on="on" class="hidden-sm-only">
                Clasificadores
              </v-btn>
            </template>
            <v-list dense >
              <v-list-item link to="/activity-type">
                  <v-list-item-title>Tipos de actividades</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Actividades</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-title>Tipos de gastos directos</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Gastos directos</v-list-item-title>
              </v-list-item>
              <v-divider/>
              <v-list-item>
                <v-list-item-title>Tipos de gastos indirectos</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Gastos indirectos</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Coeficientes</v-list-item-title>
              </v-list-item>
              <v-divider/>
              <v-list-item>
                <v-list-item-title>Categorías de agrupación</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Elementos de gasto</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Subelementos de gasto</v-list-item-title>
              </v-list-item>
              <v-divider/>
              <v-list-item>
                <v-list-item-title>Cargos</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Etapas</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Unidades Empresariales de Base</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Personas autorizadas</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-title>Clientes</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Unidades de medida</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn dark text>Órdenes</v-btn>
          <v-btn dark text>Procesos</v-btn>
          <v-btn dark text>Informes</v-btn>
          <v-btn dark text>Utilidades</v-btn>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-shield-account</v-icon>
          </v-btn>
          <v-btn icon @click="logout">
            <v-icon>mdi-key</v-icon>
          </v-btn>
        </v-app-bar>

        <v-main>
          <v-container>
            <router-view/>
          </v-container>
        </v-main>
    </v-app>
</template>

<script>
    import {mapGetters} from "vuex"

    export default {
        name: "App",
      data(){
          return{
            drawer:false,
          }
      }
    ,
        methods: {
            logout() {
                this.$store.dispatch('logoutUser')
            },
          tomain(){
              this.$store.push("/")
          }
        },
        computed: {
            ...mapGetters(["user"])
        }
    };
</script>
