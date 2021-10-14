<template>
    <v-container class="text-center mt-5 pt-5">
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <v-card width="600px" shaped>
                    <v-layout row class="ma-1">
                        <v-flex>
                            <h2 class="font-weight-thin">Bienvenido al módulo de Contabilidad de Rodas</h2>
                        </v-flex>
                        <v-container>
                            <v-alert v-if="authError!==null" v-model="alertShow" type="error"  transition="scale-transition">
                                {{authError.response.status===504?"Espere 10 segundos los servidores se están demorando en responder":"Credeenciales incorrectas"}}
                            </v-alert>
<!--                            Login form-->
                            <v-form v-model="isFormValid" lazy-validation ref="formLogin" @submit.prevent="handleSigninUser">
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field v-model="username" :rules="rules.usernameRules" prepend-icon="mdi-account"
                                        label="Usuario" aria-autocomplete="list" aria-required="true" type="text"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field v-model="password" :rules="rules.passwordRules" prepend-icon="mdi-lock"
                                        label="Contraseña" aria-required="true" aria-autocomplete="list" type="password"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-btn color="primary" :disabled="!isFormValid||loading" :loading="loading" type="submit">
                                            <span slot="loader" class="custom-loader">
                                                <v-icon light>mdi-reload</v-icon>
                                            </span>
                                            Iniciar Sesión
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                        </v-container>

                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    import {mapGetters} from 'vuex'
    export default {
        name: "Login",
        data(){
            return{
                alertShow:true,
                isFormValid:true,
                username:'',
                password:'',
                rules:{
                    usernameRules:[
                        (username)=>!!username||"El nombre de usuario es requerido"
                    ],
                    passwordRules:[
                        (password)=>!!password||"La contraseña es requerida"
                    ]
                }
            }
        },
        computed:{
            ...mapGetters(["authError","loading"])
        },
        methods:{
            handleSigninUser(){
                if(this.$refs.formLogin.validate()){
                    this.$store.dispatch("signinUser",{
                        password: this.password,
                        userCredential: this.username,
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>