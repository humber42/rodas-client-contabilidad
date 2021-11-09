/*eslint-disable*/
<template>
    <v-container>
        <v-container class="mt-2">
            <v-layout row wrap>
                <v-flex>
                    <v-card outlined elevation="20">
                        <v-card-title class="hidden-md-and-up">Lista de coeficientes</v-card-title>
                        <v-skeleton-loader v-if="tableLoading" class="mx-auto" type="table"/>
                        <v-data-table v-else :headers="headers" :items="coeficientesList" :items-per-page="5"
                                      class="elevation-1" :search="search"
                        >
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title class="hidden-sm-and-down">Lista de coeficientes
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
                                           @click="openDialogNew" v-resize="onResizes">
                                        <v-icon>mdi-plus</v-icon>
                                        <span v-if="!classButtons">
                                         Nuevo
                                    </span></v-btn>
                                </v-toolbar>
                            </template>
                            <template v-slot:item.actions="{item}">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                @click="viewItem(item)"
                                                color="red">
                                            mdi-card-bulleted
                                        </v-icon>
                                    </template>
                                    <span>Visualizar coeficiente</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-icon v-bind="attrs" v-on="on" class="mr-2"
                                                @click="dialogDeleteOpen(item)"
                                                color="red">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar coeficiente</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card>
                    <v-dialog v-model="openDialogRegister" width="1000" persistent>
                        <v-card>
                            <v-card-title>Crear coeficientes de gastos</v-card-title>
                            <v-container>
                                <v-stepper v-model="stepperStep" vertical>

                                    <v-stepper-step :complete="stepperStep>1" step="1">
                                        Bancarios
                                    </v-stepper-step>
                                    <v-stepper-content step="1">
                                        <v-card>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">Moneda
                                                                Total</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteBancario.coeficienteGastoTotalMt"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteBancario.coeficienteGastoDeprecMt"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteBancario.coeficienteGastoMantenimientoYRepMt"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">CUC</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteBancario.coeficienteGastoTotalMlc"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteBancario.coeficienteGastoDeprecMlc"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteBancario.coeficienteGastoMantenimientoYRepMlc"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">Moneda
                                                                Nacional</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteBancario.coeficienteGastoTotalMn"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteBancario.coeficienteGastoDeprecMn"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteBancario.coeficienteGastoMantenimientoYRepMn"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mt-3">
                                                    <v-layout row class="ma-1 mt-2">
                                                        <v-flex class="text-right">
                                                            <v-btn @click="stepperStep++" color="primary">Siguiente
                                                            </v-btn>
                                                            <v-btn class="ml-1 mr-2" @click="handleCancel"
                                                                   color="error">
                                                                Cancelar
                                                            </v-btn>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-row>
                                            </v-container>
                                        </v-card>
                                    </v-stepper-content>
                                    <v-stepper-step :complete="stepperStep>2" step="2">
                                        Distribución y Ventas
                                    </v-stepper-step>

                                    <v-stepper-content step="2">
                                        <v-card>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">Moneda
                                                                Total</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteGDYVenta.coeficienteGastoTotalMt"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGDYVenta.coeficienteGastoDeprecMt"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGDYVenta.coeficienteGastoMantenimientoYRepMt"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">CUC</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteGDYVenta.coeficienteGastoTotalMlc"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGDYVenta.coeficienteGastoDeprecMlc"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGDYVenta.coeficienteGastoMantenimientoYRepMlc"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">Moneda
                                                                Nacional</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteGDYVenta.coeficienteGastoTotalMn"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGDYVenta.coeficienteGastoDeprecMn"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGDYVenta.coeficienteGastoMantenimientoYRepMn"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mt-3">
                                                    <v-layout row class="ma-1 mt-2">
                                                        <v-flex class="text-left">
                                                            <v-btn @click="stepperStep--" color="primary">Atrás</v-btn>
                                                        </v-flex>
                                                        <v-flex class="text-right">
                                                            <v-btn @click="stepperStep++" color="primary">Siguiente
                                                            </v-btn>
                                                            <v-btn class="ml-1 mr-2" @click="handleCancel"
                                                                   color="error">
                                                                Cancelar
                                                            </v-btn>
                                                        </v-flex>

                                                    </v-layout>

                                                </v-row>
                                            </v-container>
                                        </v-card>
                                    </v-stepper-content>

                                    <v-stepper-step :complete="stepperStep>3" step="3">
                                        Generales de Administración
                                    </v-stepper-step>

                                    <v-stepper-content step="3">
                                        <v-card>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">Moneda
                                                                Total</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteGGAdmin.coeficienteGastoTotalMt"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGGAdmin.coeficienteGastoDeprecMt"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGGAdmin.coeficienteGastoMantenimientoYRepMt"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">CUC</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteGGAdmin.coeficienteGastoTotalMlc"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGGAdmin.coeficienteGastoDeprecMlc"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGGAdmin.coeficienteGastoMantenimientoYRepMlc"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">Moneda
                                                                Nacional</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteGGAdmin.coeficienteGastoTotalMn"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGGAdmin.coeficienteGastoDeprecMn"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGGAdmin.coeficienteGastoMantenimientoYRepMn"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mt-3">
                                                    <v-layout row class="ma-1 mt-2">
                                                        <v-flex class="text-left">
                                                            <v-btn @click="stepperStep--" color="primary">Atrás</v-btn>
                                                        </v-flex>
                                                        <v-flex class="text-right">
                                                            <v-btn @click="stepperStep++" color="primary">Siguiente
                                                            </v-btn>
                                                            <v-btn class="ml-1 mr-2" @click="handleCancel"
                                                                   color="error">
                                                                Cancelar
                                                            </v-btn>
                                                        </v-flex>

                                                    </v-layout>

                                                </v-row>
                                            </v-container>
                                        </v-card>
                                    </v-stepper-content>

                                    <v-stepper-step :complete="stepperStep>4" step="4">
                                        Indirectos de Producción
                                    </v-stepper-step>

                                    <v-stepper-content step="4">
                                        <v-card>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">Moneda
                                                                Total</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteGIProd.coeficienteGastoTotalMt"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGIProd.coeficienteGastoDeprecMt"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGIProd.coeficienteGastoMantenimientoYRepMt"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">CUC</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteGIProd.coeficienteGastoTotalMlc"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGIProd.coeficienteGastoDeprecMlc"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGIProd.coeficienteGastoMantenimientoYRepMlc"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-card>
                                                            <h3 class="text-center font-weight-light pt-2">Moneda
                                                                Nacional</h3>
                                                            <v-layout row class="ma-2">
                                                                <v-flex xs12>
                                                                    <v-text-field
                                                                            v-model="coeficienteGIProd.coeficienteGastoTotalMn"
                                                                            label="Totales" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGIProd.coeficienteGastoDeprecMn"
                                                                            label="Depreciación" type="number"
                                                                    ></v-text-field>
                                                                    <v-text-field
                                                                            v-model="coeficienteGIProd.coeficienteGastoMantenimientoYRepMn"
                                                                            label="Otros Gastos" type="number"
                                                                    ></v-text-field>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-card>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mt-3">
                                                    <v-layout row class="ma-1 mt-2">
                                                        <v-flex class="text-left">
                                                            <v-btn @click="stepperStep--" color="primary">Atrás</v-btn>
                                                        </v-flex>
                                                        <v-flex class="text-right">
                                                            <v-btn @click="stepperStep++" color="primary">Siguiente
                                                            </v-btn>
                                                            <v-btn class="ml-1 mr-2" @click="handleCancel"
                                                                   color="error">
                                                                Cancelar
                                                            </v-btn>
                                                        </v-flex>

                                                    </v-layout>

                                                </v-row>
                                            </v-container>
                                        </v-card>
                                    </v-stepper-content>

                                    <v-stepper-step step="5">
                                        Previsualizar coeficiente
                                    </v-stepper-step>

                                    <v-stepper-content step="5">
                                        <v-card>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="6">
                                                        <v-card shaped>
                                                            <v-container>
                                                                <v-card-title>Gastos Bancarios
                                                                </v-card-title>
                                                                <v-row>
                                                                    <v-col cols="4">
                                                                        <v-list>
                                                                            <v-list-item-title>Moneda total
                                                                            </v-list-item-title>
                                                                            <v-list-item-subtitle>Totales:
                                                                                {{coeficienteBancario.coeficienteGastoTotalMt}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Depreciación:
                                                                                {{coeficienteBancario.coeficienteGastoDeprecMt}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Otros gastos:
                                                                                {{coeficienteBancario.coeficienteGastoMantenimientoYRepMt}}
                                                                            </v-list-item-subtitle>

                                                                        </v-list>
                                                                    </v-col>
                                                                    <v-col cols="4">
                                                                        <v-list>

                                                                            <v-list-item-title>CUC</v-list-item-title>
                                                                            <v-list-item-subtitle>Totales:
                                                                                {{coeficienteBancario.coeficienteGastoTotalMlc}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Depreciación:
                                                                                {{coeficienteBancario.coeficienteGastoDeprecMlc}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Otros gastos:
                                                                                {{coeficienteBancario.coeficienteGastoMantenimientoYRepMlc}}
                                                                            </v-list-item-subtitle>

                                                                        </v-list>
                                                                    </v-col>
                                                                    <v-col cols="4">
                                                                        <v-list-item-title>CUP</v-list-item-title>
                                                                        <v-list-item-subtitle>Totales:
                                                                            {{coeficienteBancario.coeficienteGastoTotalMn}}
                                                                        </v-list-item-subtitle>
                                                                        <v-list-item-subtitle>Depreciación:
                                                                            {{coeficienteBancario.coeficienteGastoDeprecMn}}
                                                                        </v-list-item-subtitle>
                                                                        <v-list-item-subtitle>Otros gastos:
                                                                            {{coeficienteBancario.coeficienteGastoMantenimientoYRepMn}}
                                                                        </v-list-item-subtitle>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-container>
                                                        </v-card>
                                                    </v-col>

                                                    <v-col cols="6">
                                                        <v-card shaped>
                                                            <v-container>
                                                                <v-card-title>Gastos de Distribución y Ventas
                                                                </v-card-title>
                                                                <v-row>
                                                                    <v-col cols="4">
                                                                        <v-list>

                                                                            <v-list-item-title>Moneda total
                                                                            </v-list-item-title>
                                                                            <v-list-item-subtitle>Totales:
                                                                                {{coeficienteGDYVenta.coeficienteGastoTotalMt}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Depreciación:
                                                                                {{coeficienteGDYVenta.coeficienteGastoDeprecMt}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Otros gastos:
                                                                                {{coeficienteGDYVenta.coeficienteGastoMantenimientoYRepMt}}
                                                                            </v-list-item-subtitle>

                                                                        </v-list>
                                                                    </v-col>
                                                                    <v-col cols="4">
                                                                        <v-list>

                                                                            <v-list-item-title>CUC</v-list-item-title>
                                                                            <v-list-item-subtitle>Totales:
                                                                                {{coeficienteGDYVenta.coeficienteGastoTotalMlc}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Depreciación:
                                                                                {{coeficienteGDYVenta.coeficienteGastoDeprecMlc}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Otros gastos:
                                                                                {{coeficienteGDYVenta.coeficienteGastoMantenimientoYRepMlc}}
                                                                            </v-list-item-subtitle>

                                                                        </v-list>
                                                                    </v-col>
                                                                    <v-col cols="4">
                                                                        <v-list-item-title>CUP</v-list-item-title>
                                                                        <v-list-item-subtitle>Totales:
                                                                            {{coeficienteGDYVenta.coeficienteGastoTotalMn}}
                                                                        </v-list-item-subtitle>
                                                                        <v-list-item-subtitle>Depreciación:
                                                                            {{coeficienteGDYVenta.coeficienteGastoDeprecMn}}
                                                                        </v-list-item-subtitle>
                                                                        <v-list-item-subtitle>Otros gastos:
                                                                            {{coeficienteGDYVenta.coeficienteGastoMantenimientoYRepMn}}
                                                                        </v-list-item-subtitle>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-container>
                                                        </v-card>
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-card shaped>
                                                            <v-container>
                                                                <v-card-title>Gastos Generales de Administración
                                                                </v-card-title>
                                                                <v-row>
                                                                    <v-col cols="4">
                                                                        <v-list>

                                                                            <v-list-item-title>Moneda total
                                                                            </v-list-item-title>
                                                                            <v-list-item-subtitle>Totales:
                                                                                {{coeficienteGGAdmin.coeficienteGastoTotalMt}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Depreciación:
                                                                                {{coeficienteGGAdmin.coeficienteGastoDeprecMt}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Otros gastos:
                                                                                {{coeficienteGGAdmin.coeficienteGastoMantenimientoYRepMt}}
                                                                            </v-list-item-subtitle>

                                                                        </v-list>
                                                                    </v-col>
                                                                    <v-col cols="4">
                                                                        <v-list>

                                                                            <v-list-item-title>CUC</v-list-item-title>
                                                                            <v-list-item-subtitle>Totales:
                                                                                {{coeficienteGGAdmin.coeficienteGastoTotalMlc}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Depreciación:
                                                                                {{coeficienteGGAdmin.coeficienteGastoDeprecMlc}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Otros gastos:
                                                                                {{coeficienteGGAdmin.coeficienteGastoMantenimientoYRepMlc}}
                                                                            </v-list-item-subtitle>

                                                                        </v-list>
                                                                    </v-col>
                                                                    <v-col cols="4">
                                                                        <v-list-item-title>CUP</v-list-item-title>
                                                                        <v-list-item-subtitle>Totales:
                                                                            {{coeficienteGGAdmin.coeficienteGastoTotalMn}}
                                                                        </v-list-item-subtitle>
                                                                        <v-list-item-subtitle>Depreciación:
                                                                            {{coeficienteGGAdmin.coeficienteGastoDeprecMn}}
                                                                        </v-list-item-subtitle>
                                                                        <v-list-item-subtitle>Otros gastos:
                                                                            {{coeficienteGGAdmin.coeficienteGastoMantenimientoYRepMn}}
                                                                        </v-list-item-subtitle>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-container>
                                                        </v-card>
                                                    </v-col>

                                                    <v-col cols="6">
                                                        <v-card shaped>
                                                            <v-container>
                                                                <v-card-title>Gastos Indirectos de Producción
                                                                </v-card-title>
                                                                <v-row>
                                                                    <v-col cols="4">
                                                                        <v-list>
                                                                            <v-list-item-title>Moneda total
                                                                            </v-list-item-title>
                                                                            <v-list-item-subtitle>Totales:
                                                                                {{coeficienteGIProd.coeficienteGastoTotalMt}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Depreciación:
                                                                                {{coeficienteGIProd.coeficienteGastoDeprecMt}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Otros gastos:
                                                                                {{coeficienteGIProd.coeficienteGastoMantenimientoYRepMt}}
                                                                            </v-list-item-subtitle>

                                                                        </v-list>
                                                                    </v-col>
                                                                    <v-col cols="4">
                                                                        <v-list>

                                                                            <v-list-item-title>CUC</v-list-item-title>
                                                                            <v-list-item-subtitle>Totales:
                                                                                {{coeficienteGIProd.coeficienteGastoTotalMlc}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Depreciación:
                                                                                {{coeficienteGIProd.coeficienteGastoDeprecMlc}}
                                                                            </v-list-item-subtitle>
                                                                            <v-list-item-subtitle>Otros gastos:
                                                                                {{coeficienteGIProd.coeficienteGastoMantenimientoYRepMlc}}
                                                                            </v-list-item-subtitle>

                                                                        </v-list>
                                                                    </v-col>
                                                                    <v-col cols="4">
                                                                        <v-list-item-title>CUP</v-list-item-title>
                                                                        <v-list-item-subtitle>Totales:
                                                                            {{coeficienteGIProd.coeficienteGastoTotalMn}}
                                                                        </v-list-item-subtitle>
                                                                        <v-list-item-subtitle>Depreciación:
                                                                            {{coeficienteGIProd.coeficienteGastoDeprecMn}}
                                                                        </v-list-item-subtitle>
                                                                        <v-list-item-subtitle>Otros gastos:
                                                                            {{coeficienteGIProd.coeficienteGastoMantenimientoYRepMn}}
                                                                        </v-list-item-subtitle>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-container>
                                                        </v-card>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mt-3">
                                                    <v-layout row class="ma-1 mt-2">
                                                        <v-flex class="text-left">
                                                            <v-btn @click="stepperStep--" color="primary">Atrás</v-btn>
                                                        </v-flex>
                                                        <v-flex class="text-right">
                                                            <v-btn @click="handleFinish" color="primary"
                                                                   :disabled="loading" :loading="loading">
                                                                <span slot="loader" class="custom-loader">
                                                                    <v-icon>mdi-refresh</v-icon>
                                                                </span>
                                                                Finalizar
                                                            </v-btn>
                                                            <v-btn class="ml-1 mr-2" @click="handleCancel" color="error"
                                                                   :disabled="loading">
                                                                Cancelar
                                                            </v-btn>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-row>
                                            </v-container>
                                        </v-card>
                                    </v-stepper-content>
                                </v-stepper>
                            </v-container>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="openDialogDelete" persistent max-width="520">
                        <v-card>
                            <v-card-title v-if="coeficienteToDelete!==null||coeficienteToDelete.id>0">
                                Eliminar coeficiente
                            </v-card-title>
                            <v-divider/>
                            <v-container>
                                <h3 class="font-weight-light">
                                    ¿Desea eliminar el coeficiente con identificador {{coeficienteToDelete.id}}?
                                </h3>
                                <v-layout row class="ma-1 text-center">
                                    <v-flex xs12>
                                        <v-btn color="success" class="mr-1" @click="handleDeleteCoeficiente"
                                               :loading="loading" :disabled="loading">

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
                    <v-dialog v-model="openDialogPreview" persistent width="1000">
                        <v-card>
                            <v-card-title v-if="coeficienteToPreview!==null||coeficienteToPreview.id>0">
                                Coeficiente {{coeficienteToPreview.id}}
                                <v-flex class="text-right">
                                    <v-btn color="error" @click="handleCancelPreview">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-card-title>
                            <v-divider/>
                            <v-container>
                                <v-row>
                                    <v-col cols="6">
                                        <v-card shaped>
                                            <v-container>
                                                <v-card-title>Gastos Bancarios
                                                </v-card-title>
                                                <v-row>
                                                    <v-col cols="4">
                                                        <v-list>
                                                            <v-list-item-title>Moneda total</v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-list v-if="coeficienteToPreview!==null">
                                                            <v-list-item-title>CUC</v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-list v-if="coeficienteToPreview!==null">
                                                            <v-list-item-title>CUP</v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card>
                                    </v-col>

                                    <v-col cols="6">
                                        <v-card shaped>
                                            <v-container>
                                                <v-card-title>Gastos de Distribución y Ventas
                                                </v-card-title>
                                                <v-row>
                                                    <v-col cols="4">
                                                        <v-list v-if="coeficienteToPreview!==null">
                                                            <v-list-item-title>Moneda total
                                                            </v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-list v-if="coeficienteToPreview!==null">
                                                            <v-list-item-title>CUC</v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-list v-if="coeficienteToPreview!==null">
                                                            <v-list-item-title>CUP</v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-card shaped>
                                            <v-container>
                                                <v-card-title>Gastos Generales de Administración
                                                </v-card-title>
                                                <v-row>
                                                    <v-col cols="4">
                                                        <v-list v-if="coeficienteToPreview!==null">
                                                            <v-list-item-title>Moneda total
                                                            </v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-list v-if="coeficienteToPreview!==null">
                                                            <v-list-item-title>CUC</v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-list>
                                                            <v-list-item-title>CUP</v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card>
                                    </v-col>

                                    <v-col cols="6">
                                        <v-card shaped>
                                            <v-container>
                                                <v-card-title>Gastos Indirectos de Producción
                                                </v-card-title>
                                                <v-row>
                                                    <v-col cols="4">
                                                        <v-list v-if="coeficienteToPreview!==null">
                                                            <v-list-item-title>Moneda total
                                                            </v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-list v-if="coeficienteToPreview!==null">
                                                            <v-list-item-title>CUC</v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-list>
                                                            <v-list-item-title>CUP</v-list-item-title>
                                                        </v-list>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card>
                                    </v-col>
                                </v-row>
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
        URL_DELETE_COEFICIENTES,
        URL_GET_ALL_COEFICIENTES,
        URL_SAVE_COEFICIENTE_GASTOS_BANCARIOS,
        URL_SAVE_COEFICIENTE_GASTOS_DISTRIBUCION_VENTAS,
        URL_SAVE_COEFICIENTE_GASTOS_GENERALES_ADMON,
        URL_SAVE_COEFICIENTE_GASTOS_INDIRECTOS_PRODUCCION, URL_SAVE_COEFICIENTES
    } from "../../../constants/UrlResource";


    export default {
        name: "Coeficientes",
        data() {
            return {
                tableLoading: false,
                coeficientesList: [],
                classButtons: '',
                loading: false,
                headers: [
                    {text: "Identificador", value: "id", align: "center"},
                    {text: "Fecha", value: "fecha", align: "center"},
                    {text: "Acciones", value: "actions", align: "center"},
                ],
                search: '',
                openDialogRegister: false,
                openDialogDelete: false,
                openDialogPreview: false,
                coeficienteBancario: {
                    id: 0,
                    coeficienteGastoTotalMn: 0,
                    coeficienteGastoTotalMlc: 0,
                    coeficienteGastoTotalMt: 0,
                    coeficienteGastoDeprecMn: 0,
                    coeficienteGastoDeprecMlc: 0,
                    coeficienteGastoDeprecMt: 0,
                    coeficienteGastoMantenimientoYRepMn: 0,
                    coeficienteGastoMantenimientoYRepMlc: 0,
                    coeficienteGastoMantenimientoYRepMt: 0
                },
                coeficienteGGAdmin: {
                    id: 0,
                    coeficienteGastoTotalMn: 0,
                    coeficienteGastoTotalMlc: 0,
                    coeficienteGastoTotalMt: 0,
                    coeficienteGastoDeprecMn: 0,
                    coeficienteGastoDeprecMlc: 0,
                    coeficienteGastoDeprecMt: 0,
                    coeficienteGastoMantenimientoYRepMn: 0,
                    coeficienteGastoMantenimientoYRepMlc: 0,
                    coeficienteGastoMantenimientoYRepMt: 0
                },
                coeficienteGDYVenta: {
                    id: 0,
                    coeficienteGastoTotalMn: 0,
                    coeficienteGastoTotalMlc: 0,
                    coeficienteGastoTotalMt: 0,
                    coeficienteGastoDeprecMn: 0,
                    coeficienteGastoDeprecMlc: 0,
                    coeficienteGastoDeprecMt: 0,
                    coeficienteGastoMantenimientoYRepMn: 0,
                    coeficienteGastoMantenimientoYRepMlc: 0,
                    coeficienteGastoMantenimientoYRepMt: 0
                },
                coeficienteGIProd: {
                    id: 0,
                    coeficienteGastoTotalMn: 0,
                    coeficienteGastoTotalMlc: 0,
                    coeficienteGastoTotalMt: 0,
                    coeficienteGastoDeprecMn: 0,
                    coeficienteGastoDeprecMlc: 0,
                    coeficienteGastoDeprecMt: 0,
                    coeficienteGastoMantenimientoYRepMn: 0,
                    coeficienteGastoMantenimientoYRepMlc: 0,
                    coeficienteGastoMantenimientoYRepMt: 0
                },
                coeficiente: {
                    fecha: "",
                    id: 0,
                    idCoeficienteGastoGeneralesAdmon: 1,
                    idCoeficienteGastosBancarios: 1,
                    idCoeficienteGastosDistribucionVentas: 1,
                    idCoeficientesGastosIndirectosProduccion: 1
                },
                stepperStep: 1,
                coeficienteToDelete: {},
                coeficienteToPreview: {}
            }
        },
        methods: {
            dialogDeleteOpen(item) {
                console.log(item)
                this.coeficienteToDelete = item;
                this.openDialogDelete = true;
            },
            viewItem(item) {
                console.log(item)
                this.coeficienteToPreview = item;
                this.openDialogPreview = true;
            },
            loadDataTable() {
                this.tableLoading = true;
                const token = localStorage.getItem("token")
                axios.get(URL_GET_ALL_COEFICIENTES, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.tableLoading = false;
                    console.log("Coeficientes", data);
                    this.coeficientesList = data;
                }).catch(err => {
                    console.log(err);
                    this.tableLoading = false;
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            openDialogNew() {
                this.openDialogRegister = true
            },
            onResizes() {
                const windowsSize = {x: window.innerWidth, y: window.innerHeight}
                if (windowsSize.x <= 768) {
                    this.classButtons = true;
                } else {
                    this.classButtons = false;
                }
            },
            handleFinish() {
                const token = localStorage.getItem("token")
                this.loading = true;
                axios.post(URL_SAVE_COEFICIENTE_GASTOS_BANCARIOS, this.coeficienteBancario, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    }
                }).then(({data}) => {
                    this.coeficiente.idCoeficienteGastosBancarios = data.id;
                    axios.post(URL_SAVE_COEFICIENTE_GASTOS_DISTRIBUCION_VENTAS, this.coeficienteGDYVenta, {
                        headers: {
                            "Authorization": "Bearer " + token,
                            "cache-control": "no-cache",
                        }
                    }).then(({data}) => {
                        this.coeficiente.idCoeficienteGastosDistribucionVentas = data.id
                        axios.post(URL_SAVE_COEFICIENTE_GASTOS_GENERALES_ADMON, this.coeficienteGGAdmin, {
                            headers: {
                                "Authorization": "Bearer " + token,
                                "cache-control": "no-cache",
                            }
                        }).then(({data}) => {
                            this.coeficiente.idCoeficienteGastoGeneralesAdmon = data.id
                            axios.post(URL_SAVE_COEFICIENTE_GASTOS_INDIRECTOS_PRODUCCION, this.coeficienteGIProd, {
                                headers: {
                                    "Authorization": "Bearer " + token,
                                    "cache-control": "no-cache",
                                }
                            }).then(({data}) => {
                                this.coeficiente.idCoeficientesGastosIndirectosProduccion = data.id;

                                this.coeficiente.fecha = "2021-01-01";

                                axios.post(URL_SAVE_COEFICIENTES, this.coeficiente, {
                                    headers: {
                                        "Authorization": "Bearer " + token,
                                        "cache-control": "no-cache",
                                    }
                                }).then(({data}) => {
                                    this.coeficientesList.push(data);
                                    this.loading = false;
                                    this.stepperStep = 1
                                    this.openDialogRegister = false;
                                }).catch(err => console.log(err))
                            }).catch(err => console.log(err))
                        }).catch(err => console.log(err))
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err));
            },
            handleCancel() {
                this.openDialogRegister = false
                this.stepperStep = 1
                this.coeficienteBancario = {
                    id: 0,
                    coeficienteGastoTotalMn: 0,
                    coeficienteGastoTotalMlc: 0,
                    coeficienteGastoTotalMt: 0,
                    coeficienteGastoDeprecMn: 0,
                    coeficienteGastoDeprecMlc: 0,
                    coeficienteGastoDeprecMt: 0,
                    coeficienteGastoMantenimientoYRepMn: 0,
                    coeficienteGastoMantenimientoYRepMlc: 0,
                    coeficienteGastoMantenimientoYRepMt: 0
                },
                    this.coeficienteGGAdmin = {
                        id: 0,
                        coeficienteGastoTotalMn: 0,
                        coeficienteGastoTotalMlc: 0,
                        coeficienteGastoTotalMt: 0,
                        coeficienteGastoDeprecMn: 0,
                        coeficienteGastoDeprecMlc: 0,
                        coeficienteGastoDeprecMt: 0,
                        coeficienteGastoMantenimientoYRepMn: 0,
                        coeficienteGastoMantenimientoYRepMlc: 0,
                        coeficienteGastoMantenimientoYRepMt: 0
                    },
                    this.coeficienteGDYVenta = {
                        id: 0,
                        coeficienteGastoTotalMn: 0,
                        coeficienteGastoTotalMlc: 0,
                        coeficienteGastoTotalMt: 0,
                        coeficienteGastoDeprecMn: 0,
                        coeficienteGastoDeprecMlc: 0,
                        coeficienteGastoDeprecMt: 0,
                        coeficienteGastoMantenimientoYRepMn: 0,
                        coeficienteGastoMantenimientoYRepMlc: 0,
                        coeficienteGastoMantenimientoYRepMt: 0
                    },
                    this.coeficienteGIProd = {
                        id: 0,
                        coeficienteGastoTotalMn: 0,
                        coeficienteGastoTotalMlc: 0,
                        coeficienteGastoTotalMt: 0,
                        coeficienteGastoDeprecMn: 0,
                        coeficienteGastoDeprecMlc: 0,
                        coeficienteGastoDeprecMt: 0,
                        coeficienteGastoMantenimientoYRepMn: 0,
                        coeficienteGastoMantenimientoYRepMlc: 0,
                        coeficienteGastoMantenimientoYRepMt: 0
                    }
            },
            handleCancelDelete() {
                this.openDialogDelete = false;
            },
            handleDeleteCoeficiente() {
                this.loading = true;
                const token = localStorage.getItem("token");
                axios.delete(URL_DELETE_COEFICIENTES + this.coeficienteToDelete.id, {
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
                    console.log(err)
                    if (err.response.status === 403) {
                        this.$store.commit('setUser', null)
                        this.$router.push("/login")
                    }
                })
            },
            handleCancelPreview() {
                this.openDialogPreview = false;
            }

        },
        mounted() {
            this.loadDataTable();
        }
    }
</script>

<style scoped>

</style>