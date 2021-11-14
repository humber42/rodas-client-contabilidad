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
                                    <v-speed-dial v-model="fab" :direction="direction" :open-on-hover="hover"
                                                  :transition="transition">
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
                                                    mdi-arrow-up
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
                                                @click="assignElemento(item)" color="blue">
                                            mdi-clipboard-check
                                        </v-icon>
                                    </template>
                                    <span>Establecer elemento de gasto</span>
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
                                Editar Categoría de Agrupación {{categoriaToUpdate.tipoCategoria}} con nombre
                                {{categoriaToUpdate.nombre}}
                            </v-card-title>
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

                    <v-dialog v-model="openDialogCategElementoGasto" persistent max-width="580"
                              v-if="categAgrupacionElementoGasto.categoriaAgrupacion!==null && isDirecta">
                        <v-card>
                            <v-card-title v-if="categAgrupacionElementoGasto.categoriaAgrupacion!==null && isDirecta">
                                Asignar elementos de gasto a la Categoría de Agrupación Directa
                            </v-card-title>
                            <v-divider/>
                            <v-container>
                                <h3 class="font-weight-light"> Elementos de gasto ya asignados</h3>
                                <v-list>
                                    <v-virtual-scroll width="580" height="150" item-height="50"
                                                      :items="elementosDeLaCategoria">
                                        <template v-slot:default="{item}">
                                            <v-list-item :key="item.id">
                                                <v-list-item-action>
                                                    <v-btn color="red" @click="handleDeleteAsign(item)" outlined>
                                                        {{item.elemento}}
                                                        <v-icon>mdi-delete</v-icon>
                                                    </v-btn>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </template>
                                    </v-virtual-scroll>
                                </v-list>
                                <v-divider/>
                                <v-form lazy-validation v-model="isFormValid" ref="formAsig"
                                        @submit.prevent="handleAsignElementoGasto">
                                    <h3 class="font-weight-light mt-4"> Elemento de gasto a asignar</h3>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="elementoList" hide-selected
                                                        label="Seleccione el elemento de gasto" item-text="elemento"
                                                        item-value="id" :search-input="searchElemento"
                                                        :rules="rules.elementoRules"
                                                        v-model="categAgrupacionElementoGasto.elementoGasto"></v-combobox>
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
                                            <v-btn class="ml-1" color="error" @click="handleCancelarAssignDialog">
                                                Cancelar
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-container>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="openDialogCategSubelementoGasto" persistent max-width="750"
                              v-if="categAgrupacionIndSubelementoGasto.categoriaIndirecta!==null && !isDirecta">
                        <v-card>
                            <v-card-title v-if="categAgrupacionIndSubelementoGasto.categoriaIndirecta!==null">
                                Asignar elementos y subelementos de gasto a la Categoría de Agrupación Indirecta
                            </v-card-title>
                            <v-divider/>
                            <v-container>
                                <v-row>
                                    <v-col cols="6">
                                        <v-container>
                                            <h3 class="font-weight-light"> Elementos de gasto ya asignados</h3>
                                            <v-list>
                                                <v-virtual-scroll width="375" height="150" item-height="50"
                                                                  :items="elementosDeLaCategoria">
                                                    <template v-slot:default="{item}">
                                                        <v-list-item :key="item.id">
                                                            <v-list-item-action>
                                                                <v-btn color="red"
                                                                       @click="handleDeleteElementoSubelemento(item)"
                                                                       outlined>{{item.elemento}}
                                                                    <v-icon>mdi-delete</v-icon>
                                                                </v-btn>
                                                            </v-list-item-action>
                                                        </v-list-item>
                                                    </template>
                                                </v-virtual-scroll>
                                            </v-list>
                                        </v-container>
                                    </v-col>

                                    <v-col cols="6">
                                        <v-container>
                                            <h3 class="font-weight-light"> Subelementos de gasto ya asignados</h3>
                                            <v-list>
                                                <v-virtual-scroll width="375" height="150" item-height="50"
                                                                  :items="subelementosDeLaCategoria">
                                                    <template v-slot:default="{item}">
                                                        <v-list-item :key="item.id">
                                                            <v-list-item-action>
                                                                <v-btn color="red"
                                                                       @click="handleDeleteSubelemento(item)"
                                                                       outlined>{{item.subelemento}}
                                                                    <v-icon>mdi-delete</v-icon>
                                                                </v-btn>
                                                            </v-list-item-action>
                                                        </v-list-item>
                                                    </template>
                                                </v-virtual-scroll>
                                            </v-list>
                                        </v-container>
                                    </v-col>
                                </v-row>
                                <v-divider/>
                                <v-form lazy-validation v-model="isFormValid" ref="formAsigSub"
                                        @submit.prevent="handleAsignElementoAndSubelemento">
                                    <h3 class="font-weight-light mt-4"> Elemento de gasto a asignar</h3>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="elementoList" hide-selected
                                                        label="Seleccione el elemento de gasto" item-text="elemento"
                                                        item-value="id" :search-input="searchElemento"
                                                        :rules="rules.elementoRules"
                                                        v-model="categAgrupacionIndSubelementoGasto.elementoGasto"></v-combobox>
                                        </v-flex>
                                    </v-layout>
                                    <h3 class="font-weight-light mt-4"> Subelemento de gasto a asignar</h3>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="subelementoList" hide-selected
                                                        label="Seleccione el subelemento de gasto"
                                                        item-text="subelemento"
                                                        item-value="id" :search-input="searchSubelemento"
                                                        :rules="rules.subelementoRules"
                                                        v-model="categAgrupacionIndSubelementoGasto.subelementoGasto"></v-combobox>
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
                                            <v-btn class="ml-1" color="error"
                                                   @click="handleCancelarAsignarSubelementos">
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
        URL_GET_ALL_INDIRECT_CATEGORIES,
        URL_UPDATE_CATEGORIE,
        URL_SAVE_CATEGORIE,
        URL_GET_ALL_ELEMENTOS_GASTO,
        URL_SAVE_CATEGORIE_COSTELEMENT,
        URL_DELETE_CATEGORIE_ELEMENTO,
        URL_GET_ALL_SUBELEMENTOS_GASTO,
        URL_SAVE_INDIRECT_CATEGORIE_COSTELEMENT,
        URL_SAVE_INDIRECT_CATEGORIE_COSTSuBELEMENT,
        URL_DELETE_INDIRECT_CATEGORIE_ELEMENTO,
        URL_DELETE_INDIRECT_CATEGORIE_SUBELEMENTO
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
                categAgrupacionElementoGasto: {
                    id: 0,
                    idCategoriaAgrupacion: 0,
                    idElementoGasto: 0,
                    categoriaAgrupacion: null,
                    elementoGasto: null,
                },
                categAgrupacionIndSubelementoGasto: {
                    id: 0,
                    idCategoriaAgrupacionIndirecta: 0,
                    idSubelementoGasto: 0,
                    orden: 0,
                    categoriaIndirecta: null,
                    elementoGasto: null,
                    subelementoGasto: null
                },
                rules: {
                    nombreRules: [
                        (nombre) => !!nombre || "El nombre es requerido"
                    ],
                    descripcionRules: [
                        (descripcion) => !!descripcion || "La descripción es requerida"
                    ],
                    elementoRules: [
                        (elementoRules) => !!elementoRules || "Elemento de gasto requerido"
                    ],
                    subelementoRules: [
                        (subelementoRules) => !!subelementoRules || "Subelemento de gasto requerido"
                    ]
                },
                elementoList: [],
                subelementoList: [],
                elementosDeLaCategoria: [],
                subelementosDeLaCategoria: [],
                searchElemento: '',
                searchSubelemento: '',
                openDialogCategElementoGasto: false,
                openDialogCategSubelementoGasto: false,
                isDirecta: true
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
                    this.direction = 'bottom';
                } else {
                    this.classButtons = false;
                    this.direction = 'top'
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
                this.categoriaToUpdate.id = item.id;
                this.categoriaToUpdate.descripcion = item.descripcion;
                this.categoriaToUpdate.nombre = item.nombre;
                this.categoriaToUpdate.orden = item.orden;
                this.categoriaToUpdate.tipoCategoria = item.tipoCategoria;
                this.categoriaToUpdate.mostrarFichaCosto = item.mostrarFichaCosto;
                this.openDialogUpdate = true;
            },
            openDialogRegisterDirectCategorie() {
                this.categAgrupacion.tipoCategoria = 'Directa';
                this.openDialogNewCD = true;
            },
            openDialogRegisterIndirectCategorie() {
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
            handleCancelNewCI() {
                this.$refs.formNew.reset();
                this.openDialogNewCI = false;
            },
            handleCancelUpdate() {
                this.openDialogUpdate = false;
            },
            handleNewCategoriaAgrupacionDirecta() {
                if (this.$refs.formNew.validate()) {
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
                if (this.$refs.formNew.validate()) {
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
            handleUpdateCategoria() {
                if (this.$refs.formEdit.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    console.log("Categoria a MODIFICAR", this.categoriaToUpdate);
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
            },
            assignElemento(item) {
                if (item.tipoCategoria === 'Directa') {
                    this.isDirecta = true;
                    console.log(item);
                    this.loadElementosGasto();
                    this.openDialogCategElementoGasto = true;
                    this.categAgrupacionElementoGasto.categoriaAgrupacion = item;
                    this.elementosDeLaCategoria = item.elementosList;
                } else {
                    this.isDirecta = false;
                    console.log(item);
                    this.loadElementosGasto();
                    this.loadSubelementosGasto();
                    this.openDialogCategSubelementoGasto = true;
                    this.categAgrupacionIndSubelementoGasto.categoriaIndirecta = item;
                    this.elementosDeLaCategoria = item.elementosList;
                    this.subelementosDeLaCategoria = item.subelementosList;
                }

            },
            loadElementosGasto() {
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_ELEMENTOS_GASTO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    if (this.isDirecta) {
                        console.log("Elementos CD", data);
                        for (let i = 0; i < this.categAgrupacionElementoGasto.categoriaAgrupacion.elementosList.length; i++) {
                            for (let j = 0; j < data.length; j++) {
                                if (data[j].id === this.categAgrupacionElementoGasto.categoriaAgrupacion.elementosList[i].id)
                                    data.splice(j, 1);
                            }
                        }
                        this.elementoList = data;
                    } else {
                        console.log("Elementos CI", data);
                        for (let i = 0; i < this.categAgrupacionIndSubelementoGasto.categoriaIndirecta.elementosList.length; i++) {
                            for (let j = 0; j < data.length; j++) {
                                if (data[j].id === this.categAgrupacionIndSubelementoGasto.categoriaIndirecta.elementosList[i].id)
                                    data.splice(j, 1);
                            }
                        }
                        this.elementoList = data;
                    }
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            loadSubelementosGasto() {
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_SUBELEMENTOS_GASTO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Subelementos", data);
                    for (let i = 0; i < this.categAgrupacionIndSubelementoGasto.categoriaIndirecta.subelementosList.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if (data[j].id === this.categAgrupacionIndSubelementoGasto.categoriaIndirecta.subelementosList[i].id)
                                data.splice(j, 1);
                        }
                    }
                    this.subelementoList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleCancelarAssignDialog() {
                this.$refs.formAsig.reset();
                this.openDialogCategElementoGasto = false;
                this.elementoList = [];
            },
            handleDeleteAsign(item) {
                const token = localStorage.getItem("token");
                console.log("Elemento a eliminar", item)
                axios.delete(URL_DELETE_CATEGORIE_ELEMENTO, {
                    params: {
                        idCategoria: this.categAgrupacionElementoGasto.categoriaAgrupacion.id,
                        idElemento: item.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(() => {
                    const index = this.elementosDeLaCategoria.indexOf(item);
                    this.elementosDeLaCategoria.splice(index, 1);
                    this.loadElementosGasto();
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleAsignElementoGasto() {
                if (this.$refs.formAsig.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token")
                    const payload = {
                        id: 0,
                        idCategoriaAgrupacion: this.categAgrupacionElementoGasto.categoriaAgrupacion.id,
                        idElementoGasto: this.categAgrupacionElementoGasto.elementoGasto.id
                    }
                    console.log("Payload", payload)
                    axios.post(URL_SAVE_CATEGORIE_COSTELEMENT, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data)
                        this.loadDataTable();
                        this.handleCancelarAssignDialog();
                    }).catch(err => {
                        this.loading = false;
                        console.log(err)
                    })
                }
            },
            handleCancelarAsignarSubelementos() {
                this.$refs.formAsigSub.reset();
                this.openDialogCategSubelementoGasto = false;
                this.elementoList = [];
                this.subelementoList = [];
            },
            handleAsignElementoAndSubelemento() {
                if (this.$refs.formAsigSub.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token")
                    const payload = {
                        id: 0,
                        idCategoriaAgrupacionIndirecta: this.categAgrupacionIndSubelementoGasto.categoriaIndirecta.id,
                        idElementoGasto: this.categAgrupacionIndSubelementoGasto.elementoGasto.id,
                        orden: 0
                    }
                    console.log("Payload Elemento", payload)
                    axios.post(URL_SAVE_INDIRECT_CATEGORIE_COSTELEMENT, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        console.log(data)
                        this.handleAsignarSubelemento();
                        this.loading = false;
                        this.loadDataTable();
                        this.handleCancelarAsignarSubelementos();
                    }).catch(err => {
                        this.loading = false;
                        console.log(err)
                    })
                }
            },
            handleAsignarSubelemento() {
                const token = localStorage.getItem("token")
                const payload = {
                    id: 0,
                    idCategoriaAgrupacionIndirecta: this.categAgrupacionIndSubelementoGasto.categoriaIndirecta.id,
                    idSubelementoGasto: this.categAgrupacionIndSubelementoGasto.subelementoGasto.id,
                    orden: 0
                }
                console.log("Payload Subelemento", payload)
                axios.post(URL_SAVE_INDIRECT_CATEGORIE_COSTSuBELEMENT, payload, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log(data)
                }).catch(err => console.log(err))
            },
            handleDeleteElementoSubelemento(item) {
                const token = localStorage.getItem("token");
                console.log("Elemento de la CI a eliminar", item)
                axios.delete(URL_DELETE_INDIRECT_CATEGORIE_ELEMENTO, {
                    params: {
                        idCategoria: this.categAgrupacionIndSubelementoGasto.categoriaIndirecta.id,
                        idElemento: item.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(() => {
                    const index = this.elementosDeLaCategoria.indexOf(item);
                    this.elementosDeLaCategoria.splice(index, 1);
                    this.loadElementosGasto();
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleDeleteSubelemento(item){
                const token = localStorage.getItem("token");
                console.log("Subelemento de la CI a eliminar", item)
                axios.delete(URL_DELETE_INDIRECT_CATEGORIE_SUBELEMENTO, {
                    params: {
                        idCategoria: this.categAgrupacionIndSubelementoGasto.categoriaIndirecta.id,
                        idSubelemento: item.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(() => {
                    const index = this.subelementosDeLaCategoria.indexOf(item);
                    this.subelementosDeLaCategoria.splice(index, 1);
                    this.loadSubelementosGasto();
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