import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#003844",
        secondary: "#484D6D",
        accent: "#A755C2",
        error: "#DE2E2B",
        info: "#86BBD8",
        success: "#009B72",
        warning: "#FFD500",
      },
    },
  },
});
