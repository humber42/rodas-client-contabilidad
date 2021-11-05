<template>
    <v-container>
        <v-container class="mt-2">
            <v-layout row wrap>
                <v-flex>
                    <v-card outlined elevation="20">
                        <v-card-title class="hidden-md-and-up">Lista de Unidades Empresariales de Base</v-card-title>
                        <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                        <v-data-table v-else :headers="headers" :items="uebsList" :items-per-page="5"
                                      class="elevation-1" :search="search"
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title class="hidden-sm-and-down">Lista de Unidades Empresariales de Base
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
                            <template v-slot:item.mostrar="{item}">
                                <v-layout row wrap class="align-content-center">
                                    <v-flex xs12>
                                        <v-checkbox class="shrink ml-lg-12 ml-md-7 ml-sm-6" readonly
                                                    v-model="item.mostrar"/>
                                    </v-flex>
                                </v-layout>
                            </template>
                            <template v-slot:item.actions="{item}">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2" @click="editItem(item)"
                                                color="orange">
                                            mdi-pen
                                        </v-icon>
                                    </template>
                                    <span>Editar UEB</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                @click="assignEtapa(item)" color="blue">
                                            mdi-clipboard-check
                                        </v-icon>
                                    </template>
                                    <span>Establecer etapa</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                @click="dialogOpenDelete(item)"
                                                color="red">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar UEB</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>
                    <v-dialog v-model="openDialogNew" transition="fade" persistent title="Nuevo UEB"
                              max-width="520">
                        <v-card>
                            <v-card-title>Nuevo Unidad Empresarial de Base</v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formNew"
                                        @submit.prevent="handleNewUeb">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Nombre" v-model="ueb.nombreUeb"
                                                          :rules="rules.nombreRules" counter maxlength="100"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Código" v-model="ueb.codigoUeb"
                                                          :rules="rules.codigoRules" counter maxlength="100"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>

                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-textarea auto-grow label="Descripción"
                                                        v-model="ueb.descripcion"
                                                        :rules="rules.descripcionRules" counter rows="2"
                                                        maxlength="255"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field auto-grow label="Coeficiente Estimado MLC"
                                                          v-model="ueb.coeficienteEstMlc" type="number"
                                                          counter
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field auto-grow label="Coeficiente Estimado MN"
                                                          v-model="ueb.coeficienteEstMn" type="number"
                                                          counter
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field auto-grow label="Porciento de pago por resultado"
                                                          v-model="ueb.pagoResultadoPercent" type="number"
                                                          counter
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
                                            <v-btn class="ml-1" color="error" @click="handleCancelarNewDialog">
                                                Cancelar
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-container>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="openDialogEtapas" persistent max-width="520" v-if="uebEtapa.ueb!==null">
                        <v-card>
                            <v-card-title v-if="uebEtapa.ueb!==null">Asignar etapa a la
                                UEB
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <h3 class="font-weight-light">Etapas ya asignadas</h3>
                                <v-list>
                                    <v-virtual-scroll width="520" height="150" item-height="50" :items="etapasDeLaUEB">
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
                                        @submit.prevent="handleAsignEtapa">
                                    <h3 class="font-weight-light mt-4">Etapa a asignar</h3>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-combobox :items="etapasList" :rules="rules.etapsRules" hide-selected
                                                        label="Seleccione la etapa" item-text="nombre" item-value="id"
                                                        :search-input="searchEtapa"
                                                        v-model="uebEtapa.etapa"></v-combobox>
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
                                            <v-btn class="ml-1" color="error" @click="handleCancelarAsignDialog">
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
                            <v-card-title v-if="uebToDelete!==null||uebToDelete.id>0">Eliminar
                                UEB
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <h3 class="font-weight-light">¿Desea eliminar la UEB con código
                                    {{uebToDelete.codigoUeb}}?</h3>
                                <v-layout row class="ma-1 text-center">
                                    <v-flex xs12>
                                        <v-btn color="success" class="mr-1" @click="handleDeleteUebs"
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
                            <v-card-title v-if="uebToEdit!==null||uebToEdit.id>0">Editar UEB con código
                                {{uebToEdit.codigoUeb}}
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-form lazy-validation v-model="isFormValid" ref="formEdit"
                                        @submit.prevent="handleEditUebs">
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Nombre" v-model="uebToEdit.nombreUeb"
                                                          :rules="rules.nombreRules" counter maxlength="100"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field label="Código" v-model="uebToEdit.codigoUeb"
                                                          :rules="rules.codigoRules" counter maxlength="100"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>

                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-textarea auto-grow label="Descripción"
                                                        v-model="uebToEdit.descripcion"
                                                        :rules="rules.descripcionRules" counter rows="2"
                                                        maxlength="255"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field auto-grow label="Coeficiente Estimado MLC"
                                                          v-model="uebToEdit.coeficienteEstMlc" type="number"
                                                          counter
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field auto-grow label="Coeficiente Estimado MN"
                                                          v-model="uebToEdit.coeficienteEstMn" type="number"
                                                          counter
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row class="ma-1">
                                        <v-flex xs12>
                                            <v-text-field auto-grow label="Porciento de pago por resultado"
                                                          v-model="uebToEdit.pagoResultadoPercent" type="number"
                                                          counter
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
        URL_DELETE_UEB, URL_DELETE_UEB_ETAPA,
        URL_GET_ALL_ETAPAS,
        URL_GET_ALL_UEB,
        URL_SAVE_UEB, URL_SAVE_UEB_ETAPA,
        URL_UPDATE_UEB
    } from "../../../constants/UrlResource";

    export default {
        name: "UnidadesEmpresarialesBase",
        data() {
            return {
                tableLoading: false,
                loading: false,
                classButtons: '',
                uebsList: [],
                headers: [
                    {text: "Nombre", value: "nombreUeb", align: 'center'},
                    {text: "Código", value: "codigoUeb", align: 'center'},
                    {text: "Descripción", value: "descripcion", align: 'center'},
                    {text: "Coeficiente MLC", value: "coeficienteEstMlc", align: 'center'},
                    {text: "Coeficiente MN", value: "coeficienteEstMn", align: 'center'},
                    {text: "Pago por resultado", value: "pagoResultadoPercent", align: 'center'},
                    {text: "Acciones", value: "actions", align: 'center'}
                ],
                search: '',
                openDialogNew: false,
                openDeleteDialog: false,
                openDialogEdit: false,
                isFormValid: true,
                ueb: {
                    codigoUeb: "",
                    coeficienteEstMlc: 0,
                    coeficienteEstMn: 0,
                    descripcion: "",
                    id: 0,
                    nombreUeb: "",
                    pagoResultadoPercent: 0
                },
                openDialogEtapas: false,
                uebToDelete: {},
                uebToEdit: {},
                uebEtapa: {
                    id: 0,
                    idUeb: 0,
                    idEtapa: 0,
                    ueb: null,
                    etapa: null,
                },
                searchEtapa: '',
                rules: {
                    nombreRules: [
                        (nombre) => !!nombre || "El nombre es requerido"
                    ],
                    descripcionRules: [
                        (descripcion) => !!descripcion || "La descripción es requerida"
                    ],
                    codigoRules: [
                        (codigoRules) => !!codigoRules || "El código es requerido"
                    ],
                    etapsRules:[
                        (etapsRules)=>!!etapsRules||"La etapa es requerida"
                    ]
                },
                etapasList: [],
                etapasDeLaUEB:[]
            }
        },
        methods: {
            editItem(item) {
                this.uebToEdit.id = item.id;
                this.uebToEdit.codigoUeb = item.codigoUeb;
                this.uebToEdit.coeficienteEstMlc = item.coeficienteEstMlc;
                this.uebToEdit.coeficienteEstMn = item.coeficienteEstMn;
                this.uebToEdit.descripcion = item.descripcion;
                this.uebToEdit.nombreUeb = item.nombreUeb;
                this.uebToEdit.pagoResultadoPercent = item.pagoResultadoPercent;
                this.openDialogEdit = true;
                console.log(item);
            },
            dialogOpenDelete(item) {
                this.uebToDelete = item;
                this.openDeleteDialog = true;
            },
            assignEtapa(item) {
                console.log(item);
                this.loadEtapas();
                this.openDialogEtapas = true
                this.uebEtapa.ueb = item;
                this.etapasDeLaUEB=item.etapaList;
            },
            openDialogoNew() {
                this.openDialogNew = true;
            },
            handleAsignEtapa() {
                if (this.$refs.formEdit.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token")
                    const payload = {
                        id: 0,
                        idEtapa: this.uebEtapa.etapa.id,
                        idUeb: this.uebEtapa.ueb.id
                    }
                    console.log("Esto es lo que voy a salvar", payload)
                    axios.post(URL_SAVE_UEB_ETAPA, payload, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data)
                        this.loadDataTable();
                        this.handleCancelarAsignDialog();
                    }).catch(err => {
                        this.loading = false;
                        console.log(err)
                    })
                }
            },
            handleCancelarAsignDialog() {
                this.$refs.formEdit.reset();
                this.openDialogEtapas = false;
                this.etapasList = [];
            },
            loadDataTable() {
                this.tableLoading = true;
                const token = localStorage.getItem("token");
                axios.get(URL_GET_ALL_UEB, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
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
            handleNewUeb() {
                if (this.$refs.formNew.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token")
                    axios.post(URL_SAVE_UEB, this.ueb, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.loading = false;
                        console.log(data)
                        this.uebsList.push(data);
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
            handleDeleteUebs() {
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete(URL_DELETE_UEB + this.uebToDelete.id, {
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
            handleDeleteAsign(item){
                const token =localStorage.getItem('token');
                console.log("Etapa a eliminar",item)
                axios.delete(URL_DELETE_UEB_ETAPA,{
                    params:{
                        idUeb:this.uebEtapa.ueb.id,
                        idEtapa:item.id
                    },
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(()=>{
                    const index = this.etapasDeLaUEB.indexOf(item);
                    this.etapasDeLaUEB.splice(index,1);
                    this.loadEtapas();
                }).catch(err=>{
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleCancelarDeleteDialog() {
                this.openDeleteDialog = false;
                this.uebToDelete = {};
            },
            handleEditUebs() {
                if (this.$refs.formEdit.validate()) {
                    this.loading = true;
                    const token = localStorage.getItem("token");
                    axios.put(URL_UPDATE_UEB, this.uebToEdit, {
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
            handleDeleteEtapa(item) {
                console.log(item);
            },
            loadEtapas() {
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_ETAPAS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Etapas", data);
                    for (let i = 0; i < this.uebEtapa.ueb.etapaList.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if (data[j].id === this.uebEtapa.ueb.etapaList[i].id) {
                                data.splice(j, 1);
                            }
                        }
                    }
                    this.etapasList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
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
            this.loadDataTable();
        }
    }
</script>

<style scoped>

</style>