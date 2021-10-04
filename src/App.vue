<template>
  <v-app>
    <v-app-bar app color="primary" dark>
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
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
