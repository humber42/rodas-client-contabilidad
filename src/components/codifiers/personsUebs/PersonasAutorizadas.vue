<template>
    <v-container>
        <v-container class="mt-2">
            <v-layout row wrap>
                <v-flex>
                    <v-card outlined elevation="20">
                        <v-card-title class="hidden-md-and-up">Lista de Personas Autorizadas</v-card-title>
                        <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                        <v-data-table v-else :headers="headers" :items="personasList" :items-per-page="5"
                                      class="elevation-1" :search="search"
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title class="hidden-sm-and-down">Lista de Personas Autorizadas
                                    </v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar"
                                                  single-line hide-details></v-text-field>
                                    <v-spacer></v-spacer>
                                    <v-btn color="orange" :fab="classButtons" :small="classButtons"
                                           @click="loadDataTable"
                                           dark v-resize="onResizes">
                                        <v-icon>mdi-refresh</v-icon>
                                        <span v-if="!classButtons">
                                         Refrescar
                                    </span>
                                    </v-btn>
                                    <v-btn color="primary" :fab="classButtons" :small="classButtons" class="ml-2"
                                           @click="openDialogoNew" v-resize="onResizes">
                                        <v-icon>mdi-plus</v-icon>
                                        <span v-if="!classButtons">
                                         Nuevo
                                    </span></v-btn>
                                </v-toolbar>
                            </template>
                            <template v-slot:item.actions="{item}">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)"
                                                color="orange">
                                            mdi-pen
                                        </v-icon>
                                    </template>
                                    <span>Editar persona autorizada</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                @click="dialogOpenDelete(item)"
                                                color="red">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar persona autorizada</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>
                    <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nueva persona autorizada"
                              max-width="520">
                        <v-card>
                            <v-card-title>Nueva persona autorizada</v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                        @submit.prevent="handleNewPersonaAutorizada">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="usuariosList" :rules="rules.usuario" hide-selected
                                                        label="Usuario" item-text="fullname" item-value="id" :search-input="searchUser"
                                                        v-model="personaAutorizada.usuario"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="cargosList" :rules="rules.cargo" hide-selected
                                                        label="Cargo" item-text="nombre" item-value="id" :search-input="searchCargo"
                                                        v-model="personaAutorizada.cargoDto"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1 text-right">
                                        <v-flex>
                                            <v-btn class="mr-1" color="success" type="submit" :loading="loading"
                                                   :disabled="!isFormValid||loading">
                                               <span slot="loader" class="custom-loader">
                                                   <v-icon>mdi-refresh</v-icon>
                                               </span>
                                                Aceptar
                                            </v-btn>
                                            <v-btn class="ml-1" color="error" @click="handleCancelarNewDialog">
                                                Cancelar
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-container>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="openDeleteDialog" persistent max-width="520">
                        <v-card>
                            <v-card-title v-if="personaToDelete!==null||personaToDelete.id>0">Eliminar
                                persona autorizada
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container v-if="personaToDelete!==null||personaToDelete.id>0">

                                <h3 class="font-weight-light">¿Desea eliminar la persona autorizada con nombre
                                    {{personaToDelete.usuario.fullname}}?</h3>
                                <v-layout row class="ma-1 text-center">
                                    <v-flex xs12>
                                        <v-btn color="success" class="mr-1" @click="handleDeletePersonaAutorizada"
                                               :loading="loading"
                                               :disabled="loading">
                                    <span slot="loader" class="custom-loader">
                                        <v-icon>mdi-refresh</v-icon>
                                    </span>
                                            Si
                                        </v-btn>
                                        <v-btn color="error" class="ml-1" @click="handleCancelarDeleteDialog">No
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="openDialogEdit" transition="fade" persistent max-width="520">
                        <v-card>
                            <v-card-title v-if="personaToEdit!==null||personaToEdit.id>0">Editar persona autorizada con nombre
                                {{personaToEdit.usuario.fullname}}
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                        @submit.prevent="handleEditPersonaAutorizada">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="cargosList" :rules="rules.cargo" hide-selected
                                                        label="Cargo" item-text="nombre" item-value="id" :search-input="searchCargo"
                                                        v-model="personaToEdit.cargoDto"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1 text-right">
                                        <v-flex>
                                            <v-btn class="mr-1" color="success" type="submit" :loading="loading"
                                                   :disabled="!isFormValid||loading">
                                               <span slot="loader" class="custom-loader">
                                                   <v-icon>mdi-refresh</v-icon>
                                               </span>
                                                Aceptar
                                            </v-btn>
                                            <v-btn class="ml-1" color="error" @click="handleCancelarEditDialog">
                                                Cancelar
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-container>
                        </v-card>
                    </v-dialog>
                </v-flex>
            </v-layout>
        </v-container>
    </v-container>
</template>

