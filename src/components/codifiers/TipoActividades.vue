<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                    <v-data-table v-else :headers="headers" :items="tiposActividades" :items-per-page="5"
                    class="elevation-1" :search="search"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Lista de tipos de actividades</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="mdi-table-search" label="Buscar"
                                              single-line hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn color="orange" dark>Refrescar</v-btn>
                                <v-btn color="primary" class="ml-2">Nuevo</v-btn>
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
                                <span>Editar tipo de actividad</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{on,attrs}">
                                    <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="dialogOpenDelete(item)"
                                            color="red">
                                        mdi-delete
                                    </v-icon>
                                </template>
                                <span>Eliminar tipo de actividad</span>
                            </v-tooltip>
                        </template>

                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import axios from "axios"
    import {URL_GET_ALL_TIPO_ACTIVIDAD} from "../../constants/UrlResource";
    export default {
        name: "TipoActividades",
        data(){
            return{
                tableLoading:false,
                headers:[
                    {text: "Codigo", value: "codigo", align: 'center'},
                    {text: "Nombre", value: "nombre", align: 'center'},
                    {text: "Descripción", value: "descripcion", align: 'center'},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                tiposActividades:[],
                search:'',
            }
        },
        methods:{
            editItem(item){
                console.log(item)
            },
            dialogOpenDelete(item){
                console.log(item)
            },
            loadDataTable(){
                this.tableLoading=true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_TIPO_ACTIVIDAD,{
                    headers:{
                        "Authorization": "Bearer "+token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    this.tableLoading=false;
                    console.log("Tipos de actividades",data);
                    this.tiposActividades=data;
                }).catch(err=>{
                    console.log(err);
                    if(err.response.status===403){
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