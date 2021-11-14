<template>
    <v-container class="mt-2">
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-card-title class="hidden-md-and-up">Lista de reportes</v-card-title>
                    <v-data-table :headers="headers" :items="reporteDiarioList" :items-per-page="5"
                                  class="elevation-1"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title class="hidden-sm-and-down">Lista de reportes
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn color="secondary" :disabled="disabledButtons" dark @click="setData">Finalizar</v-btn>
                                <v-btn color="primary" :disabled="disabledButtons" :fab="classButtons" :small="classButtons" class="ml-2"
                                       @click="addItem" v-resize="onResizes">
                                    <v-icon>mdi-plus</v-icon>
                                    <span v-if="!classButtons">
                                         Añadir
                                    </span></v-btn>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{item}">
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="deleteItem(item)"
                                            color="red">
                                        mdi-delete
                                    </v-icon>
                                </template>
                                <span>Eliminar reporte</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-card>
                <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nueva actividad"
                          max-width="320">
                    <v-card>
                        <v-card-title>Nuevo reporte</v-card-title>
                        <v-divider></v-divider>
                        <v-container>
                            <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                    @submit.prevent="addItemToList">
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field label="Fecha" v-model="reporteDiario.fecha"
                                                      :rules="rules.fecha" type="date"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-combobox :items="trabajadoresList" label="Trabajador"
                                                    item-text="nombre" item-value="id"
                                                    v-model="reporteDiario.trabajador"
                                                    :rules="rules.trabajadores"></v-combobox>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field label="Cantidad de Horas" v-model="reporteDiario.cantHoras"
                                                      :rules="rules.cantHoras" type="number"
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
                                        <v-btn class="ml-1" color="error" @click="handleCancelarNewDialog">Cancelar
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
</template>

<script>
    import axios from "axios";
    import {URL_GET_ALL_TRABAJDOR} from "../../../constants/UrlResource";

    export default {
        name: "ReporteDiarioLaboralComponent",
        data(){
            return{
                reporteDiarioList:[],
                headers:[
                    {text: "Trabajador", value: "trabajador.nombre", align: "center"},
                    {text: "Fecha", value: "fecha", align: "center"},
                    {text: "Cantidad de horas", value: "cantHoras", align: "center"},
                    {text: "Acciones", value: "actions", align: "center"}
                ],
                loading:false,
                openDialogNew:false,
                isFormValid:true,
                reporteDiario:{
                    trabajador:null,
                    fecha:'',
                    cantHoras:0
                },
                classButtons:'',
                rules:{
                    trabajadores:[
                        (trabajador)=>!!trabajador||"El trabajador es requerido"
                    ],
                    fecha:[
                        (fecha)=>!!fecha||"La fecha es requerida"
                    ],
                    cantHoras:[
                        (cantHoras)=>!!cantHoras||"La cantidad de horas es requerida"
                    ]
                },
                trabajadoresList:[],
                disabledButtons:false,
            }
        },
        methods:{
            deleteItem(item){
                const indice = this.reporteDiarioList.indexOf(item)
                this.reporteDiarioList.splice(indice,1)
            },
            addItem(){
                this.openDialogNew=true;
                this.loadTrabajadores();
            },
            addItemToList(){
                if(this.$refs.formNew.validate()){
                    const toAdd ={
                        trabajador:this.reporteDiario.trabajador,
                        fecha:this.reporteDiario.fecha,
                        cantHoras:this.reporteDiario.cantHoras
                    }
                    this.reporteDiarioList.push(toAdd);
                    this.$refs.formNew.reset();
                    this.openDialogNew=false;
                }
            },
            setData(){
                this.disabledButtons=true;
                this.$emit("getData",this.reporteDiarioList)
            },
            onResizes() {
                const windowsSize = {x: window.innerWidth, y: window.innerHeight}
                if (windowsSize.x <= 768) {
                    this.classButtons = true;
                } else {
                    this.classButtons = false;
                }
            },
            handleCancelarNewDialog(){
                this.$refs.formNew.reset();
                this.openDialogNew=false;
            },
            loadTrabajadores(){
                const token = localStorage.getItem("token");
                axios.get(URL_GET_ALL_TRABAJDOR, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Trabajador", data);
                    this.trabajadoresList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            }
        }

    }
</script>

<style scoped>

</style>