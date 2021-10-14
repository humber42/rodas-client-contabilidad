<template>
  <v-app>
    <v-app-bar v-if="user" app color="primary" dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title>
        <v-flex>
          <h3 clas>Rodas contabilidad</h3>
        </v-flex>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
  import {mapGetters} from "vuex"
export default {
  name: "App",

  data: () => ({
    //
  }),
  computed:{
    ...mapGetters(["user"])
  }
};
</script>
