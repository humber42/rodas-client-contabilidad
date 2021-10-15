<template>
    <v-container>
        <div class="text-right">

            <h2 class="font-weight-light">Bienvenido, {{user.fullname}}</h2>
        </div>

        <v-card style="width: 500px" shaped >
            <v-card-title>Costos</v-card-title>
            <v-card-text>Bienvenido al modulo de costos de rodas</v-card-text>
        </v-card>
        <br>
        <v-alert color="secondary"></v-alert>
        <v-alert color="accent"></v-alert>
        <v-alert color="error"></v-alert>
        <v-alert color="info"></v-alert>
        <v-alert color="success"></v-alert>
        <v-alert color="warning"></v-alert>
    </v-container>
</template>

<script>
    import {mapGetters} from "vuex"
    export default {
        name: "Dashboard",
        computed:{
            ...mapGetters(["user"])
        }
    }
</script>

<style scoped>

</style>