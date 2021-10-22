//Projects urls
export const JWT_SECRET_KEY = "QsbjabKbkbKjsdays89sdskdnasnSSUasndasndP";
const SERVER_HOST = "http://192.168.137.1:8084";
/**
 * Security Urls
 **/
export const URL_LOGIN_POST= SERVER_HOST+"/login-service/api/login";
export const URL_GET_USER_BY_USERNAME= SERVER_HOST+"/user-service/api/user/fetch-user/";

//Tipo actividad
export const URL_GET_ALL_TIPO_ACTIVIDAD= SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/tipo-actividad/all";
export const URL_SAVE_TIPO_ACTIVIDAD= SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/tipo-actividad/save";
export const URL_DELETE_TIPO_ACTIVIDAD= SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/tipo-actividad/delete/id/";
export const URL_EDIT_TIPO_ACTIVIDAD= SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/tipo-actividad/update";

//Unidad de medida
export const URL_GET_ALL_UNIDAD_MEDIDA=SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/unidad-medida/all";
export const URL_SAVE_UNIDAD_MEDIDA=SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/unidad-medida/save";
export const URL_DELETE_UNIDAD_MEDIDA=SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/unidad-medida/delete/id/";
export  const URL_EDIT_UNIDAD_MEDIDA=SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/unidad-medida/update";

//Actividades
export const URL_GET_ALL_ACTIVITIES = SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/actividad/all";
export const URL_SAVE_ACTIVITY = SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/actividad/save";
export const URL_DELETE_ACTIVITY = SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/actividad/delete/id/";
export const URL_EDIT_ACTIVITY = SERVER_HOST+"/rodas-costos/api/v1/rodas-costos/actividad/update";