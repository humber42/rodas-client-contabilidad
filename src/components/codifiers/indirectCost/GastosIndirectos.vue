<template>
    <v-container>
        <v-container class="mt-2">
            <v-layout row wrap>
                <v-flex>
                    <v-card outlined elevation="20">
                        <v-card-title class="hidden-md-and-up">Lista de gastos indirectos</v-card-title>
                        <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                        <v-data-table v-else :headers="headers" :items="gastosIndirectos" :items-per-page="5"
                                      class="elevation-1" :search="search"
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title class="hidden-sm-and-down">Lista de gastos indirectos
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
                                    <span>Editar gasto indirecto</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                @click="dialogOpenDelete(item)"
                                                color="red">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar gasto indirecto</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>
                    <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nuevo gasto indirecto"
                              max-width="520">
                        <v-card>
                            <v-card-title>Nuevo gasto indirecto</v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                        @submit.prevent="handleNewIndirectCost">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Nombre" v-model="indirectCost.nombre"
                                                          :rules="rules.nombreRules" counter maxlength="100"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Código" v-model="indirectCost.codigo"
                                                          :rules="rules.codigoRules" counter
                                                          maxlength="27"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-textarea auto-grow label="Descripción"
                                                        v-model="indirectCost.descripcion"
                                                        :rules="rules.descripcionRules" counter rows="2"
                                                        maxlength="255"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="tiposGastos" :rules="rules.tipoGastoIndirecto" hide-selected
                                                        label="Tipo gasto indirecto" item-text="nombre" item-value="id"
                                                        v-model="indirectCost.tipoGastoIndirecto"></v-combobox>
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
                            <v-card-title v-if="indirectCostToDelete!==null||indirectCostToDelete.id>0">Eliminar
                                gasto indirecto
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <h3 class="font-weight-light">¿Desea eliminar el gasto indirecto con código
                                    {{indirectCostToDelete.codigo}}?</h3>
                                <v-layout row class="ma-1 text-center">
                                    <v-flex xs12>
                                        <v-btn color="success" class="mr-1" @click="handleDeleteIndirectCost"
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
                            <v-card-title v-if="indirectCostToEdit!==null||indirectCostToEdit.id>0">Editar gasto indirecto
                                con código
                                {{indirectCostToEdit.codigo}}
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                        @submit.prevent="handleEditIndirectCost">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Nombre" v-model="indirectCostToEdit.nombre"
                                                          :rules="rules.nombreRules" counter maxlength="100"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Código" v-model="indirectCostToEdit.codigo"
                                                          :rules="rules.codigoRules" counter
                                                          maxlength="27"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-textarea auto-grow label="Descripción"
                                                        v-model="indirectCostToEdit.descripcion"
                                                        :rules="rules.descripcionRules" counter rows="2"
                                                        maxlength="255"></v-textarea>
                                        </v-flex>
                                    </v-layout>

                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="tiposGastos" :rules="rules.tipoGastoIndirecto" hide-selected
                                                        label="Tipo gasto indirecto" item-text="nombre" item-value="id"
                                                        v-model="indirectCostToEdit.tipoGastoIndirecto"></v-combobox>
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
        URL_DELETE_GASTO_INDIRECTO,
        URL_GET_ALL_GASTO_INDIRECTO,
        URL_GET_ALL_TIPOS_GASTOS_INDIRECTOS,
        URL_SAVE_GASTO_INDIRECTO, URL_UPDATE_GASTO_INDIRECTO
    } from "../../../constants/UrlResource";

    export default {
        name: "GastosIndirectos",
        data(){
            return{
                tableLoading:false,
                loading:false,
                classButtons:'',
                gastosIndirectos:[],
                headers:[
                    {text: "Código", value: "codigo", align: 'center'},
                    {text: "Nombre", value: "nombre", align: 'center'},
                    {text: "Descripción", value: "descripcion", align: 'center'},
                    {text: "Tipo gasto directo", value: "tipoGastoIndirecto.nombre", align: 'center'},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                search:'',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                indirectCost:{
                    id: 0,
                    codigo: '',
                    nombre: "",
                    descripcion: "",
                    idTipoGastoIndirecto: 0,
                    tipoGastoIndirecto: null
                },
                indirectCostToDelete:{},
                indirectCostToEdit:{},
                tiposGastos:[],
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
                    tipoGastoIndirecto:[
                        (tipoGastoIndirecto)=> !!tipoGastoIndirecto || "El tipo de gasto indirecto es requerido"
                    ],
                },
            }
        },
        methods:{
            editItem(item){
                this.indirectCostToEdit.id=item.id;
                this.indirectCostToEdit.codigo=item.codigo;
                this.indirectCostToEdit.nombre=item.nombre;
                this.indirectCostToEdit.descripcion=item.descripcion;
                this.indirectCostToEdit.idTipoGastoIndirecto=item.idTipoGastoIndirecto;
                this.indirectCostToEdit.tipoGastoIndirecto=item.tipoGastoIndirecto;
                this.loadTipoGastoIndirecto();
                this.openDialogEdit=true;
                console.log(item);
            },
            dialogOpenDelete(item){
                this.indirectCostToDelete=item;
                this.openDeleteDialog=true;
            },
            openDialogoNew(){
                this.loadTipoGastoIndirecto();
                this.openDialogNew=true;
            },
            loadTipoGastoIndirecto(){
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_TIPOS_GASTOS_INDIRECTOS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Tipos de gastos indirectos", data);
                    this.tiposGastos = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            loadDataTable(){
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_GASTO_INDIRECTO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Gasto indirecto", data);
                    this.gastosIndirectos = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleNewIndirectCost(){
                if (this.$refs.formNew.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token")
                    const payload = {
                        codigo: this.indirectCost.codigo,
                        descripcion: this.indirectCost.descripcion,
                        id: 0,
                        idTipoGastoIndirecto: this.indirectCost.tipoGastoIndirecto.id,
                        nombre: this.indirectCost.nombre
                    }
                    console.log(payload)
                    axios.post(URL_SAVE_GASTO_INDIRECTO, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data)
                        this.gastosIndirectos.push(data);
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
            handleDeleteIndirectCost(){
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete( URL_DELETE_GASTO_INDIRECTO+ this.indirectCostToDelete.id, {
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
                this.indirectCostToDelete= {};
            },
            handleEditIndirectCost(){
                if (this.$refs.formEdit.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    this.directCostToEdit.idTipoGastoIndirecto = this.directCostToEdit.tipoGastoIndirecto.id;
                    axios.put(URL_UPDATE_GASTO_INDIRECTO, this.directCostToEdit, {
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
        }
    }
</script>

<style scoped>

</style>