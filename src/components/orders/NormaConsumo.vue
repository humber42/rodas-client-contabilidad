<template>
    <v-container>
        <v-container class="mt-2">
            <v-layout row wrap>
                <v-flex>
                    <v-card outlined elevation="20">
                        <v-card-title class="hidden-md-and-up">Lista de Normas de Consumo</v-card-title>
                        <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                        <v-data-table v-else :headers="headers" :items="normasConsumoList" :items-per-page="5"
                                      class="elevation-1" :search="search"
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title class="hidden-sm-and-down">Lista de Normas de Consumo
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
                                    <span>Editar norma de consumo</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                @click="dialogOpenDelete(item)"
                                                color="red">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar norma de consumo</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>
                    <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nueva norma de consumo"
                              max-width="520">
                        <v-card>
                            <v-card-title>Nuevo norma de consumo</v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                        @submit.prevent="handleNewNormaConsumo">


                                    <v-row>
                                        <v-col cols="6">
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="text" v-model="normaConsumo.nombreAprueba"
                                                                  label="Nombre del que aprueba" :rules="rules.requerido"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-combobox :items="cargosList" :rules="rules.requerido" hide-selected
                                                                label="Seleccione el cargo" item-text="nombre" item-value="id"
                                                                :search-input="searchCargo"
                                                                v-model="normaConsumo.cargo"></v-combobox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-combobox :items="uebList" :rules="rules.requerido" hide-selected
                                                                label="Seleccione la UEB" item-text="nombreUeb" item-value="id"
                                                                :search-input="searchUeb"
                                                                v-model="normaConsumo.ueb"></v-combobox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-combobox :items="actividadesList" :rules="rules.requerido" hide-selected
                                                                label="Seleccione la actividad" item-text="nombre" item-value="id"
                                                                :search-input="searchActividad"
                                                                v-model="normaConsumo.actividad"></v-combobox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-combobox :items="planProduccionList" :rules="rules.requerido" hide-selected
                                                                label="Seleccione el plan" item-text="id" item-value="id"
                                                                :search-input="searchPlanProduccion"
                                                                v-model="normaConsumo.planProduccion"></v-combobox>
                                                </v-flex>
                                            </v-layout>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumo.capacidadInstalada"
                                                                  label="Capacidad instalada" :rules="rules.requerido"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumo.capacidadInstaladaUtilizacionPercent"
                                                                  label="Capacidad instalada porciento" :rules="rules.requerido" prefix="%"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumo.precio"
                                                                  label="Precio" :rules="rules.requerido" prefix="$"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumo.produccionPeriodoAnterior"
                                                                  label="Producción período anterior" :rules="rules.requerido"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumo.margenUtilidadPercentCuc"
                                                                  label="Margen de utilidad CUC" :rules="rules.requerido" prefix="%"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumo.margenUtilidadPercentMt"
                                                                  label="Margen de utilidad MT" :rules="rules.requerido" prefix="%"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-col>
                                    </v-row>
                                    <v-divider></v-divider>
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
                            <v-card-title v-if="normaConsumoToDelete!==null">Eliminar
                                norma de consumo
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container v-if="normaConsumoToDelete!==null">
                                <h3 class="font-weight-light">¿Desea eliminar la norma de consumo para la actividad
                                    {{normaConsumoToDelete.actividad.nombre}}?</h3>
                                <v-layout row class="ma-1 text-center">
                                    <v-flex xs12>
                                        <v-btn color="success" class="mr-1" @click="handleDeleteNormaConsumo"
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
                            <v-card-title v-if="normaConsumoToEdit.id!==undefined">Editar la norma de consumo para la actividad
                                {{normaConsumoToEdit.actividad.nombre}}
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container v-if="normaConsumoToEdit.id!==undefined">
                                <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                        @submit.prevent="handleEditNormaConsumo">
                                    <v-row>
                                        <v-col cols="6">
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-combobox :items="uebList" :rules="rules.requerido" hide-selected
                                                                label="Seleccione la UEB" item-text="nombreUeb" item-value="id"
                                                                :search-input="searchUeb"
                                                                v-model="normaConsumoToEdit.ueb"></v-combobox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-combobox :items="actividadesList" :rules="rules.requerido" hide-selected
                                                                label="Seleccione la actividad" item-text="nombre" item-value="id"
                                                                :search-input="searchActividad"
                                                                v-model="normaConsumoToEdit.actividad"></v-combobox>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-combobox :items="planProduccionList" :rules="rules.requerido" hide-selected
                                                                label="Seleccione el plan" item-text="id" item-value="id"
                                                                :search-input="searchPlanProduccion"
                                                                v-model="normaConsumoToEdit.planProduccion"></v-combobox>
                                                </v-flex>
                                            </v-layout>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumoToEdit.capacidadInstalada"
                                                                  label="Capacidad instalada" :rules="rules.requerido"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumoToEdit.capacidadInstaladaUtilizacionPercent"
                                                                  label="Capacidad instalada porciento" :rules="rules.requerido" prefix="%"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumoToEdit.precio"
                                                                  label="Precio" :rules="rules.requerido" prefix="$"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumoToEdit.produccionPeriodoAnterior"
                                                                  label="Producción período anterior" :rules="rules.requerido"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumoToEdit.margenUtilidadPercentCuc"
                                                                  label="Margen de utilidad CUC" :rules="rules.requerido" prefix="%"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row class="ma-1">
                                                <v-flex xs12>
                                                    <v-text-field type="number" v-model="normaConsumoToEdit.margenUtilidadPercentMt"
                                                                  label="Margen de utilidad MT" :rules="rules.requerido" prefix="%"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-col>
                                    </v-row>
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
        URL_DELETE_NORMAS_CONSUMO,
        URL_GET_ALL_ACTIVITIES, URL_GET_ALL_CARGOS,
        URL_GET_ALL_NORMAS_CONSUMO,
        URL_GET_ALL_PLAN_PRODUCCION,
        URL_GET_ALL_UEB, URL_SAVE_NORMAS_CONSUMO, URL_UPDATE_NORMAS_CONSUMO
    } from "../../constants/UrlResource";

    export default {
        name: "NormaConsumo",
        data(){
            return{
                tableLoading: false,
                loading: false,
                classButtons: '',
                normasConsumoList:[],
                planProduccionList:[],
                actividadesList:[],
                cargosList:[],
                uebList:[],
                headers:[
                    {text:"Aprobado por",value: "nombreAprueba",align: "center"},
                    {text:"UEB",value: "ueb.nombreUeb",align: "center"},
                    {text:"Actividad",value: "actividad.nombre",align: "center"},
                    {text:"Plan de producción",value: "planProduccion.id",align: "center"},
                    {text:"Precio ($)",value: "precio",align: "center"},
                    {text:"Acciones",value:"actions",align:"center"}
                ],
                search:'',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                normaConsumo:{
                    capacidadInstalada: 0,
                    capacidadInstaladaUtilizacionPercent: 0,
                    cargo:null,
                    id: 0,
                    actividad:null,
                    planProduccion:null,
                    ueb:null,
                    margenUtilidadPercentCuc: 0,
                    margenUtilidadPercentMt: 0,
                    nombreAprueba: "",
                    precio: 0,
                    produccionPeriodoAnterior: 0
                },
                normaConsumoToDelete:null,
                normaConsumoToEdit: {},
                searchActividad:'',
                searchUeb:'',
                searchPlanProduccion:'',
                searchCargo:'',
                rules:{
                    requerido:[
                        (requerido)=>!!requerido||"El campo es requerido"
                    ]
                }
            }
        },
        methods:{
            editItem(item){
                this.normaConsumoToEdit.id=item.id;
                this.normaConsumoToEdit.capacidadInstalada=item.capacidadInstalada;
                this.normaConsumoToEdit.capacidadInstaladaUtilizacionPercent=item.capacidadInstaladaUtilizacionPercent;
                this.normaConsumoToEdit.cargoAprueba=item.cargoAprueba;
                this.normaConsumoToEdit.actividad=item.actividad;
                this.normaConsumoToEdit.planProduccion=item.planProduccion;
                this.normaConsumoToEdit.ueb=item.ueb;
                this.normaConsumoToEdit.margenUtilidadPercentCuc=item.margenUtilidadPercentCuc;
                this.normaConsumoToEdit.margenUtilidadPercentMt=item.margenUtilidadPercentMt;
                this.normaConsumoToEdit.nombreAprueba=item.nombreAprueba;
                this.normaConsumoToEdit.precio=item.precio;
                this.normaConsumoToEdit.produccionPeriodoAnterior=item.produccionPeriodoAnterior;
                this.loadAllUebs();
                this.loadAllActivities();
                this.loadAllPlanProduccion();
                this.openDialogEdit=true;
            },
            dialogOpenDelete(item){
                this.normaConsumoToDelete=item;
                this.openDeleteDialog=true;
            },
            openDialogoNew(){
                this.loadAllUebs();
                this.loadAllActivities();
                this.loadAllCargos();
                this.loadAllPlanProduccion();
                this.openDialogNew=true;
            },
            loadDataTable(){
                this.tableLoading=true;
                const token = localStorage.getItem("token");
                axios.get(URL_GET_ALL_NORMAS_CONSUMO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Norma Consumo", data);
                    this.normasConsumoList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleNewNormaConsumo(){
                if(this.$refs.formNew.validate()){
                    this.loading=true;
                    const token = localStorage.getItem('token');
                    const payload={
                        capacidadInstalada: this.normaConsumo.capacidadInstalada,
                        capacidadInstaladaUtilizacionPercent: this.normaConsumo.capacidadInstaladaUtilizacionPercent,
                        cargoAprueba:this.normaConsumo.cargo.nombre,
                        id: 0,
                        idActividad:this.normaConsumo.actividad.id,
                        idPlanProduccion:this.normaConsumo.planProduccion.id,
                        idUeb:this.normaConsumo.ueb.id,
                        margenUtilidadPercentCuc: this.normaConsumo.margenUtilidadPercentCuc,
                        margenUtilidadPercentMt: this.normaConsumo.margenUtilidadPercentMt,
                        nombreAprueba: this.normaConsumo.nombreAprueba,
                        precio: this.normaConsumo.precio,
                        produccionPeriodoAnterior: this.normaConsumo.produccionPeriodoAnterior
                    };
                    axios.post(URL_SAVE_NORMAS_CONSUMO,payload,{
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data})=>{
                        this.normasConsumoList.push(data)
                        this.loading=false;
                        this.handleCancelarNewDialog();
                    }).catch(err=>{
                        this.loading=false;
                        console.log(err);
                    })
                }
            },
            handleCancelarNewDialog() {
                this.$refs.formNew.reset();
                this.openDialogNew = false;
            },
            handleDeleteNormaConsumo(){
                this.loading =true;
                const token = localStorage.getItem('token');
                axios.delete(URL_DELETE_NORMAS_CONSUMO+this.normaConsumoToDelete.id,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(()=>{
                    this.loading=false;
                    this.handleCancelarDeleteDialog()
                    this.loadDataTable();
                }).catch(err=>{
                    this.loading=false;
                    console.log(err)
                })
            },
            handleCancelarDeleteDialog() {
                this.openDeleteDialog = false;
                this.normaConsumoToDelete = null;
            },
            handleEditNormaConsumo(){
                if(this.$refs.formEdit.validate()){
                    const token = localStorage.getItem('token');
                    const payload = {
                        capacidadInstalada: this.normaConsumoToEdit.capacidadInstalada,
                        capacidadInstaladaUtilizacionPercent: this.normaConsumoToEdit.capacidadInstaladaUtilizacionPercent,
                        cargoAprueba: this.normaConsumoToEdit.cargoAprueba,
                        id: this.normaConsumoToEdit.id,
                        idActividad: this.normaConsumoToEdit.actividad.id,
                        idPlanProduccion: this.normaConsumoToEdit.planProduccion.id,
                        idUeb: this.normaConsumoToEdit.ueb.id,
                        margenUtilidadPercentCuc: this.normaConsumoToEdit.margenUtilidadPercentCuc,
                        margenUtilidadPercentMt: this.normaConsumoToEdit.margenUtilidadPercentMt,
                        nombreAprueba: this.normaConsumoToEdit.nombreAprueba,
                        precio: this.normaConsumoToEdit.precio,
                        produccionPeriodoAnterior: this.normaConsumoToEdit.produccionPeriodoAnterior
                    };
                    axios.put(URL_UPDATE_NORMAS_CONSUMO,payload,{
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(()=>{
                        this.loading=false;
                        this.loadDataTable();
                        this.handleCancelarEditDialog();
                    }).catch(err=>{
                        console.log(err);
                        this.loading=false;
                    })
                }

            },
            handleCancelarEditDialog() {
                this.normaConsumoToEdit={};
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
            loadAllUebs(){
                const token = localStorage.getItem("token");
                axios.get(URL_GET_ALL_UEB, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Uebs", data);
                    this.uebList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            loadAllActivities(){
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_ACTIVITIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Actividades", data);
                    this.actividadesList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            loadAllPlanProduccion(){
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_PLAN_PRODUCCION, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Plan de Produccion", data);
                    this.planProduccionList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            loadAllCargos(){
                const token = localStorage.getItem("token")
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
            }
        },
        mounted() {
            this.loadDataTable();
        }
    }
</script>

<style scoped>

</style>