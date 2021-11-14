<template>
    <v-container>
        <v-container class="mt-2">
            <v-layout row wrap>
                <v-flex>
                    <v-card outlined elevation="20">
                        <v-card-title class="hidden-md-and-up">Lista de Órdenes de Trabajo</v-card-title>
                        <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                        <v-data-table v-else :headers="headers" :items="ordenTrabajoList" :items-per-page="5"
                                      class="elevation-1" :search="search"
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title class="hidden-sm-and-down">Lista de Órdenes de Trabajo
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
                                           @click="openNewDialog" v-resize="onResizes">
                                        <v-icon>mdi-plus</v-icon>
                                        <span v-if="!classButtons">
                                         Nuevo
                                    </span></v-btn>
                                </v-toolbar>
                            </template>
                            <template v-slot:item.cerrada="{item}">
                                <h4>{{item.cerrada?"Si":"No"}}</h4>
                            </template>
                            <template v-slot:item.actions="{item}">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="closeOrdenTrabajo(item)"
                                                :color="item.cerrada?'green':'primary'">
                                            {{item.cerrada?"mdi-cancel":"mdi-check"}}
                                        </v-icon>
                                    </template>
                                    <span>{{item.cerrada?"Abrir":"Cerrar"}} orden de trabajo</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="deleteItem(item)"
                                                color="red">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar orden de trabajo</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>

                    <v-dialog v-model="openDeleteDialog" persistent max-width="520">
                        <v-card>
                            <v-card-title v-if="ordenTrabajoToDelete!==null">Eliminar la orden de trabajo
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <h3 v-if="ordenTrabajoToDelete!==null" class="font-weight-light">¿Desea eliminar la orden de trabajo {{ordenTrabajoToDelete.ordenTrabajo}}?</h3>
                                <v-layout row class="ma-1 text-center">
                                    <v-flex xs12>
                                        <v-btn color="success" class="mr-1" @click="handleDeleteOrdenTrabajo"
                                               :loading="loading"
                                               :disabled="loading">
                                    <span slot="loader" class="custom-loader">
                                        <v-icon>mdi-refresh</v-icon>
                                    </span>
                                            Si
                                        </v-btn>
                                        <v-btn color="error" class="ml-1" @click="handleCancelDeleteDialog">No</v-btn>
                                    </v-flex>
                                </v-layout>
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
        URL_CLOSE_OR_OPEN_ORDEN_TRABAJO,
        URL_DELETE_ORDEN_TRABAJO,
        URL_GET_ALL_ORDEN_TRBAJO
    } from "../../constants/UrlResource";

    export default {
        name: "OrdenesDeTrabajo",
        data(){
            return{
                tableLoading: false,
                loading: false,
                classButtons: '',
                ordenTrabajoList:[],
                headers:[
                    {text: "Orden", value: "ordenTrabajo", align: "center"},
                    {text: "Ficha de costo", value: "fichaCostoDto.id", align: "center"},
                    {text: "Cliente", value: "cliente.nombre", align: "center"},
                    {text: "Fecha Entrega", value: "fechaEntrega", align: "center"},
                    {text: "Cerrada", value: "cerrada", align: "center"},
                    {text: "Acciones", value: "actions", align: "center"}
                ],
                search: '',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                ordenTrabajo:null,
                ordenTrabajoToDelete:null,
                ordenTrabajoToEdit:null,
            }
        },
        methods:{
            deleteItem(item){
                console.log(item)
                this.ordenTrabajoToDelete=item;
                this.openDeleteDialog=true;
            },
            loadDataTable(){
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_ORDEN_TRBAJO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Orden trabajo", data);
                    this.ordenTrabajoList = data;
                }).catch(err => {
                    console.log(err);
                    this.tableLoading = false;
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            openNewDialog(){
                this.$router.push("/register-work-order")
            },

            handleDeleteOrdenTrabajo(){
                const token = localStorage.getItem('token')
                this.loading =true;
                axios.delete(URL_DELETE_ORDEN_TRABAJO+this.ordenTrabajoToDelete.id,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(()=>{
                    this.loadDataTable();
                    this.loading=false;
                    this.handleCancelDeleteDialog()
                }).catch(err=> {
                    console.log(err)
                    this.loading=false
                })

            },

            handleCancelDeleteDialog(){
                this.openDeleteDialog=false;
                this.ordenTrabajoToDelete=null
            },
            closeOrdenTrabajo(item){
                const token = localStorage.getItem('token');
                axios.put(URL_CLOSE_OR_OPEN_ORDEN_TRABAJO,null,{
                    params:{
                        id:item.id
                    },
                    headers:{
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(()=>{
                    item.cerrada=!item.cerrada
                }).catch(err=>console.log(err));
            },
            onResizes() {
                const windowsSize = {x: window.innerWidth, y: window.innerHeight}
                if (windowsSize.x <= 768) {
                    this.classButtons = true;
                } else {
                    this.classButtons = false;
                }
            },

        },
        mounted(){
            this.loadDataTable();
        }
    }
</script>

<style scoped>

</style>