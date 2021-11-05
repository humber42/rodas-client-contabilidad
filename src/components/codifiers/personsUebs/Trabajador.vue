<template>
    <v-container>
        <v-container class="mt-2">
            <v-layout row wrap>
                <v-flex>
                    <v-card outlined elevation="20">
                        <v-card-title class="hidden-md-and-up">Lista de Trabajadores</v-card-title>
                        <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                        <v-data-table v-else :headers="headers" :items="trabajadoresList" :items-per-page="5"
                                      class="elevation-1" :search="search"
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title class="hidden-sm-and-down">Lista de Trabajadores
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
                                    <span>Editar trabajador</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                @click="dialogOpenDelete(item)"
                                                color="red">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar trabajador</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>
                    <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nuevo trabajador"
                              max-width="520">
                        <v-card>
                            <v-card-title>Nuevo trabajador</v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                        @submit.prevent="handleNewTrabajador">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field type="text" v-model="trabajador.nombre"
                                                          label="Nombre del trabajador" :rules="rules.nombre"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="uebsList" :rules="rules.ueb" hide-selected
                                                        label="Seleccione la UEB" item-text="nombreUeb" item-value="id"
                                                        :search-input="searchUeb"
                                                        v-model="trabajador.ueb"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="cargosList" :rules="rules.cargo" hide-selected
                                                        label="Cargo" item-text="nombre" item-value="id"
                                                        :search-input="searchCargo"
                                                        v-model="trabajador.cargoDto"></v-combobox>
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
                            <v-card-title v-if="trabajadorToDelete!==null||trabajadorToDelete.id>0">Eliminar
                                trabajador
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container v-if="trabajadorToDelete!==null||trabajadorToDelete.id>0">

                                <h3 class="font-weight-light">¿Desea eliminar el trabajador con nombre
                                    {{trabajadorToDelete.nombre}}?</h3>
                                <v-layout row class="ma-1 text-center">
                                    <v-flex xs12>
                                        <v-btn color="success" class="mr-1" @click="handleDeleteTrabajador"
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
                            <v-card-title v-if="trabajadorToEdit!==null||trabajadorToEdit.id>0">Editar trabajador con
                                nombre
                                {{trabajadorToEdit.nombre}}
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                        @submit.prevent="handleEditTrabajador">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field type="text" v-model="trabajadorToEdit.nombre"
                                                          label="Nombre del trabajador" :rules="rules.nombre"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="uebsList" :rules="rules.ueb" hide-selected
                                                        label="Seleccione la UEB" item-text="nombreUeb" item-value="id"
                                                        :search-input="searchUeb"
                                                        v-model="trabajadorToEdit.ueb"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="cargosList" :rules="rules.cargo" hide-selected
                                                        label="Cargo" item-text="nombre" item-value="id"
                                                        :search-input="searchCargo"
                                                        v-model="trabajadorToEdit.cargoDto"></v-combobox>
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
        URL_DELETE_TRABAJADOR,
        URL_GET_ALL_CARGOS,
        URL_GET_ALL_TRABAJDOR, URL_GET_ALL_UEB,
        URL_SAVE_TRABAJADOR, URL_UPDATE_TRABAJADOR
    } from "../../../constants/UrlResource";

    export default {
        name: "Trabajador",
        data: () => {
            return {
                tableLoading: false,
                loading: false,
                classButtons: '',
                cargosList: [],
                uebsList: [],
                trabajadoresList: [],
                headers: [
                    {text: "Nombre", value: "nombre", align: 'center'},
                    {text: "UEB", value: "ueb.nombreUeb", align: 'center'},
                    {text: "Cargo", value: "cargoDto.nombre", align: 'center'},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                search: '',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                trabajador: {
                    id: 0,
                    nombre: "",
                    idCargo: 0,
                    idUeb: 0,
                    ueb: null,
                    cargoDto: null,
                    reporteDiarioLaboralList: []
                },
                trabajadorToDelete:{},
                trabajadorToEdit:{},
                searchCargo: '',
                searchUeb:'',
                rules:{
                    nombre: [
                        (nombre) => !!nombre || "El nombre es requerido"
                    ],
                    cargo: [
                        (cargo) => !!cargo || "El cargo es requerida"
                    ],
                    ueb:[
                        (ueb)=>!!ueb||"La UEB es requerida"
                    ]
                }
            }
        },
        methods:{
            editItem(item){
                this.trabajadorToEdit.id=item.id;
                this.trabajadorToEdit.nombre=item.nombre;
                this.trabajadorToEdit.idCargo=item.idCargo;
                this.trabajadorToEdit.idUeb=item.idUeb;
                this.trabajadorToEdit.cargoDto=item.cargoDto;
                this.trabajadorToEdit.ueb=item.ueb;
                this.trabajadorToEdit.reporteDiarioLaboralList=item.reporteDiarioLaboralList;
                this.loadAllCargos();
                this.loadAllUebs();
                this.openDialogEdit=true;
            },
            dialogOpenDelete(item){
                this.trabajadorToDelete=item;
                this.openDeleteDialog=true;
            },
            openDialogoNew(){
                this.loadAllUebs()
                this.loadAllCargos();
                this.openDialogNew=true;
            },
            loadDataTable(){
                this.tableLoading=true;
                const token = localStorage.getItem("token");
                axios.get(URL_GET_ALL_TRABAJDOR, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Trabajador", data);
                    this.trabajadoresList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleNewTrabajador(){
                if (this.$refs.formNew.validate()) {
                    this.loading = true;
                    const payload = {
                        "id": 0,
                        "idCargo": this.trabajador.cargoDto.id,
                        "idUeb": this.trabajador.ueb.id,
                        "nombre": this.trabajador.nombre
                    }
                    const token = localStorage.getItem('token');
                    axios.post(URL_SAVE_TRABAJADOR, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data)
                        this.trabajadoresList.push(data);
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
            handleDeleteTrabajador(){
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete( URL_DELETE_TRABAJADOR+ this.trabajadorToDelete.id, {
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
                this.spendElementToDelete = {};
            },
            handleEditTrabajador(){
                if (this.$refs.formEdit.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    this.trabajadorToEdit.idCargo = this.trabajadorToEdit.cargoDto.id;
                    this.trabajadorToEdit.idUeb = this.trabajadorToEdit.ueb.id
                    axios.put(URL_UPDATE_TRABAJADOR, this.trabajadorToEdit, {
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
            loadAllUebs(){
                const token = localStorage.getItem("token");
                axios.get(URL_GET_ALL_UEB, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Uebs", data);
                    this.uebsList = data;
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