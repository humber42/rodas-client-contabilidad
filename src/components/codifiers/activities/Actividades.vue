<template>
    <v-container>
    <v-container class="mt-2">
        <v-layout row wrap>
            <v-flex>
                <v-card outlined elevation="20">
                    <v-card-title class="hidden-md-and-up">Lista de actividades</v-card-title>
                    <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                    <v-data-table v-else :headers="headers" :items="actividades" :items-per-page="5"
                                  class="elevation-1" :search="search"
                    >
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title class="hidden-sm-and-down">Lista de actividades</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar"
                                              single-line hide-details></v-text-field>
                                <v-spacer></v-spacer>
                                <v-btn color="orange" :fab="classButtons" :small="classButtons" @click="loadDataTable"
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
                <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nueva actividad" max-width="520">
                    <v-card>
                        <v-card-title>Nueva actividad</v-card-title>
                        <v-divider></v-divider>
                        <v-container>
                            <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                    @submit.prevent="handleNewActivity">
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field label="Nombre" v-model="actividad.nombre"
                                                      :rules="rules.nombreRules" counter maxlength="100"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field label="Código" v-model="actividad.codigo"
                                                      :rules="rules.codigoRules" counter maxlength="27"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-combobox :items="unidadesMedida" label="Unidades de Medida"
                                                    item-text="nombre" item-value="id"
                                                    v-model="actividad.unidadMedida"
                                                    :rules="rules.unidadesMedidaRules"></v-combobox>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-combobox :items="tiposActividades" :rules="rules.tipoActividadRules"
                                                    label="Tipos de actividad" item-text="nombre" item-value="id"
                                                    v-model="actividad.tipoActividad"></v-combobox>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-textarea auto-grow label="Descripción" v-model="actividad.descripcion"
                                                    :rules="rules.descripcionRules" counter
                                                    maxlength="255"></v-textarea>
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
                        <v-card-title v-if="actividadToDelete!==null||actividadToDelete.id>0">Eliminar actividad
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-container>
                            <h3 class="font-weight-light">¿Desea eliminar la activadad con código
                                {{actividadToDelete.codigo}}?</h3>
                            <v-layout row class="ma-1 text-center">
                                <v-flex xs12>
                                    <v-btn color="success" class="mr-1" @click="handleDeleteActivity" :loading="loading"
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
                <v-dialog v-model="openDialogEdit" transition="fade" persistent max-width="520">
                    <v-card>
                        <v-card-title v-if="actividadToEdit!==null||actividadToEdit.id>0">Editar actividad con código
                            {{actividadToEdit.codigo}}
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-container>
                            <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                    @submit.prevent="handleEditActivity">
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field label="Nombre" v-model="actividadToEdit.nombre"
                                                      :rules="rules.nombreRules" counter maxlength="100"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-text-field label="Código" v-model="actividadToEdit.codigo"
                                                      :rules="rules.codigoRules" counter maxlength="27"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-combobox :items="unidadesMedida" label="Unidades de Medida" hide-selected
                                                    item-text="nombre" item-value="id"
                                                    v-model="actividadToEdit.unidadMedida"
                                                    :rules="rules.unidadesMedidaRules"></v-combobox>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-combobox :items="tiposActividades" :rules="rules.tipoActividadRules" hide-selected
                                                    label="Tipos de actividad" item-text="nombre" item-value="id"
                                                    v-model="actividadToEdit.tipoActividad"></v-combobox>
                                    </v-flex>
                                </v-layout>
                                <v-layout row class="ma-1">
                                    <v-flex xs12>
                                        <v-textarea auto-grow label="Descripción" v-model="actividadToEdit.descripcion"
                                                    :rules="rules.descripcionRules" counter
                                                    maxlength="255"></v-textarea>
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
        URL_DELETE_ACTIVITY, URL_EDIT_ACTIVITY,
        URL_GET_ALL_ACTIVITIES,
        URL_GET_ALL_TIPO_ACTIVIDAD,
        URL_GET_ALL_UNIDAD_MEDIDA, URL_SAVE_ACTIVITY,
    } from "../../../constants/UrlResource";

    export default {
        name: "Actividades",
        data() {
            return {
                tableLoading: false,
                loading: false,
                classButtons: '',
                actividades: [],
                headers: [
                    {text: "Código", value: "codigo", align: "center"},
                    {text: "Nombre", value: "nombre", align: 'center'},
                    {text: "Descripción", value: "descripcion", align: 'center'},
                    {text: "Tipo de actividad", value: "tipoActividad.nombre", align: 'center'},
                    {text: "Unidad de medida", value: "unidadMedida.nombre", align: 'center'},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                search: '',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                actividad: {
                    codigo: '',
                    descripcion: '',
                    id: 0,
                    idTipoActividad: '',
                    idUnidadMedida: '',
                    nombre: '',
                    ordenTrabajoList: [],
                    planProduccionList: [],
                    tipoActividad: null,
                    unidadMedida: null,
                },
                actividadToDelete: {},
                actividadToEdit: {},
                rules: {
                    nombreRules: [
                        (nombre) => !!nombre || "El nombre es requerido"
                    ],
                    codigoRules: [
                        (codigo) => !!codigo || "El código es requerido",
                    ],
                    descripcionRules: [
                        (descripcion) => !!descripcion || "La descripción es requerida"
                    ],
                    unidadesMedidaRules: [
                        (unidadMedida) => !!unidadMedida || "La unidad de medida es requerida"
                    ],
                    tipoActividadRules: [
                        (tipoActividad) => !!tipoActividad || "El tipo de actividad es requerido"
                    ]
                },
                unidadesMedida: [],
                tiposActividades: []
            }
        },
        methods: {
            editItem(item) {
                this.loadUnidadesMedida();
                this.loadTiposActividad()
                this.actividadToEdit.codigo = item.codigo;
                this.actividadToEdit.descripcion = item.descripcion;
                this.actividadToEdit.id = item.id;
                this.actividadToEdit.idTipoActividad = item.idTipoActividad;
                this.actividadToEdit.idUnidadMedida = item.idUnidadMedida;
                this.actividadToEdit.nombre = item.nombre;
                this.actividadToEdit.tipoActividad = item.tipoActividad;
                this.actividadToEdit.unidadMedida = item.unidadMedida;
                this.openDialogEdit = true;
            },
            dialogOpenDelete(item) {
                this.actividadToDelete = item;
                this.openDeleteDialog = true;
                console.log(item)
            },
            openDialogoNew() {
                this.openDialogNew = true;
                this.loadUnidadesMedida();
                this.loadTiposActividad()
            },
            loadDataTable() {
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_ACTIVITIES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Actividades", data);
                    this.actividades = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            handleNewActivity() {
                if (this.$refs.formNew.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token")
                    const payload = {
                        "codigo": this.actividad.codigo,
                        "descripcion": this.actividad.descripcion,
                        "id": 0,
                        "idTipoActividad": this.actividad.tipoActividad.id,
                        "idUnidadMedida": this.actividad.unidadMedida.id,
                        "nombre": this.actividad.nombre
                    }
                    console.log(payload)
                    axios.post(URL_SAVE_ACTIVITY, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data)
                        this.actividades.push(data);
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
            handleDeleteActivity() {
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete(URL_DELETE_ACTIVITY + this.actividadToDelete.id, {
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
                this.actividadToDelete = {};
            },
            loadUnidadesMedida() {
                const token = localStorage.getItem("token");
                axios.get(URL_GET_ALL_UNIDAD_MEDIDA, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.unidadesMedida = data;
                }).catch(err => console.log(err))
            },
            loadTiposActividad() {
                const token = localStorage.getItem("token");
                axios.get(URL_GET_ALL_TIPO_ACTIVIDAD, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tiposActividades = data;
                }).catch(err => console.log(err))
            },
            handleEditActivity() {
                if (this.$refs.formEdit.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    this.actividadToEdit.idUnidadMedida = this.actividadToEdit.unidadMedida.id;
                    this.actividadToEdit.idTipoActividad = this.actividadToEdit.tipoActividad.id;
                    axios.put(URL_EDIT_ACTIVITY, this.actividadToEdit, {
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
            onResizes() {
                const windowsSize = {x: window.innerWidth, y: window.innerHeight}
                if (windowsSize.x <= 768) {
                    this.classButtons = true;
                } else {
                    this.classButtons = false;
                }
            }
        },
        mounted() {
            this.loadDataTable()
        }
    }
</script>

<style scoped>

</style>