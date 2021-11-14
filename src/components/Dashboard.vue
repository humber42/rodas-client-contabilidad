<template>
  <v-container>
    <div class="text-right">
      <h2 class="font-weight-light">Bienvenido, {{ user.fullname }}</h2>
    </div>

    <DevelopmentSite/>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import DevelopmentSite from "./DevelopmentSite";
export default {
  name: "Dashboard",
  components: {DevelopmentSite},
  computed: {
    ...mapGetters(["user"]),
  },
};
</script>

<style scoped></style>
