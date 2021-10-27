<template>
    <v-container>
        <v-container>
            <v-container class="mt-2">
                <v-layout row wrap>
                    <v-flex>
                        <v-card outlined elevation="20">
                            <v-card-title class="hidden-md-and-up">Lista de elementos de gasto</v-card-title>
                            <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                            <v-data-table v-else :headers="headers" :items="elementosGastos" :items-per-page="5"
                                          class="elevation-1" :search="search"
                            >
                                <template v-slot:top>
                                    <v-toolbar flat>
                                        <v-toolbar-title class="hidden-sm-and-down">Lista de elementos de gasto
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
                                <template v-slot:item.mostrar="{item}">
                                    <v-layout row wrap class="align-content-center">
                                        <v-flex xs12>
                                            <v-checkbox class="shrink ml-lg-12 ml-md-7 ml-sm-6" readonly
                                                        v-model="item.mostrar"/>
                                        </v-flex>
                                    </v-layout>
                                </template>
                                <template v-slot:item.actions="{item}">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{on,attrs}">
                                            <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)"
                                                    color="orange">
                                                mdi-pen
                                            </v-icon>
                                        </template>
                                        <span>Editar tipo de elemento gasto</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{on,attrs}">
                                            <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                    @click="dialogOpenDelete(item)"
                                                    color="red">
                                                mdi-delete
                                            </v-icon>
                                        </template>
                                        <span>Eliminar tipo de elemento gasto</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-card>
                        <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nuevo elemento gasto"
                                  max-width="520">
                            <v-card>
                                <v-card-title>Nuevo elemento gasto</v-card-title>
                                <v-divider></v-divider>
                                <v-container>
                                    <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                            @submit.prevent="handleNewSpendElement">
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field label="Elemento" v-model="spendElement.elemento"
                                                              :rules="rules.nombreRules" counter
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field label="Código" v-model="spendElement.codigoElemento"
                                                              :rules="rules.codigoRules" counter
                                                              maxlength="50"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-textarea auto-grow label="Descripción"
                                                            v-model="spendElement.descripcion"
                                                            :rules="rules.descripcionRules" counter
                                                            maxlength="255"></v-textarea>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout row class="ma-1">
                                            <v-flex xs12>

                                                <v-checkbox v-model="spendElement.mostrar"
                                                            label="Mostrar en ficha de costo"></v-checkbox>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1 mt-3">
                                            <v-flex xs12>
                                                <v-slider v-model="spendElement.orden"
                                                          label="Orden"
                                                          hint="Orden del elemento de gasto"
                                                          thumb-label="always"
                                                          min="1" max="10"
                                                ></v-slider>
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
                                <v-card-title v-if="spendElementToDelete!==null||spendElementToDelete.id>0">Eliminar
                                    elemento gasto
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-container>
                                    <h3 class="font-weight-light">¿Desea eliminar el elemento gasto con código
                                        {{spendElementToDelete.codigoElemento}}?</h3>
                                    <v-layout row class="ma-1 text-center">
                                        <v-flex xs12>
                                            <v-btn color="success" class="mr-1" @click="handleDeleteSpendElement"
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
                                <v-card-title v-if="spendElementToEdit!==null||spendElementToEdit.id>0">Editar elemento gasto
                                    con código
                                    {{spendElementToEdit.codigoElemento}}
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-container>
                                    <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                            @submit.prevent="handleEditSpendElement">
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field label="Elemento" v-model="spendElementToEdit.elemento"
                                                              :rules="rules.nombreRules" counter
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field label="Código" v-model="spendElementToEdit.codigoElemento"
                                                              :rules="rules.codigoRules" counter
                                                              maxlength="50"></v-text-field>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-textarea auto-grow label="Descripción"
                                                            v-model="spendElementToEdit.descripcion"
                                                            :rules="rules.descripcionRules" counter
                                                            maxlength="255"></v-textarea>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>

                                                <v-checkbox v-model="spendElementToEdit.mostrar"
                                                            label="Mostrar en ficha de costo"></v-checkbox>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1 mt-3">
                                            <v-flex xs12>
                                                <v-slider v-model="spendElementToEdit.orden"
                                                          label="Orden"
                                                          hint="Orden del elemento de gasto"
                                                          thumb-label="always"
                                                          min="1" max="10"
                                                ></v-slider>
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
    </v-container>
</template>

<script>
    import axios from "axios";
    import {
        URL_DELETE_ELEMENTOS_GASTO,
        URL_GET_ALL_ELEMENTOS_GASTO,
        URL_SAVE_ELEMENTOS_GASTO, URL_UPDATE_ELEMENTOS_GASTO
    } from "../../../constants/UrlResource";

    export default {
        name: "ElementoGasto",
        data() {
            return {
                tableLoading: false,
                loading: false,
                classButtons: '',
                elementosGastos: [],
                headers: [
                    {text: "Código", value: "codigoElemento", align: "center"},
                    {text: "Elemento", value: "elemento", align: "center"},
                    {text: "Descripción", value: "descripcion", align: "center"},
                    {text: "Orden", value: "orden", align: "center"},
                    {text: "Mostrar", value: "mostrar", align: "center"},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                search: '',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                spendElement: {
                    id: 0,
                    elemento: "",
                    mostrar: false,
                    orden: 0,
                    descripcion: "",
                    codigoElemento: "",
                },
                spendElementToDelete: {},
                spendElementToEdit: {},
                rules: {
                    nombreRules: [
                        (nombre) => !!nombre || "El nombre es requerido"
                    ],
                    codigoRules: [
                        (codigo) => !!codigo || "El código es requerido",
                    ],
                    descripcionRules: [
                        (descripcion) => !!descripcion || "La descripción es requerida"
                    ],

                }
            }
        },
        methods: {
            editItem(item) {
                this.spendElementToEdit.id = item.id;
                this.spendElementToEdit.elemento = item.elemento;
                this.spendElementToEdit.mostrar = item.mostrar;
                this.spendElementToEdit.orden = item.orden;
                this.spendElementToEdit.descripcion = item.descripcion;
                this.spendElementToEdit.codigoElemento = item.codigoElemento;
                this.openDialogEdit = true;
            },
            dialogOpenDelete(item) {
                this.spendElementToDelete = item;
                this.openDeleteDialog = true;
            },
            openDialogoNew() {
                this.openDialogNew = true;
            },
            loadDataTable() {
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_ELEMENTOS_GASTO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Elemento gasto", data);
                    this.elementosGastos = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleNewSpendElement() {
                if (this.$refs.formNew.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token")
                    axios.post(URL_SAVE_ELEMENTOS_GASTO, this.spendElement, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data)
                        this.elementosGastos.push(data);
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
            handleDeleteSpendElement() {
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete(URL_DELETE_ELEMENTOS_GASTO + this.spendElementToDelete.id, {
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
            handleEditSpendElement() {
                if (this.$refs.formEdit.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    axios.put(URL_UPDATE_ELEMENTOS_GASTO, this.spendElementToEdit, {
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
            }
        },
        mounted() {
            this.loadDataTable();
        },

    }
</script>

<style scoped>

</style>