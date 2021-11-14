<template>
    <v-container>
        <v-container class="mt-2">
            <v-layout row wrap>
                <v-flex>
                    <v-card outlined elevation="20">
                        <v-card-title class="hidden-md-and-up">Lista de Planes de Producción</v-card-title>
                        <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                        <v-data-table v-else :headers="headers" :items="planProduccionList" :items-per-page="5"
                                      class="elevation-1" :search="search"
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title class="hidden-sm-and-down">Lista de Planes de Producción
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
                                            mdi-book-edit
                                        </v-icon>
                                    </template>
                                    <span>Manejar actividades</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="dialogOpenDelete(item)"
                                                color="red">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar plan de producción</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>
                    <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nueva actividad"
                              max-width="520">
                        <v-card>
                            <v-card-title>Nuevo plan de producción</v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                        @submit.prevent="handleNewPlanProduccion">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="uebsList" label="Unidades Empresarial de Base"
                                                        item-text="nombreUeb" item-value="id"
                                                        v-model="planProduccion.ueb"
                                                        :rules="rules.ueb"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="actividadesList" label="Actividades"
                                                        item-text="nombre" item-value="id"
                                                        v-model="planProduccion.actividadDtoList"
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
                            <v-card-title v-if="planProduccionToDelete!==null">Eliminar ficha de costo
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <h3 v-if="planProduccionToDelete!==null" class="font-weight-light">¿Desea eliminar el plan de produccion correspondiente
                                    a la UEB {{planProduccionToDelete.ueb.nombreUeb}}?</h3>
                                <v-layout row class="ma-1 text-center">
                                    <v-flex xs12>
                                        <v-btn color="success" class="mr-1" @click="handleDeletePlanProduccion"
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
                    <v-dialog v-model="openDialogEdit" transition="fade" persistent max-width="540">
                        <v-card>
                            <v-card-title v-if="planProduccionToEdit!==null">Manejar actividades del plan de producción de la UEB
                                {{planProduccionToEdit.ueb.nombreUeb}}
                            </v-card-title>
                            <v-container v-if="planProduccionToEdit!==null">
                                <h3 class="font-weight-light">Actividades del plan de producción</h3>
                                <v-list>
                                    <v-virtual-scroll width="520" height="150" item-height="50" :items="actividadesDelPlanProduccion">
                                        <template v-slot:default="{item}">
                                            <v-list-item :key="item.id" >
                                                <v-list-item-action>
                                                    <v-btn color="red" @click="handleDeleteAsign(item)" outlined>{{item.nombre}}<v-icon>mdi-delete</v-icon></v-btn>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </template>
                                    </v-virtual-scroll>
                                </v-list>
                                <v-divider></v-divider>
                                <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                        @submit.prevent="handleEditPlanProduccion">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="actividadesList" :rules="rules.actividad" hide-selected
                                                        label="Seleccione la etapa" item-text="nombre" item-value="id"
                                                        v-model="planProduccionActividad.actividad"></v-combobox>
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
        URL_DELETE_ACTIVIDAD_PLAN_PRODUCCION_ESPECIAL,
        URL_DELETE_PLAN_PRODUCCION, URL_GET_ALL_ACTIVITIES,
        URL_GET_ALL_PLAN_PRODUCCION, URL_GET_ALL_UEB,
        URL_SAVE_ACTIVIDAD_PLAN_PRODUCCION,
        URL_SAVE_PLAN_PRODUCCION
    } from "../../constants/UrlResource";

    export default {
        name: "PlanProduccion",
        data() {
            return {
                tableLoading: false,
                loading: false,
                classButtons: '',
                planProduccionList: [],
                headers: [
                    {text: "UEB", value: "ueb.nombreUeb", align: "center"},
                    {text: "Cantidad de Actividades", value: "actividadDtoList.length", align: "center"},
                    {text: "Cantidad de Normas de Consumo", value: "normasConsumoList.length", align: "center"},
                    {text: "Acciones", value: "actions", align: "center"}
                ],
                search: '',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                planProduccionActividad:{
                    id:0,
                    idPlanProduccion:0,
                    idActividad:0,
                    planProduccion:null,
                    actividad:null,
                },
                planProduccion: {
                    id: 1,
                    idUeb: 1,
                    ueb: null,
                    actividadDtoList: null,
                    normasConsumoList: null
                },
                planProduccionToDelete: null,
                planProduccionToEdit: null,
                rules: {
                    ueb: [
                        (ueb) => !!ueb || "El plan de producción requiere la UEB"
                    ],
                    actividad: [
                        (actividad) => !!actividad || "El plan de producción requiere una actividad"
                    ]
                },
                uebsList: [],
                actividadesList: [],
                actividadesDelPlanProduccion:[],
            }
        },
        methods: {
            editItem(item) {
                console.log(item);
                this.loadActividades2();
                this.planProduccionToEdit=item;
                this.planProduccionActividad.planProduccion=item;
                this.actividadesDelPlanProduccion=item.actividadDtoList;
                this.openDialogEdit=true;
            },
            dialogOpenDelete(item) {
                this.planProduccionToDelete = item;
                console.log(item);
                this.openDeleteDialog = true;
            },
            openDialogoNew() {
                this.loadActividades();
                this.loadAllUebs();
                this.openDialogNew = true;
            },
            loadDataTable() {
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_PLAN_PRODUCCION, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Plan de Produccion", data);
                    this.planProduccionList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            handleNewPlanProduccion() {
                if (this.$refs.formNew.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token")
                    const payload = {
                        id: 0,
                        idUeb: this.planProduccion.ueb.id
                    }
                    console.log(payload)
                    axios.post(URL_SAVE_PLAN_PRODUCCION, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        const payloadToActivityAdd = {
                            id: 0,
                            idActividad: this.planProduccion.actividadDtoList.id,
                            idPlanProduccion: data.id
                        }
                        axios.post(URL_SAVE_ACTIVIDAD_PLAN_PRODUCCION, payloadToActivityAdd, {
                            headers: {
                                "Authorization": "Bearer " + token,
                            }
                        }).then((data)=>{
                            this.loading = false;
                            console.log(data)
                            this.loadDataTable();
                            this.handleCancelarNewDialog()
                        }).catch(err=>{
                            this.loading=false;
                            console.log(err)
                        })
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
            handleDeletePlanProduccion(){
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete( URL_DELETE_PLAN_PRODUCCION+ this.planProduccionToDelete.id, {
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
                this.planProduccionToDelete = null;
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
                    this.actividadesList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            loadActividades2(){
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_ACTIVITIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Actividades", data);
                    for(let i=0;i<this.planProduccionActividad.planProduccion.actividadDtoList.length;i++){
                        for(let j=0;j<data.length;j++){
                            if(data[j].id===this.planProduccionActividad.planProduccion.actividadDtoList[i].id){
                                data.splice(j,1);
                            }
                        }
                    }
                    this.actividadesList=data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
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
            },
            handleEditPlanProduccion(){
                if(this.$refs.formEdit.validate()){
                    this.loading=true;
                    const token = localStorage.getItem('token');
                    const paylaod ={
                        id: 0,
                        idActividad: this.planProduccionActividad.actividad.id,
                        idPlanProduccion: this.planProduccionActividad.planProduccion.id
                    }
                    console.log("To save", paylaod);
                    axios.post(URL_SAVE_ACTIVIDAD_PLAN_PRODUCCION,paylaod,{
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data})=>{
                        this.loading=false;
                        console.log(data);
                        this.loadDataTable();
                        this.handleCancelarEditDialog();
                    }).catch(err=>{
                        this.loading=false;
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
            handleDeleteAsign(item){
                const token = localStorage.getItem("token");
                axios.delete(URL_DELETE_ACTIVIDAD_PLAN_PRODUCCION_ESPECIAL,{
                    params:{
                        idActividad:item.id,
                        idPlanProduccion:this.planProduccionActividad.planProduccion.id
                    }
                    ,headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(()=>{
                   const i= this.actividadesDelPlanProduccion.indexOf(item)
                    this.actividadesDelPlanProduccion.splice(i,1);
                   this.loadActividades2()
                }).catch(err=>console.log(err))
            }
        },
        mounted() {
            this.loadDataTable();
        }
    }
</script>

<style scoped>

</style>