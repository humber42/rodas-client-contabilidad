<template>
    <v-container>
        <v-container class="mt-2">
            <v-layout row wrap>
                <v-flex>
                    <v-card outlined elevation="20">
                        <v-card-title class="hidden-md-and-up">Lista de gastos directos</v-card-title>
                        <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                        <v-data-table v-else :headers="headers" :items="gastosDirectos" :items-per-page="5"
                                      class="elevation-1" :search="search"
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title class="hidden-sm-and-down">Lista de gastos directos
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
                                    <span>Editar gasto directo</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                @click="dialogOpenDelete(item)"
                                                color="red">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar gasto directo</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>
                    <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nuevo gasto directo"
                              max-width="520">
                        <v-card>
                            <v-card-title>Nuevo gasto directo</v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                        @submit.prevent="handleNewDirectCost">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Nombre" v-model="directCost.nombre"
                                                          :rules="rules.nombreRules" counter maxlength="100"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Código" v-model="directCost.codigo"
                                                          :rules="rules.codigoRules" counter
                                                          maxlength="27"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-textarea auto-grow label="Descripción"
                                                        v-model="directCost.descripcion"
                                                        :rules="rules.descripcionRules" counter rows="2"
                                                        maxlength="255"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="spendElements" :rules="rules.elementoGasto" hide-selected
                                                        label="Elemento gasto" item-text="elemento" item-value="id"
                                                        v-model="directCost.elementoGasto"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="spendSubelements" :rules="rules.subelementoGasto" hide-selected
                                                        label="Subelemento gasto" item-text="subelemento" item-value="id"
                                                        v-model="directCost.subelementoGasto"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="tiposGastos" :rules="rules.tipoGastoDirecto" hide-selected
                                                        label="Tipo gasto directo" item-text="nombre" item-value="id"
                                                        v-model="directCost.tipoGastoDirecto"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="metricUnits" :rules="rules.unidadMedida" hide-selected
                                                        label="Unidad medida" item-text="nombre" item-value="id"
                                                        v-model="directCost.unidadMedida"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Precio CL" v-model="directCost.precioCl"
                                                          :rules="rules.precioCl" type="number"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Precio MN" v-model="directCost.precioMn" type="number"
                                                          :rules="rules.precioMn"
                                            ></v-text-field>
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
                            <v-card-title v-if="directCostToDelete!==null||directCostToDelete.id>0">Eliminar
                                gasto directo
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <h3 class="font-weight-light">¿Desea eliminar el gasto directo con código
                                    {{directCostToDelete.codigo}}?</h3>
                                <v-layout row class="ma-1 text-center">
                                    <v-flex xs12>
                                        <v-btn color="success" class="mr-1" @click="handleDeleteDirectCost"
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
                            <v-card-title v-if="directCostToEdit!==null||directCostToEdit.id>0">Editar gasto directo
                                con código
                                {{directCostToEdit.codigo}}
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                        @submit.prevent="handleEditDirectCost">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Nombre" v-model="directCostToEdit.nombre"
                                                          :rules="rules.nombreRules" counter maxlength="100"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Código" v-model="directCostToEdit.codigo"
                                                          :rules="rules.codigoRules" counter
                                                          maxlength="27"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-textarea auto-grow label="Descripción"
                                                        v-model="directCostToEdit.descripcion"
                                                        :rules="rules.descripcionRules" counter rows="2"
                                                        maxlength="255"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="spendElements" :rules="rules.elementoGasto" hide-selected
                                                        label="Elemento gasto" item-text="elemento" item-value="id"
                                                        v-model="directCostToEdit.elementoGasto"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="spendSubelements" :rules="rules.subelementoGasto" hide-selected
                                                        label="Subelemento gasto" item-text="subelemento" item-value="id"
                                                        v-model="directCostToEdit.subelementoGasto"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="tiposGastos" :rules="rules.tipoGastoDirecto" hide-selected
                                                        label="Tipo gasto directo" item-text="nombre" item-value="id"
                                                        v-model="directCostToEdit.tipoGastoDirecto"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="metricUnits" :rules="rules.unidadMedida" hide-selected
                                                        label="Unidad medida" item-text="nombre" item-value="id"
                                                        v-model="directCostToEdit.unidadMedida"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Precio CL" v-model="directCostToEdit.precioCl" type="number"
                                                          :rules="rules.precioCl"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Precio MN" v-model="directCostToEdit.precioMn" type="number"
                                                          :rules="rules.precioMn"
                                            ></v-text-field>
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
        URL_DELETE_GASTO_DIRECTO,
        URL_GET_ALL_ELEMENTOS_GASTO, URL_GET_ALL_GASTO_DIRECTO,
        URL_GET_ALL_SUBELEMENTOS_GASTO, URL_GET_ALL_TIPOS_GASTOS_DIRECTOS,
        URL_GET_ALL_UNIDAD_MEDIDA, URL_SAVE_GASTO_DIRECTO, URL_UPDATE_GASTO_DIRECTO
    } from "../../../constants/UrlResource";

    export default {
        name: "GastosDirectos",
        data(){
            return{
                tableLoading:false,
                loading:false,
                classButtons:'',
                gastosDirectos:[],
                headers:[
                    {text: "Código", value: "codigo", align: 'center'},
                    {text: "Nombre", value: "nombre", align: 'center'},
                    {text: "Descripción", value: "descripcion", align: 'center'},
                    {text: "Tipo gasto directo", value: "tipoGastoDirecto.nombre", align: 'center'},
                    {text: "Elemento de gasto", value: "elementoGasto.elemento", align: 'center'},
                    {text: "Subelemento de gasto", value: "subelementoGasto.subelemento", align: 'center'},
                    {text: "Unidad de medida", value: "unidadMedida.nombre", align: 'center'},
                    {text: "Precio MN", value: "precioMn", align: 'center'},
                    {text: "Precio CL", value: "precioCl", align: 'center'},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                search:'',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                directCost:{
                    codigo: "",
                    descripcion: "",
                    id: 0,
                    idElementoGasto: 0,
                    idSubelemento: 0,
                    idTipoGastoDirecto: 0,
                    idUnidadMedida: 0,
                    nombre: "",
                    precioCl: 0,
                    precioMn: 0,
                    tipoGastoDirecto:null,
                    unidadMedida:null,
                    elementoGasto:null,
                    subelementoGasto:null
                },
                directCostToDelete:{},
                directCostToEdit:{},
                spendElements:[],
                metricUnits:[],
                tiposGastos:[],
                spendSubelements:[],
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
                    ],
                    unidadMedida:[
                        (unidadMedida)=> !!unidadMedida || "La unidad de medida es requerida"
                    ],
                    tipoGastoDirecto:[
                        (tipoGastoDirecto)=> !!tipoGastoDirecto || "El tipo de gasto directo es requerido"
                    ],
                    subelementoGasto:[
                        (subelementoGasto)=> !!subelementoGasto || "El subelemento de gasto es requerido"
                    ],
                    precioMn:[
                        (precioMn)=>!!precioMn||"El precio es requerido"
                    ],
                    precioCl:[
                        (precioCl)=>!!precioCl||"El precio es requerido"
                    ]
                },
            }
        },
        methods:{
            editItem(item){
                this.loadMetricUnits();
                this.loadSpendElement();
                this.loadSpendSubelement();
                this.loadTipoGastosDirectos()
                this.directCostToEdit.codigo=item.codigo;
                this.directCostToEdit.descripcion=item.descripcion;
                this.directCostToEdit.id=item.id;
                this.directCostToEdit.idElementoGasto=item.idElementoGasto;
                this.directCostToEdit.idSubelemento=item.idSubelemento;
                this.directCostToEdit.idTipoGastoDirecto=item.idTipoGastoDirecto;
                this.directCostToEdit.idUnidadMedida=item.idUnidadMedida;
                this.directCostToEdit.nombre=item.nombre;
                this.directCostToEdit.precioCl=item.precioCl;
                this.directCostToEdit.precioMn=item.precioMn;
                this.directCostToEdit.tipoGastoDirecto=item.tipoGastoDirecto;
                this.directCostToEdit.unidadMedida=item.unidadMedida;
                this.directCostToEdit.elementoGasto=item.elementoGasto;
                this.directCostToEdit.subelementoGasto=item.subelementoGasto;
                this.openDialogEdit=true;
                console.log(item);
            },
            dialogOpenDelete(item){
                this.directCostToDelete=item;
                this.openDeleteDialog=true;
            },
            openDialogoNew(){
                this.loadMetricUnits();
                this.loadSpendElement();
                this.loadSpendSubelement();
                this.loadTipoGastosDirectos()
                this.openDialogNew=true;
            },
            loadDataTable(){
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_GASTO_DIRECTO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Gasto directo", data);
                    this.gastosDirectos = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleNewDirectCost(){
                if (this.$refs.formNew.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token")
                    const payload = {
                        codigo: this.directCost.codigo,
                        descripcion: this.directCost.descripcion,
                        id: this.directCost.id,
                        idElementoGasto: this.directCost.elementoGasto.id,
                        idSubelemento: this.directCost.subelementoGasto.id,
                        idTipoGastoDirecto: this.directCost.tipoGastoDirecto.id,
                        idUnidadMedida: this.directCost.unidadMedida.id,
                        nombre: this.directCost.nombre,
                        precioCl: this.directCost.precioCl,
                        precioMn: this.directCost.precioMn
                    }
                    console.log(payload)
                    axios.post(URL_SAVE_GASTO_DIRECTO, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data)
                        this.gastosDirectos.push(data);
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
            handleDeleteDirectCost(){
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete( URL_DELETE_GASTO_DIRECTO+ this.directCostToDelete.id, {
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
            handleEditDirectCost(){
                if (this.$refs.formEdit.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    this.directCostToEdit.idElementoGasto = this.directCostToEdit.elementoGasto.id;
                    this.directCostToEdit.idSubelemento = this.directCostToEdit.subelementoGasto.id;
                    this.directCostToEdit.idTipoGastoDirecto = this.directCostToEdit.tipoGastoDirecto.id;
                    this.directCostToEdit.idUnidadMedida = this.directCostToEdit.unidadMedida.id;
                    axios.put(URL_UPDATE_GASTO_DIRECTO, this.directCostToEdit, {
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
            loadMetricUnits(){
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_UNIDAD_MEDIDA, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Unidades de medida", data);
                    this.metricUnits = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            loadTipoGastosDirectos(){
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_TIPOS_GASTOS_DIRECTOS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Tipos de gastos directos", data);
                    this.tiposGastos = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            loadSpendElement(){
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
            loadSpendSubelement(){
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_SUBELEMENTOS_GASTO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Subelemento gasto", data);
                    this.spendSubelements = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
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
        mounted(){
            this.loadDataTable()
        }
    }
</script>

<style scoped>

</style>