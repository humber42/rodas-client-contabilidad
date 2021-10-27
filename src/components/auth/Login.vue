<template>
    <div>
<!--        <v-container class="text-center mt-5 pt-5 hidden-md-and-up">-->
<!--            <v-layout row wrap>-->
<!--                <v-flex xs12 sm6 offset-sm3>-->
<!--                    <v-card width="600px" shaped>-->
<!--                        <v-layout row class="ma-1">-->
<!--                            <v-flex>-->
<!--                                <h2 class="font-weight-thin">{{$vuetify.lang.t("$vuetify.login.title")}}</h2>-->
<!--                            </v-flex>-->
<!--                            <v-container>-->
<!--                                <v-alert v-if="authError!==null" v-model="alertShow" type="error"-->
<!--                                         transition="scale-transition">-->
<!--                                    {{authError.response.status===504?$vuetify.lang.t("$vuetify.login.error504"):$vuetify.lang.t("$vuetify.login.wrongCredentials")}}-->
<!--                                </v-alert>-->
<!--                                &lt;!&ndash;                            Login form&ndash;&gt;-->
<!--                                <v-form v-model="isFormValid" lazy-validation ref="formLogin"-->
<!--                                        @submit.prevent="handleSigninUser">-->
<!--                                    <v-layout row class="ma-1">-->
<!--                                        <v-flex xs12>-->
<!--                                            <v-text-field v-model="username" :rules="rules.usernameRules"-->
<!--                                                          prepend-icon="mdi-account"-->
<!--                                                          :label="$vuetify.lang.t('$vuetify.login.username')"-->
<!--                                                          aria-autocomplete="list" aria-required="true"-->
<!--                                                          type="text"></v-text-field>-->
<!--                                        </v-flex>-->
<!--                                    </v-layout>-->
<!--                                    <v-layout row class="ma-1">-->
<!--                                        <v-flex xs12>-->
<!--                                            <v-text-field v-model="password" :rules="rules.passwordRules"-->
<!--                                                          prepend-icon="mdi-lock"-->
<!--                                                          :label="$vuetify.lang.t('$vuetify.login.password')"-->
<!--                                                          aria-required="true" aria-autocomplete="list"-->
<!--                                                          type="password"></v-text-field>-->
<!--                                        </v-flex>-->
<!--                                    </v-layout>-->
<!--                                    <v-layout row class="ma-1">-->
<!--                                        <v-flex xs12>-->
<!--                                            <v-btn color="primary" :disabled="!isFormValid||loading" :loading="loading"-->
<!--                                                   type="submit">-->
<!--                                            <span slot="loader" class="custom-loader">-->
<!--                                                <v-icon light>mdi-refresh</v-icon>-->
<!--                                            </span>-->
<!--                                                {{$vuetify.lang.t('$vuetify.login.login')}}-->
<!--                                            </v-btn>-->
<!--                                        </v-flex>-->
<!--                                    </v-layout>-->
<!--                                </v-form>-->
<!--                            </v-container>-->
<!--                        </v-layout>-->
<!--                    </v-card>-->
<!--                </v-flex>-->
<!--            </v-layout>-->
<!--        </v-container>-->
        <div >
            <v-row>
                <v-col>
                    <div class="div-login text-center mt-3 ml-5">
                        <v-container>
                            <v-img src="cropped-logotipo.png" class="mt-10" max-height="100px" contain></v-img>
                            <h1 class="font-weight-light" style="color: black">Rodas Costos</h1>

                            <h2 class="font-weight-light mt-10" style="color: black">Bienvenido al módulo de Rodas
                                Costos</h2>
                            <v-container class="mt-5">
                                <v-alert v-if="authError!==null" v-model="alertShow" type="error"
                                         transition="scale-transition">
                                    {{authError.response.status===504?$vuetify.lang.t("$vuetify.login.error504"):$vuetify.lang.t("$vuetify.login.wrongCredentials")}}
                                </v-alert>
                                <!--                            Login form-->

                                <v-form v-model="isFormValid" lazy-validation ref="formLogin"
                                        @submit.prevent="handleSigninUser">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12 class="text-left">
                                            <label for="username" class="font-weight-light">
                                                {{$vuetify.lang.t('$vuetify.login.username')}}</label>
                                        </v-flex>
                                        <v-flex xs12 class="mt-1">
                                            <v-text-field  id="username" v-model="username" :rules="rules.usernameRules"
                                                           prepend-icon="mdi-account"
                                                           :placeholder="$vuetify.lang.t('$vuetify.login.placeholderUsername')"
                                                           aria-autocomplete="list" aria-required="true"
                                                           type="text"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex class="text-left">
                                            <label for="password" class="font-weight-light">
                                                {{$vuetify.lang.t('$vuetify.login.password')}}</label>
                                        </v-flex>
                                        <v-flex xs12 class="mt-1">
                                            <v-text-field id="password" v-model="password" :rules="rules.passwordRules"
                                                          prepend-icon="mdi-lock"
                                                          :placeholder="$vuetify.lang.t('$vuetify.login.placeholderPassword')"
                                                          aria-required="true" aria-autocomplete="list"
                                                          :type="typeText?'text':'password'"
                                                          :append-outer-icon="typeText?'mdi-eye-off':'mdi-eye'"
                                                          @click:append-outer="handleTypeText"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-btn color="primary" :disabled="!isFormValid||loading"
                                                   :loading="loading"
                                                   type="submit">
                                            <span slot="loader" class="custom-loader">
                                                <v-icon light>mdi-refresh</v-icon>
                                            </span>
                                                {{$vuetify.lang.t('$vuetify.login.login')}}
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-container>
                        </v-container>
                    </div>
                </v-col>
                <v-col>

                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'

    export default {
        name: "Login",
        data() {
            return {
                alertShow: true,
                isFormValid: true,
                username: '',
                password: '',
                rules: {
                    usernameRules: [
                        (username) => !!username || this.$vuetify.lang.t("$vuetify.login.usernameRules")
                    ],
                    passwordRules: [
                        (password) => !!password || this.$vuetify.lang.t("$vuetify.login.passwordRules")
                    ]
                },
                typeText:false
            }
        },
        computed: {
            ...mapGetters(["authError", "loading"])
        },
        methods: {
            handleSigninUser() {
                if (this.$refs.formLogin.validate()) {
                    this.$store.dispatch("signinUser", {
                        password: this.password,
                        userCredential: this.username,
                    })
                }
            },
            handleTypeText(){
                if(this.typeText){
                    this.typeText=false;
                }else{
                    this.typeText=true;
                }
            }
        }
    }
</script>

<style scoped>

</style>