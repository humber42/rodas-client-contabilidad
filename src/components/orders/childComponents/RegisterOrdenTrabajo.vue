<template>
    <v-container>
        <v-container class="mt-2">
            <h1 class="font-weight-light">Registrar nueva orden de trabajo</h1>
            <v-card class="mt-2">
                <v-stepper v-model="stepperModel">
                    <v-stepper-header>
                        <v-stepper-step :complete="stepperModel>1" step="1">
                            Datos Generales
                        </v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="stepperModel>2" step="2">
                            Materiales
                        </v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="stepperModel>3" step="3">
                            Reportes diario laboral
                        </v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="stepperModel>4" step="4">
                            Usuario
                        </v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="stepperModel>5" step="5">
                            Orden de facturación
                        </v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step step="6">
                            Previsualizar información
                        </v-stepper-step>
                    </v-stepper-header>
                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <v-card>
                                <v-container>
                                    <v-form ref="formDatosGenerales" @submit.prevent="nextFirstStep" lazy-validation
                                            v-model="isFirstFormValid">
                                        <v-row>
                                            <v-col cols="4">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox :items="fichasDeCostoList" label="Fichas de costo"
                                                                    item-text="id" item-value="id"
                                                                    v-model="datosGenerales.fichaCosto"
                                                                    :rules="rules.fichaCosto"></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Fecha de Entrega"
                                                                      type="date"
                                                                      v-model="datosGenerales.fechaEntrega"
                                                                      :rules="rules.fechaConfeccion"></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Número de contrato"
                                                                      type="number"
                                                                      v-model="datosGenerales.noContrato"
                                                                      :rules="rules.noContrato"></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Orden de trabajo"
                                                                      type="text"
                                                                      v-model="datosGenerales.ordenTrabajo"
                                                                      :rules="rules.ordenTrabajo"></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Fecha de confección"
                                                                      type="date"
                                                                      v-model="datosGenerales.fechaConfeccion"
                                                                      :rules="rules.fechaConfeccion"></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-textarea label="Observaciones"
                                                                    v-model="datosGenerales.observaciones" rows="1"
                                                                    counter maxlength="255"></v-textarea>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox :items="clientesList" label="Clientes"
                                                                    item-text="nombre" item-value="id"
                                                                    v-model="datosGenerales.cliente"
                                                                    :rules="rules.cliente"></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox :items="uebsList" label="UEB"
                                                                    item-text="nombreUeb" item-value="id"
                                                                    v-model="datosGenerales.ueb"
                                                                    :rules="rules.ueb"></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                        </v-row>
                                        <v-layout row class="ma-1">
                                            <v-flex class="text-left">
                                                <v-btn color="primary" @click="handleCancelar">
                                                    Cancelar
                                                </v-btn>
                                            </v-flex>
                                            <v-flex class="text-right">
                                                <v-btn color="primary" @click="nextFirstStep"
                                                       :disabled="!isFirstFormValid">
                                                    Siguiente
                                                </v-btn>
                                            </v-flex>
                                        </v-layout>
                                    </v-form>
                                </v-container>
                            </v-card>
                        </v-stepper-content>
                        <v-stepper-content step="2">
                            <v-card>
                                <v-container>
                                    <MaterialesComponent @getData="getData"></MaterialesComponent>
                                    <v-layout row class="ma-1">
                                        <v-flex class="text-left">
                                            <v-btn color="primary" @click="handleCancelar">Cancelar</v-btn>
                                        </v-flex>
                                        <v-flex class="text-right">
                                            <v-btn color="primary" :disabled="!(materiales.length>0)"
                                                   @click="nextSecondStep">Siguiente
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-stepper-content>
                        <v-stepper-content step="3">
                            <v-card>
                                <v-container>
                                    <ReporteDiarioLaboralComponent @getData="getData2"></ReporteDiarioLaboralComponent>
                                    <h3 class="mt-3 font-weight-light">Datos del reporte</h3>
                                    <v-form ref="formStep3" lazy-validation v-model="isThirdFormValid"
                                            @submit.prevent="nextThirdStep">
                                        <v-row>
                                            <v-col cols="4">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Nombre" :rules="rules.nombre"
                                                                      v-model="reportes.nombre"></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox :items="cargosList" label="Cargo"
                                                                    item-text="nombre" item-value="id"
                                                                    v-model="reportes.cargo"
                                                                    :rules="rules.cargo"></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Motivo" :rules="rules.motivo"
                                                                      v-model="reportes.motivo"></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                        </v-row>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-textarea label="Descripción" rows="1" v-model="reportes.descripcion"
                                                            counter maxlength="255"></v-textarea>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row class="ma-1">
                                            <v-flex class="text-left">
                                                <v-btn color="primary" @click="handleCancelar">Cancelar</v-btn>
                                            </v-flex>
                                            <v-flex class="text-right">
                                                <v-btn color="primary"
                                                       :disabled="!(reportesDiarios.length>0)||!isThirdFormValid"
                                                       @click="nextThirdStep">Siguiente
                                                </v-btn>
                                            </v-flex>
                                        </v-layout>
                                    </v-form>
                                </v-container>
                            </v-card>
                        </v-stepper-content>
                        <v-stepper-content step="4">
                            <v-card>
                                <v-container>
                                    <v-form lazy-validation ref="formStep4" v-model="isFourthFormValid">
                                        <v-row>
                                            <v-col cols="6">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field v-model="usuario.nombre" :rules="rules.nombre"
                                                                      label="Nombre"/>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field v-model="usuario.ci" :rules="rules.ci" counter maxlength="11"
                                                                      label="Carne de Identidad" type="number"/>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                    <v-layout row class="ma-1">
                                        <v-flex class="text-left">
                                            <v-btn color="primary" @click="handleCancelar">Cancelar</v-btn>
                                        </v-flex>
                                        <v-flex class="text-right">
                                            <v-btn color="primary"
                                                   :disabled="!isFourthFormValid"
                                                   @click="nextFourthStep">Siguiente
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-stepper-content>
                        <v-stepper-content step="5">
                            <v-card>
                                <v-container>
                                    <v-form lazy-validation ref="formStep5" v-model="isFifthFormValid">
                                        <v-row>
                                            <v-col cols="3">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Código" v-model="ordenFacturacion.codigo" :rules="rules.campoRequerido"/>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Precio MN" type="number" v-model="ordenFacturacion.precioMn" :rules="rules.campoRequerido"/>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Proveedor de servicio" v-model="ordenFacturacion.proveedorServicio" :rules="rules.campoRequerido"/>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Precio MLC" type="number" v-model="ordenFacturacion.precioMLC" :rules="rules.campoRequerido"/>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-combobox :items="unidadesMedidaList" label="Unidad de medida"
                                                                    item-text="nombre" item-value="id"
                                                                    v-model="ordenFacturacion.unidadMedida"
                                                                    :rules="rules.campoRequerido"></v-combobox>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Importe MN" type="number" v-model="ordenFacturacion.importeMn" :rules="rules.campoRequerido"/>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Cantidad" type="number" v-model="ordenFacturacion.cantidad" :rules="rules.campoRequerido"/>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class="ma-1">
                                                    <v-flex xs12>
                                                        <v-text-field label="Importe MLC" type="number" v-model="ordenFacturacion.importeMlc" :rules="rules.campoRequerido"/>
                                                    </v-flex>
                                                </v-layout>
                                            </v-col>
                                        </v-row>
                                        <v-layout row class="ma-1">
                                            <v-flex xs12>
                                                <v-textarea label="Descripción" rows="1" v-model="ordenFacturacion.descripcion" counter maxlength="255"></v-textarea>
                                            </v-flex>
                                        </v-layout>
                                    </v-form>
                                    <v-layout row class="ma-1">
                                        <v-flex class="text-left">
                                            <v-btn color="primary" @click="handleCancelar">Cancelar</v-btn>
                                        </v-flex>
                                        <v-flex class="text-right">
                                            <v-btn color="primary"
                                                   :disabled="!isFifthFormValid"
                                                   @click="nextFifthStep">Siguiente
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-stepper-content>
                        <v-stepper-content step="6">
                            <v-card>
                                <v-container>
                                    <h3 class="font-weight-light">Información</h3>
                                    <v-divider></v-divider>
                                    <v-spacer></v-spacer>
                                    <v-container>
                                        <v-row>
                                            <v-col>
                                                <v-card shaped>
                                                    <v-card-title>Ficha de costo</v-card-title>
                                                    <v-card-text v-if="datosGenerales.fichaCosto!==null">Actividad: {{datosGenerales.fichaCosto.actividad.nombre}}</v-card-text>
                                                    <v-card-text v-if="datosGenerales.fichaCosto!==null">Aprobada: {{datosGenerales.fichaCosto.aprobada?"Si":"No"}}</v-card-text>
                                                </v-card>
                                            </v-col>
                                            <v-col>
                                                <v-card shaped>
                                                    <v-card-title>Cliente</v-card-title>
                                                    <v-card-text v-if="datosGenerales.cliente!==null">Nombre: {{datosGenerales.cliente.nombre}}</v-card-text>
                                                    <v-card-text v-if="datosGenerales.cliente!==null">Descripción: {{datosGenerales.cliente.descripcion}}</v-card-text>
                                                </v-card>
                                            </v-col>
                                            <v-col>
                                                <v-card shaped>
                                                    <v-card-title>Unidad Empresarial de Base</v-card-title>
                                                    <v-card-text v-if="datosGenerales.ueb!==null">Nombre: {{datosGenerales.ueb.nombreUeb}}</v-card-text>
                                                    <v-card-text v-if="datosGenerales.ueb!==null">Código: {{datosGenerales.ueb.codigoUeb}}</v-card-text>
                                                    <v-card-text v-if="datosGenerales.ueb!==null">Descripción: {{datosGenerales.ueb.descripcion}}</v-card-text>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-card shaped>
                                                    <v-card-title>
                                                        Datos Generales
                                                    </v-card-title>
                                                    <v-card-text v-if="datosGenerales.ordenTrabajo.length>0">Orden de trabajo: {{datosGenerales.ordenTrabajo}}</v-card-text>
                                                    <v-card-text v-if="datosGenerales.fechaEntrega.length>0">Fecha de entrega: {{datosGenerales.fechaEntrega}}</v-card-text>
                                                    <v-card-text v-if="datosGenerales.fechaConfeccion.length>0">Fecha de confección: {{datosGenerales.fechaConfeccion}}</v-card-text>
                                                    <v-card-text v-if="datosGenerales.noContrato.length>0">Número de contrato: {{datosGenerales.noContrato}}</v-card-text>
                                                    <v-card-text v-if="datosGenerales.observaciones.length>0">Observaciones: {{datosGenerales.observaciones}}</v-card-text>
                                                </v-card>
                                            </v-col>
                                            <v-col>
                                                <v-card>
                                                    <v-card-title>Materiales y reportes</v-card-title>
                                                    <v-card-text v-if="materiales.length>0">Cantidad de materiales: {{materiales.length}}</v-card-text>
                                                    <v-card-text v-if="reportesDiarios.length>0">Cantidad de reportes: {{reportesDiarios.length}}</v-card-text>
                                                    <v-card-text v-if="reportes.nombre.length>0">Nombre: {{reportes.nombre}}</v-card-text>
                                                    <v-card-text v-if="reportes.cargo!==null">Cargo: {{reportes.cargo.nombre}}</v-card-text>
                                                    <v-card-text v-if="reportes.motivo.length>0">Motivo: {{reportes.motivo}}</v-card-text>
                                                </v-card>
                                            </v-col>
                                            <v-col>
                                                <v-card shaped>
                                                    <v-card-title>Usuario y orden de facturación</v-card-title>
                                                    <v-card-text v-if="usuario.nombre.length>0">Usuario: {{usuario.nombre}}</v-card-text>
                                                    <v-card-text v-if="usuario.ci.length>0">Carne de Indentidad: {{usuario.ci}}</v-card-text>
                                                    <v-divider></v-divider>
                                                    <v-card-text v-if="ordenFacturacion.codigo.length>0">Orden de Facturación</v-card-text>
                                                    <v-card-text v-if="ordenFacturacion.codigo.length>0">Código: {{ordenFacturacion.codigo}}</v-card-text>
                                                    <v-card-text v-if="ordenFacturacion.proveedorServicio.length>0">Proveedor de servicio: {{ordenFacturacion.proveedorServicio}}</v-card-text>
                                                    <v-card-text v-if="ordenFacturacion.unidadMedida!==null">Unidad de medida: {{ordenFacturacion.unidadMedida.nombre}}</v-card-text>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    <v-layout row class="ma-1">
                                        <v-flex class="text-left">
                                            <v-btn color="primary" @click="handleCancelar">Cancelar</v-btn>
                                        </v-flex>
                                        <v-flex class="text-right">
                                            <v-btn color="primary"
                                                   @click="handleSave" :disabled="loading" :loading="loading">
                                                <span slot="loader" class="custom-loader">
                                                    <v-icon>mdi-refresh</v-icon>
                                                </span>
                                                Guardar
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-card>
        </v-container>
    </v-container>
