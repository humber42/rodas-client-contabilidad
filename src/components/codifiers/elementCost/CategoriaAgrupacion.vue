<template>
    <v-container>
        <v-container class="mt-2">
            <v-layout row wrap>
                <v-flex>
                    <v-card outlined elevation="20">
                        <v-col cols="4">
                            <v-flex class="text-center">
                                <v-combobox :items="dataToCombo" hide-selected label="Tipo de Categoría"
                                            v-model="tipoCategoriaSelected" @change="changeDataInTable"/>
                            </v-flex>
                        </v-col>
                        <v-divider/>
                        <v-card-title class="hidden-md-and-up">Lista de categorías de agrupación {{tipoCategoriaSelected}}</v-card-title>
                        <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                        <v-data-table v-else :headers="headers" :items="categorias" :items-per-page="5"
                                      class="elevation-1" :search="search"
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title class="hidden-sm-and-down">
                                        Lista de categorías de agrupación
                                    </v-toolbar-title>
                                    <v-spacer/>
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar"
                                                  single-line hide-details></v-text-field>
                                    <v-spacer/>
                                    <v-btn color="orange" :fab="classButtons" :small="classButtons"
                                           @click="loadDataTable"
                                           dark v-resize="onResizes">
                                        <v-icon>mdi-refresh</v-icon>
                                        <span v-if="!classButtons">
                                            Refrescar
                                        </span>
                                    </v-btn>
                                    <v-btn color="primary" :fab="classButtons" :small="classButtons" class="ml-2"
                                           @click="dialogOpenNew"
                                           v-resize="onResizes">
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
                                                    v-model="item.mostrarFichaCosto"/>
                                    </v-flex>
                                </v-layout>
                            </template>
                            <template v-slot:item.tipoCateg="{item}">
                                <v-layout row wrap class="align-content-center">
                                    <h4 v-if="item.tipo==='Indirecta'" class="font-weight-light ml-5">Indirecta</h4>
                                    <h4 v-else class="font-weight-light ml-6">Directa</h4>
                                </v-layout>
                            </template>
                            <template v-slot:item.actions="{item}">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                @click="dialogOpenUpdate(item)"
                                                color="orange">
                                            mdi-pen
                                        </v-icon>
                                    </template>
                                    <span>Editar categoría de agrupación</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                @click="dialogOpenDelete(item)"
                                                color="red">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar categoría de agrupación</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>

                    <v-dialog v-model="openDialogDelete" persistent max-width="520">
                        <v-card>
                            <v-card-title v-if="categoriaToDelete!==null || categoriaToDelete.id > 0">
                                Eliminar categoría de agrupación
                            </v-card-title>
                            <v-divider/>
                            <v-container>
                                <h3 v-if="categoriaToDelete!==null" class="font-weight-light">
                                    ¿Desea eliminar la Categoría de Agrupación con nombre {{categoriaToDelete.nombre}}?
                                </h3>
                                <v-layout row class="ma-1 text-center">
                                    <v-flex xs12>
                                        <v-btn color="success" class="mr-1" @click="handleDeleteCategoria"
                                               :loading="loading"
                                               :disabled="loading">
                                    <span slot="loader" class="custom-loader">
                                        <v-icon>mdi-refresh</v-icon>
                                    </span>
                                            Sí
                                        </v-btn>
                                        <v-btn color="error" class="ml-1" @click="handleCancelDelete">
                                            No
                                        </v-btn>
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
        URL_DELETE_DIRECT_CATEGORIE, URL_DELETE_INDIRECT_CATEGORIE,
        URL_GET_ALL_DIRECT_CATEGORIES,
        URL_GET_ALL_INDIRECT_CATEGORIES
    } from "../../../constants/UrlResource";

    export default {
        name: "CategoriaAgrupacion",
        data: () => {
            return {
                tableLoading: false,
                loading: false,
                classButtons: '',
                categorias: [],
                dataToCombo: ["Todas", "Directa", "Indirecta"],
                tipoCategoriaSelected: '',
                headers: [
                    {text: "Nombre", value: "nombre", align: 'center'},
                    {text: "Descripción", value: "descripcion", align: 'center'},
                    {text: "Mostrar FC", value: "mostrar", align: 'center'},
                    {text: "Orden", value: "orden", align: 'center'},
                    {text: "Tipo", value: "tipoCateg", align: 'center'},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                search: '',
                categAgrupacion: {
                    id: 0,
                    nombre: '',
                    descripcion: '',
                    orden: 1,
                    mostrarFichaCosto: false,
                    tipo: 'Directa'
                },
                openDialogDelete: false,
                openDialogUpdate: false,
                openDgNew:false,
                categoriaToDelete: {},
                categoriaToUpdate: {}
            }
        },
        methods: {
            loadDataTable() {
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_DIRECT_CATEGORIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    let i = 0;
                    while(i < data.length){
                        data[i++].tipo = 'Directa';
                    }
                    console.log("Categoria de agrupacion", data);
                    this.categorias = data;
                    this.loadDataIndirectCategories();
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            loadDataDirectCategories(){
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_DIRECT_CATEGORIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    let i = 0;
                    while(i < data.length){
                        data[i++].tipo = 'Directa';
                    }
                    console.log("Categoria de agrupacion", data);
                    this.categorias = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            loadDataIndirectCategories(){
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_INDIRECT_CATEGORIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    let i = 0;
                    while (i < data.length){
                        data[i].tipo = 'Indirecta';
                        console.log("categoria agrupacion indirecta", data[i]);
                        this.categorias.push(data[i]);
                        i++;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            onResizes() {
                const windowsSize = {x: window.innerWidth, y: window.innerHeight}
                if (windowsSize.x <= 768) {
                    this.classButtons = true;
                } else {
                    this.classButtons = false;
                }
            },
            changeDataInTable(){
                this.categorias = [];
                if(this.tipoCategoriaSelected === 'Todas'){
                    this.loadDataTable();
                } else if(this.tipoCategoriaSelected === 'Indirecta'){
                    this.loadDataIndirectCategories();
                } else if(this.tipoCategoriaSelected === 'Directa'){
                    this.loadDataDirectCategories();
                }
            },
            dialogOpenDelete(item){
                console.log(item);
                this.openDialogDelete = true;
            },
            dialogOpenUpdate(item){
                console.log(item);
                this.openDialogUpdate = true;
            },
            dialogOpenNew(){
                this.openDgNew = true;
            },
            handleDeleteCategoria(){
                this.loading = true;
                const token = localStorage.getItem("token");
                if(this.categoriaToDelete.tipo === 'Indirecta'){
                    axios.delete(URL_DELETE_INDIRECT_CATEGORIE, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(() => {
                        this.loading = false;
                        this.loadDataTable();
                    }).catch((err) => {
                        this.loading = false;
                        console.log(err);
                        if (err.response.status === 403) {
                            this.$store.commit('setUser', null)
                            this.$router.push("/login")
                        }
                    })
                } else{
                    axios.delete(URL_DELETE_DIRECT_CATEGORIE, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(() => {
                        this.loading = false;
                        this.loadDataTable();
                    }).catch((err) => {
                        this.loading = false;
                        console.log(err);
                        if (err.response.status === 403) {
                            this.$store.commit('setUser', null)
                            this.$router.push("/login")
                        }
                    })
                }
            },
            handleCancelDelete(){
                this.openDialogDelete = false;
            }
        },
        mounted() {
            this.loadDataTable();
        }
    }
</script>

<style scoped>

</style>