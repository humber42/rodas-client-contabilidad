<template>
    <v-container>
        <v-container class="mt-2">
            <v-layout row wrap>
                <v-flex>
                    <v-card outlined elevation="20">
                        <v-card-title class="hidden-md-and-up">Lista de Fichas de Costo</v-card-title>
                        <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                        <v-data-table v-else :headers="headers" :items="fichasDeCostoList" :items-per-page="5"
                                      class="elevation-1" :search="search"
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title class="hidden-sm-and-down">Lista de Fichas de Costo</v-toolbar-title>
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
                            <template v-slot:item.aprobada="{item}">
                                <v-checkbox v-model="item.aprobada" readonly class="shrink ml-lg-12 ml-md-7 ml-sm-6"></v-checkbox>
                            </template>
                            <template v-slot:item.actions="{item}">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)"
                                                color="orange">
                                            mdi-pen
                                        </v-icon>
                                    </template>
                                    <span>Editar ficha de costo</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="dialogOpenDelete(item)"
                                                color="red">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar ficha de costo</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>
                    <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nueva actividad"
                              max-width="520">
                        <v-card>
                            <v-card-title>Nueva Ficha de Costo</v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                        @submit.prevent="handleNewFichaCosto">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="actividades" label="Actividades"
                                                        item-text="nombre" item-value="id"
                                                        v-model="fichaCosto.actividad"
                                                        :rules="rules.actividad"></v-combobox>
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
                                            <v-btn class="ml-1" color="error" @click="handleCancelarNewDialog">Cancelar
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-container>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="openDeleteDialog" persistent max-width="520">
                        <v-card>
                            <v-card-title v-if="fichaCostoToDelete!==null">Eliminar ficha de costo
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <h3 v-if="fichaCostoToDelete!==null" class="font-weight-light">¿Desea eliminar la ficha de costo para la actividad
                                    {{fichaCostoToDelete.actividad.nombre}}?</h3>
                                <v-layout row class="ma-1 text-center">
                                    <v-flex xs12>
                                        <v-btn color="success" class="mr-1" @click="handleDeleteFichaCosto"
                                               :loading="loading"
                                               :disabled="loading">
                                    <span slot="loader" class="custom-loader">
                                        <v-icon>mdi-refresh</v-icon>
                                    </span>
                                            Si
                                        </v-btn>
                                        <v-btn color="error" class="ml-1" @click="handleCancelarDeleteDialog">No</v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="openDialogEdit" transition="fade" persistent max-width="520">
                        <v-card>
                            <v-card-title v-if="fichaCostoToEdit!==null">Editar ficha de costo para la actividad                           código
                                {{fichaCostoToEdit.actividad.nombre}}
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container v-if="fichaCostoToEdit!==null">
                                <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                        @submit.prevent="handleEditFichaCosto">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="actividades" label="Actividades" hide-selected
                                                        item-text="nombre" item-value="id"
                                                        v-model="fichaCostoToEdit.actividad"
                                                        :rules="rules.actividad"></v-combobox>
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
                                            <v-btn class="ml-1" color="error" @click="handleCancelarEditDialog">Cancelar
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
        URL_DELETE_FICHA_COSTO,
        URL_GET_ALL_ACTIVITIES,
        URL_GET_ALL_FICHA_COSTO,
        URL_SAVE_FICHA_COSTO
    } from "../../constants/UrlResource";

    export default {
        name: "FichaDeCosto",
        data() {
            return {
                tableLoading: false,
                loading: false,
                classButtons: '',
                fichasDeCostoList: [],
                headers: [
                    {text:"Actividad",value:"actividad.nombre",align:"center"},
                    {text:"Cantidad de Normas de Consumo",value:"normasConsumoList.length",align:"center"},
                    {text:"Cantidad de Órdenes de Trabajo",value:"ordenTrabajoList.length",align:"center"},
                    {text:"Aprobada",value:"aprobada",align: "center"},
                    {text:"Acciones",value:"actions",align: "center"}
                ],
                search: '',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                fichaCosto: {
                    id: 1,
                    idActividad: 1,
                    aprobada: true,
                    actividad: null,
                    normasConsumoList: [],
                    ordenTrabajoList: []
                },
                fichaCostoToDelete: null,
                fichaCostoToEdit: null,
                rules: {
                    actividad: [
                        (actividad) => !!actividad || "La ficha de costo necesita una actividad",
                    ]
                },
                actividades: []
            }
        },
        methods:{
            editItem(item){
                console.log(item)
            },
            dialogOpenDelete(item){
                this.fichaCostoToDelete=item;
              console.log(item)
                this.openDeleteDialog=true;
            },
            openDialogoNew(){
                this.loadActividades()
                this.openDialogNew=true;
            },
            loadDataTable(){
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_FICHA_COSTO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Ficha Costo", data);
                    this.fichasDeCostoList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            handleNewFichaCosto(){
                if (this.$refs.formNew.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token")
                    const payload = {
                        aprobada: false,
                        id: 0,
                        idActividad: this.fichaCosto.actividad.id
                    }
                    console.log(payload)
                    axios.post(URL_SAVE_FICHA_COSTO, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data)
                        this.fichasDeCostoList.push(data);
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
            handleDeleteFichaCosto(){
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete( URL_DELETE_FICHA_COSTO+ this.fichaCostoToDelete.id, {
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
                this.fichaCostoToDelete = null;
            },
            loadActividades(){
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_ACTIVITIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Actividades", data);
                    this.actividades = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            handleEditFichaCosto(){

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
            }
        },
        mounted() {
            this.loadDataTable()
        }
    }
</script>

<style scoped>

</style>