<template>
    <v-container class="mt-2">
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-card-title class="hidden-md-and-up">Lista de Materiales</v-card-title>
                    <v-data-table  :headers="headers" :items="materialesList" :items-per-page="5"
                                  class="elevation-1"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title class="hidden-sm-and-down">Lista de Materiales
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn color="secondary" dark @click="setData" :disabled="disabledButtons">Finalizar</v-btn>
                                <v-btn color="primary" :fab="classButtons" :disabled="disabledButtons" :small="classButtons" class="ml-2"
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
                                <span>Eliminar material</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-card>
                <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nueva actividad"
                          max-width="320">
                    <v-card>
                        <v-card-title>Nuevo material</v-card-title>
                        <v-divider></v-divider>
                        <v-container>
                            <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                    @submit.prevent="addItemToList">
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field label="Fecha" v-model="material.fecha"
                                                      :rules="rules.fecha" type="date"
                                                      ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field label="Nombre" v-model="material.noVentaSalida"
                                                      :rules="rules.noVentaSalida" type="text"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field label="Importe MLC" v-model="material.importeMlc"
                                                      :rules="rules.importeMlc" type="number"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field label="Importe MN" v-model="material.importeMn"
                                                      :rules="rules.importeMN" type="number"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field label="Total" v-model="material.total"
                                                      :rules="rules.total" type="text"
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
    export default {
        name: "MaterialesComponent",
        data(){
            return{
                materialesList:[],
                headers:[
                    {text: "Fecha", value: "fecha", align: "center"},
                    {text: "Nombre", value: "noVentaSalida", align: "center"},
                    {text: "Importe MLC", value: "importeMlc", align: "center"},
                    {text: "Importe MN", value: "importeMn", align: "center"},
                    {text: "Total", value: "total", align: "center"},
                    {text: "Acciones", value: "actions", align: "center"}
                ],
                loading:false,
                openDialogNew:false,
                isFormValid:true,
                material:{
                    fecha: "",
                    id: 0,
                    importeMlc: 0,
                    importeMn: 0,
                    noVentaSalida: '',
                    total: 0
                },

                classButtons:'',
                disabledButtons:false,
                rules:{
                    fecha:[
                        (fecha)=>!!fecha || "La fecha es requerida"
                    ],
                    importeMlc:[
                        (importeMlc)=>!!importeMlc|| "El importe es requerido"
                    ],
                    importeMN:[
                        (importeMN)=>!!importeMN||"El importe es requerido"
                    ],
                    noVentaSalida:[
                        (noVentaSalida)=>!!noVentaSalida||"El nombre es requerido"
                    ],
                    total:[
                        (total)=>!!total||"El total es requerido"
                    ]
                }
            }
        },
        methods:{
            deleteItem(item){
                const indice = this.materialesList.indexOf(item);
                this.materialesList.splice(indice,1);
            },
            addItem(){
                this.openDialogNew=true;
            },
            addItemToList(){
                if(this.$refs.formNew.validate()){
                    const materialToInsert = {
                        fecha: this.material.fecha,
                        id: this.material.id,
                        importeMlc: this.material.importeMlc,
                        importeMn: this.material.importeMn,
                        noVentaSalida: this.material.noVentaSalida,
                        total: this.material.total
                    }
                    this.materialesList.push(materialToInsert);
                    this.$refs.formNew.reset();
                    this.openDialogNew=false;
                }
            },
            setData(){
                this.disabledButtons=true;
                this.$emit("getData",this.materialesList)
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
            }
        }
    }
</script>

<style scoped>

</style>