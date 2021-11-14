<template>
    <v-container class="text-center mt-5 pt-5">
        <v-snackbar
                v-model="snackbar"
                :timeout="2000"
                right
                absolute
                color="secondary"
                top
                app
        >
            <v-icon>mdi-info</v-icon>
            Sitio en desarrollo

            <template v-slot:action="{ attrs }">
                <v-btn
                        color="white"
                        icon
                        v-bind="attrs"
                        @click="snackbar = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
        <v-card shaped max-height="820" max-width="960">
            <v-img src="production-image.jpg" contain ></v-img>
            <v-card-title>Este sitio se encuentra en desarrollo</v-card-title>
        </v-card>


    </v-container>
</template>

<script>
    export default {
        name: "DevelopmentSite",
        data(){
            return{
                snackbar:true
            }
        }
    }
</script>

<style scoped>

</style>