<script>
    import axios from "axios";
    import {
        URL_DELETE_PERSONA_AUTORIZADA,
        URL_GET_ALL_CARGOS,
        URL_GET_ALL_PERSONA_AUTORIZADA,
        URL_GET_ALL_USERS, URL_SAVE_PERSONA_AUTORIZADA, URL_UPDATE_PERSONA_AUTORIZADA
    } from "../../../constants/UrlResource";

    export default {
        name: "PersonasAutorizadas",
        data(){
            return{
                tableLoading: false,
                loading: false,
                classButtons: '',
                personasList:[],
                usuariosList:[],
                cargosList:[],
                headers:[
                    {text: "Nombre", value: "usuario.fullname", align: 'center'},
                    {text: "Cargo", value: "cargoDto.nombre", align: 'center'},
                    {text: "Correo", value: "usuario.email", align: 'center'},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                search:'',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                personaAutorizada:{
                    id: 0,
                    idUsuario: 0,
                    idCargo: 0,
                    usuario:null,
                    cargoDto:null,
                },
                searchUser:'',
                searchCargo:'',
                personaToDelete:{
                    id: 0,
                    idUsuario: 0,
                    idCargo: 0,
                    usuario: {
                        fullname:""
                    },
                    cargoDto:null,
                },
                personaToEdit: {
                    id: 0,
                    idUsuario: 0,
                    idCargo: 0,
                    usuario: {
                        fullname:""
                    },
                    cargoDto:null,
                },
                rules:{
                    usuario: [
                        (usuario) => !!usuario || "El usuario es requerido"
                    ],
                    cargo: [
                        (cargo) => !!cargo || "El cargo es requerida"
                    ],
                }
            }
        },
        methods:{
            editItem(item){
                this.personaToEdit.id=item.id;
                this.personaToEdit.idUsuario=item.idUsuario;
                this.personaToEdit.idCargo=item.idCargo;
                this.personaToEdit.usuario=item.usuario;
                this.personaToEdit.cargoDto=item.cargoDto;
                this.loadAllCargos()
                this.openDialogEdit=true;
            },
            dialogOpenDelete(item){
                this.personaToDelete=item;
                this.openDeleteDialog=true;
            },
            openDialogoNew(){
                this.loadAllUsers()
                this.loadAllCargos();
                this.openDialogNew=true;
            },
            loadDataTable(){
                this.tableLoading=true;
                const token = localStorage.getItem("token");
                axios.get(URL_GET_ALL_PERSONA_AUTORIZADA, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Persona Autorizada", data);
                    this.personasList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleNewPersonaAutorizada(){
                if (this.$refs.formNew.validate()) {
                    this.loading = true;
                    const payload = {
                        id: 0,
                        idCargo: this.personaAutorizada.cargoDto.id,
                        idUsuario: this.personaAutorizada.usuario.id
                    }
                    const token = localStorage.getItem('token');
                    axios.post(URL_SAVE_PERSONA_AUTORIZADA, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data)
                        this.personasList.push(data);
                        this.handleCancelarNewDialog()
                    }).catch(err => {
                        this.loading = false;
                        console.log(err)
                    })
                }
            },
            handleCancelarNewDialog() {
                this.$refs.formNew.reset();
                this.openDialogNew = false;
            },
            handleDeletePersonaAutorizada(){
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete( URL_DELETE_PERSONA_AUTORIZADA+ this.personaToDelete.id, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(() => {
                    this.loading = false;
                    this.handleCancelarDeleteDialog();
                    this.loadDataTable();
                }).catch((err) => {
                    this.loading = false;
                    console.log(err)
                })
            },
            handleCancelarDeleteDialog() {
                this.openDeleteDialog = false;
                this.spendElementToDelete = {
                    id: 0,
                    idUsuario: 0,
                    idCargo: 0,
                    usuario: {
                        fullname:""
                    },
                    cargoDto:null,
                };
            },
            handleEditPersonaAutorizada(){
                if (this.$refs.formEdit.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    this.personaToEdit.idCargo = this.personaToEdit.cargoDto.id;
                    axios.put(URL_UPDATE_PERSONA_AUTORIZADA, this.personaToEdit, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        console.log(data);
                        this.loading = false;
                        this.loadDataTable();
                        this.handleCancelarEditDialog();
                    }).catch(err => {
                        console.log(err)
                        this.loading = false;
                    })
                }
            },
            handleCancelarEditDialog() {
                this.$refs.formEdit.reset();
                this.openDialogEdit = false;
            },
            onResizes() {
                const windowsSize = {x: window.innerWidth, y: window.innerHeight}
                if (windowsSize.x <= 768) {
                    this.classButtons = true;
                } else {
                    this.classButtons = false;
                }
            },
            loadAllCargos(){
                const token = localStorage.getItem('token')
                axios.get(URL_GET_ALL_CARGOS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Cargos", data);
                    this.cargosList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            loadAllUsers(){
                const token = localStorage.getItem('token')
                axios.get(URL_GET_ALL_USERS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Usuarios", data);
                    this.usuariosList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            }
        },
        mounted() {
            this.loadDataTable();
        }
    }
</script>

<style scoped>

</style>