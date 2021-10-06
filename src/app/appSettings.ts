import {environment} from "../environments/environment";

export class AppSettings {
    public static API_ENDPOINT = `http://${window.location.hostname}:${environment.port}/api/`;
    public static CURR_REPAIR_API_ENDPOINT = `http://${window.location.hostname}:${environment.port}/repair-api/`;
    public static readonly DISTRICTS_ID = "1";
    public static readonly STREETS_ID = "2";
    public static readonly TYPE_MKD_ID = "3";
    public static readonly CURR_REP_ELEMENTS_ID = "4";
    public static readonly MC_TYPE_ID = "5";
    public static readonly MC_ID = "6";
    public static readonly MATERIALS_ID = "7";
    public static readonly VSN_SE_ID = "8";
    public static readonly VSN_TSE_ID = "9";
    public static readonly VSN_TCSE_SIZE_ID = "10";
    public static readonly VSN_TCSE_DESCR_ID = "13";
    public static readonly VSN_TCSE_WORKS_ID = "14";
    public static readonly JOB_TYPES_ID = "11";
    public static readonly JOB_TYPES_CUR_REP_ID = "11";
    public static readonly JOB_TYPES_CAP_REP_ID = "16";
    public static readonly CONCRETE_MATERIAL_ID = "12";
    public static readonly TECHSTATE_ID = "15";
    public static readonly WEIGHT_ID = "17";
  }