</template>

<script>
    import axios from "axios";
    import {
        URL_GET_ALL_CARGOS,
        URL_GET_ALL_CLIENTE,
        URL_GET_ALL_FICHA_COSTO,
        URL_GET_ALL_UEB,
        URL_GET_ALL_UNIDAD_MEDIDA,
        URL_SAVE_MATERIAL,
        URL_SAVE_ORDEN_FACTURACION,
        URL_SAVE_ORDEN_TRABAJO,
        URL_SAVE_REGISTRO
    } from "../../../constants/UrlResource";
    import MaterialesComponent from "./MaterialesComponent";
    import ReporteDiarioLaboralComponent from "./ReporteDiarioLaboralComponent";

    export default {
        name: "RegisterOrdenTrabajo",
        components: {ReporteDiarioLaboralComponent, MaterialesComponent},
        data() {
            return {
                stepperModel: 1,
                fichasDeCostoList: [],
                clientesList: [],
                uebsList: [],
                loading:false,
                cargosList: [],
                datosGenerales: {
                    fichaCosto: null,
                    ordenTrabajo: '',
                    cliente: null,
                    fechaEntrega: '',
                    fechaConfeccion: '',
                    ueb: null,
                    noContrato: '',
                    observaciones: '',
                },
                reportes: {
                    nombre: '',
                    cargo: null,
                    motivo: '',
                    descripcion: ''
                },
                materiales: [],
                reportesDiarios: [],
                rules: {
                    fichaCosto: [
                        (fichaCosto) => !!fichaCosto || "La ficha de costo es requerida"
                    ],
                    fechaConfeccion: [
                        (fechaConfeccion) => !!fechaConfeccion || "La fecha es requerida"
                    ],
                    noContrato: [
                        (noContrato) => !!noContrato || "El número de contrato es requerido"
                    ],
                    ordenTrabajo: [
                        (ordenTrabajo) => !!ordenTrabajo || "La orden de trabajo es requerida"
                    ],
                    cliente: [
                        (clientes) => !!clientes || "El cliente es requerido"
                    ],
                    ueb: [
                        (ueb) => !!ueb || "La UEB es requerida"
                    ],
                    cargo: [
                        (cargo) => !!cargo || "El cargo es requerido"
                    ],
                    nombre: [
                        (nombre) => !!nombre || "El nombre es requerido"
                    ],
                    motivo: [
                        (motivo) => !!motivo || "El motivo es requerido"
                    ],
                    ci:[
                        (ci)=>!!ci||"El carne de identidad es requerido",
                        (ci)=>ci.length===11||"Debe tener 11 numeros"
                    ],
                    campoRequerido:[
                        (campo)=>!!campo||"El campo es requerido"
                    ]
                },
                isFirstFormValid: true,
                isThirdFormValid: true,
                isFourthFormValid: true,
                isFifthFormValid: true,
                usuario: {
                    nombre: '',
                    ci: ''
                },
                ordenFacturacion:{
                    unidadMedida:null,
                    codigo:'',
                    proveedorServicio:'',
                    cantidad:0,
                    precioMn:0,
                    precioMLC:0,
                    importeMn:0,
                    importeMlc:0,
                    descripcion:''
                },
                unidadesMedidaList:[],
                idOrdenTrabajo:0
            }
        },
        methods: {
            getData(data) {
                console.log(data)
                this.materiales = data;
            },
            getData2(data) {
                console.log(data);
                this.reportesDiarios = data

            },
            nextFirstStep() {
                if (this.$refs.formDatosGenerales.validate()) {
                    this.stepperModel += 1;
                }
            },
            nextSecondStep() {
                if (this.materiales.length > 0) {
                    this.stepperModel += 1

                }
            },
            nextThirdStep() {
                if (this.$refs.formStep3.validate()) {
                    this.stepperModel += 1;
                }
            },
            nextFourthStep(){
                if (this.$refs.formStep4.validate()){
                    this.stepperModel+=1;
                }
            },
            nextFifthStep(){
                if(this.$refs.formStep5.validate()){
                    this.stepperModel+=1
                }
            },
            handleCancelar() {
                this.$router.back();
            },
            loadUebs() {
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
            loadFichaCosto() {
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_FICHA_COSTO, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Ficha Costo", data);
                    this.fichasDeCostoList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            loadCliente() {
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_CLIENTE, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Clientes", data);
                    this.clientesList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            loadCargos() {
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_CARGOS, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Cargos", data);
                    this.cargosList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            loadUnidadesMedidas(){
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_UNIDAD_MEDIDA, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    console.log("Unidades de medida", data);
                    this.unidadesMedidaList = data;
                }).catch(err => {
                    console.log(err);
                    if (err.response.status === 403) {
                        this.$router.push("/login")
                    }
                })
            },
            handleSave(){
                this.loading=true;
                const payloadOrdenTrabajo ={
                    cerrada: false,
                    descripcionServicio: this.reportes.descripcion,
                    fechaConfeccion: this.datosGenerales.fechaConfeccion,
                    fechaEntrega: this.datosGenerales.fechaEntrega,
                    id: 0,
                    idActividad: this.datosGenerales.fichaCosto.actividad.id,
                    idCargo: this.reportes.cargo.id,
                    idCliente: this.datosGenerales.cliente.id,
                    idFichaCosto: this.datosGenerales.fichaCosto.id,
                    idUeb: this.datosGenerales.ueb.id,
                    identidadUsuario: this.usuario.ci,
                    motivoServicio: this.reportes.motivo,
                    nombreAprobacion: this.reportes.nombre,
                    nombreConformidad: this.reportes.nombre,
                    numeroContrato: this.datosGenerales.noContrato,
                    observaciones: this.datosGenerales.observaciones,
                    ordenTrabajo: this.datosGenerales.ordenTrabajo,
                    vendedor: this.usuario.nombre
                } ;
                console.log("Payload orden trabajo",payloadOrdenTrabajo)
                const token = localStorage.getItem("token")
                axios.post(URL_SAVE_ORDEN_TRABAJO,payloadOrdenTrabajo,{
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data})=>{
                    console.log(data)
                    this.idOrdenTrabajo=data.id;
                    const payloadMaterials={
                        especialList: this.materiales,
                        ordenTrabajoId: this.idOrdenTrabajo
                    }
                    console.log("Payload Materials",payloadMaterials)
                    axios.post(URL_SAVE_MATERIAL,payloadMaterials,{
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(()=>{
                        const payloadReportes={
                            especialList: this.reportesDiarios,
                            ordenTrabajoId: this.idOrdenTrabajo
                        }
                        console.log("Payload Reportes", payloadReportes)
                        axios.post(URL_SAVE_REGISTRO,payloadReportes,{
                            headers: {
                                "Authorization": "Bearer " + token,
                                "cache-control": "no-cache",
                            }}).then(()=>{
                                const payloadOrdenFacturacion={
                                    cantidad: this.ordenFacturacion.cantidad,
                                    codigo: this.ordenFacturacion.codigo,
                                    descripcion: this.ordenFacturacion.descripcion,
                                    id: 0,
                                    idOrdenTrabajo: this.idOrdenTrabajo,
                                    idUnidadMedida: this.ordenFacturacion.unidadMedida.id,
                                    importeMlc: this.ordenFacturacion.importeMlc,
                                    importeMn: this.ordenFacturacion.importeMn,
                                    precioMlc: this.ordenFacturacion.precioMLC,
                                    precioMn: this.ordenFacturacion.precioMn,
                                    proveedorServicio: this.ordenFacturacion.proveedorServicio
                                }
                                console.log("Payload Orden Facturacion",payloadOrdenFacturacion)
                                axios.post(URL_SAVE_ORDEN_FACTURACION,payloadOrdenFacturacion,{
                                    headers: {
                                        "Authorization": "Bearer " + token,
                                        "cache-control": "no-cache",
                                    }
                                }).then(()=>{
                                    this.loading=false;
                                    this.$router.back();
                                }).catch(err=>{
                                    console.log(err)
                                    this.loading=false;
                                })
                        }).catch(err=>{
                            console.log(err)
                            this.loading=false;
                        })
                    }).catch(err=>{
                        console.log(err)
                        this.loading=false;
                    })
                }).catch(err=>{
                    console.log(err)
                    this.loading=false;
                })
            }
        },
        mounted() {
            this.loadUebs();
            this.loadCliente();
            this.loadFichaCosto();
            this.loadCargos();
            this.loadUnidadesMedidas();
        }
    }
</script>

<style scoped>

</style>