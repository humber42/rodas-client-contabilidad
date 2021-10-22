import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import {JWT_SECRET_KEY, URL_GET_USER_BY_USERNAME, URL_LOGIN_POST} from "../constants/UrlResource";
import router from "../router";


const jwt = require('jsonwebtoken')

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        authError: null,
        loading: null,
        error: null
    },
    mutations: {
        setUser: (state, payload) => {
            state.user = payload
        },
        setAuthError: (state, payload) => {
            state.authError = payload
        },
        setLoading: (state, payload) => {
            state.loading = payload
        },
        setError: (state, payload) => {
            state.error = payload
        },
        clearError: (state) => {
            state.error = null
        }
    },
    actions: {
        signinUser: ({commit}, payload) => {
            commit('clearError');
            commit("setLoading", true);

            axios.post(URL_LOGIN_POST, payload)
                .then(({data}) => {
                    commit('setAuthError', null);
                    commit('setLoading', false)
                    localStorage.setItem('token', data);
                    const decode = jwt.decode(data, JWT_SECRET_KEY)
                    if (decode === null) {
                        console.log("Token is null :(")
                        router.push("/login").then(() => console.log("to login")).catch(() => console.log("Duplicated but we go to /login :)"));
                    } else {
                        commit("clearError");
                        axios.get(URL_GET_USER_BY_USERNAME + decode.sub, {
                            headers: {
                                "Authorization": "Bearer " + data,
                                "cache-control": "no-cache",
                            }
                        })
                            .then(({data}) => {
                                console.log(data);
                                commit('setUser', data);
                                router.push("/").then(() => console.log("to-dashboard")).catch(() =>
                                    console.log("Duplicated but we go to / :)")
                                )
                            })
                            .catch(err => {
                                console.log(err)
                                commit('setError', err);
                                router.push("/login").then(() => console.log("to login")).catch(() => console.log("Duplicated but we go to /login :)"));
                            })
                    }
                }).catch(err => {
                console.log(err);
                commit('setAuthError', err);
                commit('setLoading', false)
            })
        },
        getCurrentUser: ({commit}) => {
            const token = localStorage.getItem("token")
            const decode = jwt.decode(token, JWT_SECRET_KEY)
            if (decode === null) {
                router.push("/login").then(() => console.log("to login")).catch(() => console.log("Duplicated but we go to /login :)"));
            } else {
                commit("clearError");
                axios.get(URL_GET_USER_BY_USERNAME + decode.sub, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                })
                    .then(({data}) => {
                        console.log('Usuario',data);
                        commit('setUser', data);
                        router.push("/").then(() => console.log("to-dashboard")).catch(() =>
                            console.log("Duplicated but we go to / :)")
                        )
                    })
                    .catch(err => {
                        console.log(err)
                        commit("setUser", null);
                        commit('setError', err);
                        router.push("/login").then(() => console.log("to login")).catch(() => console.log("Duplicated but we go to /login :)"));
                    })
            }
        },
        logoutUser: ({commit}) => {
            commit('setUser', null);
            localStorage.clear();
            router.push("/login").then(() => console.log("to login")).catch(err => console.log(err));
        }
    },
    modules: {},
    getters: {
        user: (state) => state.user,
        loading: (state) => state.loading,
        authError: (state) => state.authError,
        error: (state) => state.error
    }
});
