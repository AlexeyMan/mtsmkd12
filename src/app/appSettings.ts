import {environment} from "../environments/environment";

export class AppSettings {
    public static API_ENDPOINT = `http://${window.location.hostname}:${environment.port}/api/`;
    public static CURR_REPAIR_API_ENDPOINT = `http://${window.location.hostname}:${environment.port}/repair-api/`;
}