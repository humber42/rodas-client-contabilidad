<template>
    <v-container>
        <v-container>
            <v-container class="mt-2">
                <v-layout row wrap>
                    <v-flex>
                        <v-card outlined elevation="20">
                            <v-card-title class="hidden-md-and-up">Lista de subelementos de gasto</v-card-title>
                            <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                            <v-data-table v-else :headers="headers" :items="subelementosGastos" :items-per-page="5"
                                          class="elevation-1" :search="search"
                            >
                                <template v-slot:top>
                                    <v-toolbar flat>
                                        <v-toolbar-title class="hidden-sm-and-down">Lista de subelementos de gasto
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
                                        <span>Editar subelemento gasto</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{on,attrs}">
                                            <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                    @click="dialogOpenDelete(item)"
                                                    color="red">
                                                mdi-delete
                                            </v-icon>
                                        </template>
                                        <span>Eliminar subelemento gasto</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-card>
                        <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nuevo subelemento gasto"
                                  max-width="520">
                            <v-card>
                                <v-card-title>Nuevo subelemento gasto</v-card-title>
                                <v-divider></v-divider>
                                <v-container>
                                    <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                            @submit.prevent="handleNewSpendSubelement">
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field label="Sublemento" v-model="spendSubelement.subelemento"
                                                              :rules="rules.nombreRules" counter
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field label="Código" v-model="spendSubelement.codigoSubelemento"
                                                              :rules="rules.codigoRules" counter
                                                              maxlength="50"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-textarea auto-grow label="Descripción"
                                                            v-model="spendSubelement.descripcion"
                                                            :rules="rules.descripcionRules" counter
                                                            maxlength="255"></v-textarea>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-combobox :items="spendElements" :rules="rules.elementoGasto" hide-selected
                                                            label="Elemento gasto" item-text="elemento" item-value="id"
                                                            v-model="spendSubelement.elementoGasto"></v-combobox>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout row class="ma-1">
                                            <v-flex xs12>

                                                <v-checkbox v-model="spendSubelement.mostrar"
                                                            label="Mostrar en ficha de costo"></v-checkbox>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1 mt-3">
                                            <v-flex xs12>
                                                <v-slider v-model="spendSubelement.orden"
                                                          label="Orden"
                                                          hint="Orden del subelemento de gasto"
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
                                <v-card-title v-if="spendSubelementToDelete!==null||spendSubelementToDelete.id>0">Eliminar
                                    subelemento gasto
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-container>
                                    <h3 class="font-weight-light">¿Desea eliminar el subelemento gasto con código
                                        {{spendSubelementToDelete.codigoSubelemento}}?</h3>
                                    <v-layout row class="ma-1 text-center">
                                        <v-flex xs12>
                                            <v-btn color="success" class="mr-1" @click="handleDeleteSpendSubelement"
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
                                <v-card-title v-if="spendSubelementToEdit!==null||spendSubelementToEdit.id>0">Editar elemento gasto
                                    con código
                                    {{spendSubelementToEdit.codigoSubelemento}}
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-container>
                                    <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                            @submit.prevent="handleEditSpendSubelement">
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field label="Elemento" v-model="spendSubelementToEdit.subelemento"
                                                              :rules="rules.nombreRules" counter
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-text-field label="Código" v-model="spendSubelementToEdit.codigoSubelemento"
                                                              :rules="rules.codigoRules" counter
                                                              maxlength="50"></v-text-field>
                                            </v-flex>
                                        </v-layout>

                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-textarea auto-grow label="Descripción"
                                                            v-model="spendSubelementToEdit.descripcion"
                                                            :rules="rules.descripcionRules" counter
                                                            maxlength="255"></v-textarea>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-combobox :items="spendElements" :rules="rules.elementoGasto" hide-selected
                                                            label="Tipos de actividad" item-text="elemento" item-value="id"
                                                            v-model="spendSubelementToEdit.elementoGasto"></v-combobox>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>

                                                <v-checkbox v-model="spendSubelementToEdit.mostrar"
                                                            label="Mostrar en ficha de costo"></v-checkbox>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1 mt-3">
                                            <v-flex xs12>
                                                <v-slider v-model="spendSubelementToEdit.orden"
                                                          label="Orden"
                                                          hint="Orden del subelemento de gasto"
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
        URL_DELETE_SUBELEMENTOS_GASTO,
        URL_GET_ALL_ELEMENTOS_GASTO,
        URL_GET_ALL_SUBELEMENTOS_GASTO,
        URL_SAVE_SUBELEMENTOS_GASTO, URL_UPDATE_SUBELEMENTOS_GASTO
    } from "../../../constants/UrlResource";

    export default {
        name: "SubElementoGasto",
        data(){
            return{
                tableLoading:false,
                loading:false,
                classButtons:'',
                subelementosGastos:[],
                headers:[
                    {text: "Código", value: "codigoSubelemento", align: "center"},
                    {text: "Subelemento", value: "subelemento", align: 'center'},
                    {text: "Elemento", value: "elementoGasto.elemento", align: 'center'},
                    {text: "Descripción", value: "descripcion", align: "center"},
                    {text: "Orden", value: "orden", align: "center"},
                    {text: "Mostrar", value: "mostrar", align: "center"},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                search:'',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                spendSubelement:{
                    id: 0,
                    subelemento: '',
                    mostrar: false,
                    orden: 1,
                    idElemento: 0,
                    codigoSubelemento: "",
                    descripcion: "",
                    elementoGasto:null
                },
                spendSubelementToDelete:{},
                spendSubelementToEdit:{},
                spendElements:[],
                rules:{
                    nombreRules: [
                        (nombre) => !!nombre || "El nombre es requerido"
                    ],
                    codigoRules: [
                        (codigo) => !!codigo || "El código es requerido",
                    ],
                    descripcionRules: [
                        (descripcion) => !!descripcion || "La descripción es requerida"
                    ],
                    elementoGasto:[
                        (elementoGasto)=> !!elementoGasto || "El elemento gasto es requerido"
                    ]
                }
            }
        },
        methods:{
            editItem(item){
                console.log(item)
                this.spendSubelementToEdit.id=item.id;
                this.spendSubelementToEdit.subelemento=item.subelemento;
                this.spendSubelementToEdit.mostrar=item.mostrar;
                this.spendSubelementToEdit.orden=item.orden;
                this.spendSubelementToEdit.idElemento=item.idElemento;
                this.spendSubelementToEdit.codigoSubelemento=item.codigoSubelemento;
                this.spendSubelementToEdit.descripcion=item.descripcion;
                this.spendSubelementToEdit.elementoGasto=item.elementoGasto;
                this.loadSpendElements()
                this.openDialogEdit=true;
            },
            dialogOpenDelete(item){
                this.spendSubelementToDelete=item;
                this.openDeleteDialog = true;
                console.log(item)
            },
            openDialogoNew(){
                this.loadSpendElements()
                this.openDialogNew=true;
            },
            loadDataTable(){
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_SUBELEMENTOS_GASTO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Subelemento gasto", data);
                    this.subelementosGastos = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleNewSpendSubelement(){
                if (this.$refs.formNew.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token")
                    const payload = {
                        "codigoSubelemento": this.spendSubelement.codigoSubelemento,
                        "descripcion": this.spendSubelement.descripcion,
                        "id": this.spendSubelement.id,
                        "idElemento": this.spendSubelement.elementoGasto.id,
                        "mostrar": this.spendSubelement.mostrar,
                        "orden": this.spendSubelement.orden,
                        "subelemento": this.spendSubelement.subelemento
                    }
                    console.log(payload)
                    axios.post(URL_SAVE_SUBELEMENTOS_GASTO, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data)
                        this.subelementosGastos.push(data);
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
            handleDeleteSpendSubelement(){
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete(URL_DELETE_SUBELEMENTOS_GASTO + this.spendSubelementToDelete.id, {
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
            handleEditSpendSubelement(){
                if (this.$refs.formEdit.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    this.spendSubelementToEdit.idElemento = this.spendSubelementToEdit.elementoGasto.id;
                    axios.put(URL_UPDATE_SUBELEMENTOS_GASTO, this.spendSubelementToEdit, {
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
            loadSpendElements(){
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_ELEMENTOS_GASTO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Elemento gasto", data);
                    this.spendElements = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
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
        }
    }
</script>

<style scoped>

</style>