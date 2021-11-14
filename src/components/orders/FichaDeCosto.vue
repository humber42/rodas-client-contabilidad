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
                                    <v-toolbar-title class="hidden-sm-and-down">Lista de Fichas de Costo
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
                            <template v-slot:item.aprobada="{item}">
                                <v-checkbox v-model="item.aprobada" readonly
                                            class="shrink ml-lg-12 ml-md-7 ml-sm-6"></v-checkbox>
                            </template>
                            <template v-slot:item.actions="{item}">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)"
                                                color="orange">
                                            mdi-book-edit
                                        </v-icon>
                                    </template>
                                    <span>Manejar normas de consumo</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="aprobarOrdenTrabajo(item)"
                                                :color="item.aprobada?'green':'primary'">
                                            {{item.aprobada?"mdi-cancel":"mdi-check"}}
                                        </v-icon>
                                    </template>
                                    <span>{{item.aprobada?"Desaprobar":"Aprobar"}} ficha de costo</span>
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
                                <h3 v-if="fichaCostoToDelete!==null" class="font-weight-light">¿Desea eliminar la ficha
                                    de costo para la actividad
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
                            <v-card-title v-if="fichaCostoToEdit!==null">Manejar normas de consumo para la ficha de
                                costo de la actividad
                                {{fichaCostoToEdit.actividad.nombre}}
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container v-if="fichaCostoToEdit!==null">
                                <h3 class="font-weight-light">Normas de consumo existentes</h3>
                                <v-list>
                                    <v-virtual-scroll width="520" height="150" item-height="50"
                                                      :items="normasConsumoDeFichaCosto">
                                        <template v-slot:default="{item}">
                                            <v-list-item :key="item.id">
                                                <v-list-item-title>Aprobada por: {{item.nombreAprueba}}</v-list-item-title>
                                                <v-spacer></v-spacer>
                                                <v-list-item-subtitle>Precio: {{item.precio}}</v-list-item-subtitle>
                                                <v-list-item-action>
                                                    <v-btn color="red" @click="handleDeleteAsign(item)" icon><v-icon>mdi-delete</v-icon></v-btn>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </template>
                                    </v-virtual-scroll>
                                </v-list>
                                <v-divider></v-divider>
                                <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                        @submit.prevent="handleAddNormasConsumo">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="normasConsumoList" :rules="rules.actividad"
                                                        hide-selected
                                                        label="Seleccione la norma de consumo" item-text="id"
                                                        item-value="id"
                                                        v-model="fichaCostoNormaConsumo.normasConsumo"></v-combobox>
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
        URL_APROVE_FICHA_COSTO,
        URL_DELETE_FICHA_COSTO, URL_DELETE_NORMAS_CONSUMO_FICHA_COSTO,
        URL_GET_ALL_ACTIVITIES,
        URL_GET_ALL_FICHA_COSTO, URL_GET_ALL_NORMAS_CONSUMO,
        URL_SAVE_FICHA_COSTO, URL_SAVE_NORMAS_CONSUMO_FICHA_COSTO
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
                    {text: "Actividad", value: "actividad.nombre", align: "center"},
                    {text: "Cantidad de Normas de Consumo", value: "normasConsumoList.length", align: "center"},
                    {text: "Cantidad de Órdenes de Trabajo", value: "ordenTrabajoList.length", align: "center"},
                    {text: "Aprobada", value: "aprobada", align: "center"},
                    {text: "Acciones", value: "actions", align: "center"}
                ],
                search: '',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                fichaCostoNormaConsumo: {
                    id: 0,
                    idNormaConsumo: 0,
                    idFichaCosto: 0,
                    normasConsumo: null,
                    fichaCosto: null
                },
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
                actividades: [],
                normasConsumoList: [],
                normasConsumoDeFichaCosto: []
            }
        },
        methods: {
            editItem(item) {
                console.log(item);
                this.loadNormasConsumo();
                this.fichaCostoToEdit = item;
                this.fichaCostoNormaConsumo.fichaCosto = item;
                this.normasConsumoDeFichaCosto = item.normasConsumoList
                console.log("Normas de consumo de ficha costo",this.normasConsumoDeFichaCosto);
                this.openDialogEdit = true;
            },
            dialogOpenDelete(item) {
                this.fichaCostoToDelete = item;
                console.log(item)
                this.openDeleteDialog = true;
            },
            openDialogoNew() {
                this.loadActividades()
                this.openDialogNew = true;
            },
            loadDataTable() {
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
            handleNewFichaCosto() {
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
            handleDeleteFichaCosto() {
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete(URL_DELETE_FICHA_COSTO + this.fichaCostoToDelete.id, {
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
            loadActividades() {
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
            handleAddNormasConsumo() {
                if(this.$refs.formEdit.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem('token');
                    const paylaod = {
                        id: 0,
                        idFichaCosto: this.fichaCostoNormaConsumo.fichaCosto.id,
                        idNormaConsumo: this.fichaCostoNormaConsumo.normasConsumo.id
                    }
                    console.log("To save", paylaod);
                    axios.post(URL_SAVE_NORMAS_CONSUMO_FICHA_COSTO, paylaod, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data);
                        this.loadDataTable();
                        this.handleCancelarEditDialog();
                    }).catch(err => {
                        this.loading = false;
                        console.error(err);
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
            aprobarOrdenTrabajo(item) {
                const token = localStorage.getItem('token');
                axios.put(URL_APROVE_FICHA_COSTO, null, {
                    params: {
                        id: item.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(() => {
                    item.aprobada = !item.aprobada
                }).catch(err => {
                    err.console.log(err)
                })
            },
            loadNormasConsumo() {
                const token = localStorage.getItem("token");
                axios.get(URL_GET_ALL_NORMAS_CONSUMO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Norma Consumo", data);
                    for (let i = 0; i < this.fichaCostoNormaConsumo.fichaCosto.normasConsumoList.length; i++)
                        for (let j = 0; j < data.length; j++) {
                            if (data[j].id === this.fichaCostoNormaConsumo.fichaCosto.normasConsumoList[i].id) {
                                data.splice(j, 1);
                            }
                        }
                    this.normasConsumoList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleDeleteAsign(item){
                const token = localStorage.getItem('token');
                axios.delete(URL_DELETE_NORMAS_CONSUMO_FICHA_COSTO,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                    params:{
                        idFichaCosto:this.fichaCostoNormaConsumo.fichaCosto.id,
                        idNormaConsumo:item.id
                    }
                }).then(()=>{
                    const i = this.normasConsumoDeFichaCosto.indexOf(item);
                    this.normasConsumoDeFichaCosto.splice(i,1);
                    this.loadNormasConsumo();
                }).catch(err=>console.log(err));
            }

        },
        mounted() {
            this.loadDataTable()
        }
    }
</script>

<style scoped>

</style>