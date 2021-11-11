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
                        <v-card-title class="hidden-md-and-up">Lista de categorías de agrupación
                            {{tipoCategoriaSelected}}
                        </v-card-title>
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
                                    <v-speed-dial v-model="fab" :direction="direction" :open-on-hover="hover" :transition="transition">
                                        <v-btn color="primary" fab small class="ml-2"
                                               @click="openDialogRegisterDirectCategorie" v-resize="onResizes">
                                            CD

                                        </v-btn>
                                        <v-btn color="primary" fab small class="ml-2"
                                               @click="openDialogRegisterIndirectCategorie" v-resize="onResizes" dark>
                                            CI
                                        </v-btn>
                                        <template v-slot:activator>
                                            <v-btn class="ml-2" rounded elevation="3" height="38" width="38"
                                                    v-model="fab"
                                                    color="success"
                                                    dark
                                                    fab
                                            >
                                                <v-icon v-if="fab">
                                                    mdi-arrow-down
                                                </v-icon>
                                                <v-icon v-else>
                                                    mdi-plus
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                    </v-speed-dial>
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
                                    ¿Desea eliminar la Categoría de Agrupación {{categoriaToDelete.tipoCategoria}} con
                                    nombre {{categoriaToDelete.nombre}}?
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

                    <v-dialog v-model="openDialogNewCD" persistent max-width="520">
                        <v-card>
                            <v-card-title>Nueva Categoría de Agrupación Directa</v-card-title>
                            <v-divider/>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                        @submit.prevent="handleNewCategoriaAgrupacionDirecta">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Nombre" v-model="categAgrupacion.nombre"
                                                          :rules="rules.nombreRules" counter>
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-textarea auto-grow label="Descripción"
                                                        v-model="categAgrupacion.descripcion"
                                                        :rules="rules.descripcionRules" counter
                                                        maxlength="100"></v-textarea>
                                        </v-flex>
                                    </v-layout>

                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-checkbox v-model="categAgrupacion.mostrarFichaCosto"
                                                        label="Mostrar en ficha de costo"></v-checkbox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1 mt-3">
                                        <v-flex xs12>
                                            <v-slider v-model="categAgrupacion.orden"
                                                      label="Orden"
                                                      hint="Orden de la categoría de agrupación"
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
                                            <v-btn class="ml-1" color="error" @click="handleCancelNewCD">
                                                Cancelar
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-container>
                        </v-card>

                    </v-dialog>

                    <v-dialog v-model="openDialogNewCI" persistent max-width="520">
                        <v-card>
                            <v-card-title>Nueva Categoría de Agrupación Indirecta</v-card-title>
                            <v-divider/>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                        @submit.prevent="handleNewCategoriaAgrupacionIndirecta">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Nombre" v-model="categAgrupacion.nombre"
                                                          :rules="rules.nombreRules" counter>
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-textarea auto-grow label="Descripción"
                                                        v-model="categAgrupacion.descripcion"
                                                        :rules="rules.descripcionRules" counter
                                                        maxlength="100"></v-textarea>
                                        </v-flex>
                                    </v-layout>

                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-checkbox v-model="categAgrupacion.mostrarFichaCosto"
                                                        label="Mostrar en ficha de costo"></v-checkbox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1 mt-3">
                                        <v-flex xs12>
                                            <v-slider v-model="categAgrupacion.orden"
                                                      label="Orden"
                                                      hint="Orden de la categoría de agrupación"
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
                                            <v-btn class="ml-1" color="error" @click="handleCancelNewCI">
                                                Cancelar
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-container>
                        </v-card>

                    </v-dialog>

                    <v-dialog v-model="openDialogUpdate" persistent max-width="630">
                        <v-card>
                            <v-card-title v-if="categoriaToUpdate!==null || categoriaToUpdate.id > 0">
                                Editar Categoría de Agrupación {{categoriaToUpdate.tipoCategoria}} con nombre {{categoriaToUpdate.nombre}}</v-card-title>
                            <v-divider/>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                        @submit.prevent="handleUpdateCategoria">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Nombre" v-model="categoriaToUpdate.nombre"
                                                          :rules="rules.nombreRules" counter>
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-textarea auto-grow label="Descripción"
                                                        v-model="categoriaToUpdate.descripcion"
                                                        :rules="rules.descripcionRules" counter
                                                        maxlength="100"></v-textarea>
                                        </v-flex>
                                    </v-layout>

                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-checkbox v-model="categoriaToUpdate.mostrarFichaCosto"
                                                        label="Mostrar en ficha de costo"></v-checkbox>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1 mt-3">
                                        <v-flex xs12>
                                            <v-slider v-model="categoriaToUpdate.orden"
                                                      label="Orden"
                                                      hint="Orden de la categoría de agrupación"
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
                                            <v-btn class="ml-1" color="error" @click="handleCancelUpdate">
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
        URL_DELETE_CATEGORIE,
        URL_GET_ALL_CATEGORIES,
        URL_GET_ALL_DIRECT_CATEGORIES,
        URL_GET_ALL_INDIRECT_CATEGORIES, URL_UPDATE_CATEGORIE, URL_SAVE_CATEGORIE
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
                    {text: "Tipo", value: "tipoCategoria", align: 'center'},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                search: '',
                fab: false,
                hover: true,
                direction: 'top',
                transition: 'scale-transition',
                categAgrupacion: {
                    id: 0,
                    nombre: '',
                    descripcion: '',
                    orden: 1,
                    mostrarFichaCosto: false,
                    tipoCategoria: ''
                },
                openDialogDelete: false,
                openDialogUpdate: false,
                openDialogNewCD: false,
                openDialogNewCI: false,
                isFormValid: true,
                categoriaToDelete: {},
                categoriaToUpdate: {},
                rules: {
                    nombreRules: [
                        (nombre) => !!nombre || "El nombre es requerido"
                    ],
                    descripcionRules: [
                        (descripcion) => !!descripcion || "La descripción es requerida"
                    ]
                }
            }
        },
        methods: {
            loadDataTable() {
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_CATEGORIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
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
            loadDataDirectCategories() {
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_DIRECT_CATEGORIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
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
            loadDataIndirectCategories() {
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_INDIRECT_CATEGORIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    this.categorias = data;
                }).catch(err => {
                    console.log(err);
                })
            },
            onResizes() {
                const windowsSize = {x: window.innerWidth, y: window.innerHeight}
                if (windowsSize.x <= 768) {
                    this.classButtons = true;
                    this.direction='bottom';
                } else {
                    this.classButtons = false;
                    this.direction='top'
                }
            },
            changeDataInTable() {
                if (this.tipoCategoriaSelected === 'Todas') {
                    this.loadDataTable();
                } else if (this.tipoCategoriaSelected === 'Indirecta') {
                    this.loadDataIndirectCategories();
                } else if (this.tipoCategoriaSelected === 'Directa') {
                    this.loadDataDirectCategories();
                }
            },
            dialogOpenDelete(item) {
                console.log(item);
                this.categoriaToDelete = item;
                this.openDialogDelete = true;
            },
            dialogOpenUpdate(item) {
                console.log(item);
                this.categoriaToUpdate = item;
                this.openDialogUpdate = true;
            },
            openDialogRegisterDirectCategorie() {
                this.categAgrupacion.tipoCategoria = 'Directa';
                this.openDialogNewCD = true;
            },
            openDialogRegisterIndirectCategorie(){
                this.categAgrupacion.tipoCategoria = 'Indirecta';
                this.openDialogNewCI = true;
            },
            handleDeleteCategoria() {
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete(URL_DELETE_CATEGORIE + this.categoriaToDelete.id, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(() => {
                    this.loading = false;
                    this.handleCancelDelete();
                    this.loadDataTable();
                }).catch((err) => {
                    this.loading = false;
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleCancelDelete() {
                this.openDialogDelete = false;
            },
            handleCancelNewCD() {
                this.$refs.formNew.reset();
                this.openDialogNewCD = false;
            },
            handleCancelNewCI(){
                this.$refs.formNew.reset();
                this.openDialogNewCI = false;
            },
            handleCancelUpdate() {
                this.openDialogUpdate = false;
            },
            handleNewCategoriaAgrupacionDirecta() {
                if(this.$refs.formNew.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    axios.post(URL_SAVE_CATEGORIE, this.categAgrupacion, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data);
                        this.loadDataTable();
                        this.handleCancelNewCD();
                    }).catch(err => {
                        this.loading = false;
                        console.log(err)
                    })
                }
            },
            handleNewCategoriaAgrupacionIndirecta() {
                if(this.$refs.formNew.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    axios.post(URL_SAVE_CATEGORIE, this.categAgrupacion, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data);
                        this.loadDataTable();
                        this.handleCancelNewCI();
                    }).catch(err => {
                        this.loading = false;
                        console.log(err)
                    })
                }
            },
            handleUpdateCategoria(){
                if(this.$refs.formEdit.validate()){
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    this.categoriaToUpdate.id = this.categAgrupacion.id;
                    axios.put(URL_UPDATE_CATEGORIE, this.categoriaToUpdate, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        console.log(data)
                        this.loading = false;
                        this.loadDataTable();
                        this.handleCancelUpdate();
                    }).catch(err => {
                        this.loading = false;
                        console.log(err)
                    })
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