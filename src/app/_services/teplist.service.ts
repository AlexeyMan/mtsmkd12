import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { AppSettings } from "../appSettings";
import { Observable, throwError } from "rxjs";
import { Mkdlistitem, Options, TepList } from "../_models/mkdlistitem";
import { ConsoleLoggerService } from "./console-logger.service";
import { Category, ListFilter } from "../_models/filters";
// tslint:disable-next-line:max-line-length
import {
  BasementsWallsFloors,
  Energycost,
  Energytemp,
  Energyuse,
  Explication,
  Flatstable,
  MeteringDevices,
  RepairtableItem,
  TepField,
} from "../_models/tep";
import { TepMenuItem } from "../_models/tepmenu";
import { TepListFilter } from "../_models/common";

@Injectable({ providedIn: "root" })
export class TeplistService {
  constructor(
    private http: HttpClient,
    private log: ConsoleLoggerService,
    ) { }

  enabledBtnKP: boolean = false;
  enabledBtnRP: boolean = false;

  // public tlist: TepList;

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("Возникла ошибка:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Сервер возвратил статус ${error.status}, ` + `ошибка: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Не удалось выполнить запрос, сообщите администратору");
  }

  // tslint:disable-next-line:max-line-length
  addTep(
    department_id: string,
    districtid: string,
    streetid: string,
    hnumber: string,
    building: string,
    letter: string,
    construction: string
  ): any {
    return this.http
      .post<any>(AppSettings.API_ENDPOINT + "houses/add", {
        data: {
          department_id: department_id,
          district_id: districtid,
          street_id: streetid,
          house_number: hnumber,
          house_block: building,
          house_letter: letter,
          house_construction: construction,
        },
      })
      .pipe(catchError(this.handleError));
  }

  exportExcel(data: any): any {
    return this.http
      .post<any>(AppSettings.CURR_REPAIR_API_ENDPOINT + "stat/index", data, {
        headers: new HttpHeaders().append("Content-Type", "application/json"),
        responseType: "blob" as "json",
        observe: "body",
      })
      .pipe(catchError(this.handleError));
  }

  toFavorite(id: number, isFavorite: boolean) {
    return this.http
      .post<any>(AppSettings.CURR_REPAIR_API_ENDPOINT + "favorite/update", {
        houseId: id,
        favorite: isFavorite,
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  exportExcelTR(data:any) {
    return this.http
      .post<any>(
        AppSettings.CURR_REPAIR_API_ENDPOINT + "current/report",
        data,
        {
          headers: new HttpHeaders().append("Content-Type", "application/json"),
          responseType: "blob" as "json",
          observe: "body",
        }
      )
      .pipe(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      );
  }

  downloadFile(name:any) {
    return this.http
      .get<any>(
        AppSettings.CURR_REPAIR_API_ENDPOINT + `stat/download?file=${name}`,
        {
          headers: new HttpHeaders().append("Content-Type", "application/json"),
          responseType: "blob" as "json",
          observe: "body",
        }
      )
      .pipe(catchError(this.handleError));
  }

  exportExcelKP(
    year: any,
    structureElementId: any,
    byDistrict: any,
    executeKp: any,
    KP: any,
    filter: any
  ): any {
    let data = {
      year: year,
      structureElementId: structureElementId,
      byDistrict: byDistrict,
      executeKp: executeKp,
      kp: KP,
      filter: filter,
    };
    return this.http
      .post<any>(
        AppSettings.CURR_REPAIR_API_ENDPOINT + "capital/report",
        data,
        {
          headers: new HttpHeaders().append("Content-Type", "application/json"),
          responseType: "blob" as "json",
          observe: "body",
        }
      )
      .pipe(catchError(this.handleError));
  }

  exportExcelDep(
    structureElementName: any,
    byDistrict: any,
    filter: any,
  ): any {
    let data = {
      sortedGroups: byDistrict ? ["district"] : [],
      sesNames: structureElementName,
      filter: filter,
    };
    return this.http
      .post<any>(
        AppSettings.CURR_REPAIR_API_ENDPOINT + "wearing/report",
        data,
        {
          headers: new HttpHeaders().append("Content-Type", "application/json"),
          responseType: "blob" as "json",
          observe: 'body',
        }
      )
      .pipe(catchError(this.handleError));
  }

  importFileRPKR(data: any): any {
    return this.http
      .post<any>(AppSettings.CURR_REPAIR_API_ENDPOINT + "capital/rp", data)
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError(this.handleError)
      );
  }

  importFileKPR_RPKR(data: any): any {
    return this.http
      .post<any>(AppSettings.CURR_REPAIR_API_ENDPOINT + "capital/kp", data)
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getFilters(): Observable<ListFilter> {
    return this.http
      .get<ListFilter>(AppSettings.API_ENDPOINT + "houses/filters")
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(AppSettings.API_ENDPOINT + "houses/filters/categories")
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getMcList(): Observable<any[]> {
    return this.http
      .get<any[]>(
        `${AppSettings.API_ENDPOINT}admin/reference/${AppSettings.MC_ID}`
      )
      .pipe(
        map((res:any) => {
          return res["data"];
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of refmc!");
        })
      );
  }

  getTepListOptions(): Observable<Options> {
    return this.http.get<Options>(AppSettings.API_ENDPOINT + "houses").pipe(
      map((res:any) => {
        return res["options"];
      }),
      catchError((error) => {
        return throwError("Something went wrong!");
      })
    );
  }

  getTepListEntries(filter: TepListFilter): Observable<Mkdlistitem[]> {
    const httpHeaders = new HttpHeaders().set("Accept", "application/json");
    const httpParams = new HttpParams().set("filter", JSON.stringify(filter));

    return this.http
      .get<Mkdlistitem[]>(AppSettings.API_ENDPOINT + "houses", {
        headers: httpHeaders,
        params: httpParams,
        responseType: "json",
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getTepListFavorite(filter: any): Observable<Mkdlistitem[]> {
    const httpHeaders = new HttpHeaders().set("Accept", "application/json");
    const httpParams = new HttpParams().set("filter", JSON.stringify(filter));

    return this.http
      .get<Mkdlistitem[]>(AppSettings.API_ENDPOINT + "houses", {
        headers: httpHeaders,
        params: httpParams,
        responseType: "json",
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }
  getTepListEntriesExcel(filter: TepListFilter) {
    const httpHeaders = new HttpHeaders().set("Accept", "application/json");
    const httpParams = new HttpParams()
      .set("filter", JSON.stringify(filter))
      .set("export_exel", "true");
    return this.http
      .get(AppSettings.API_ENDPOINT + "houses", {
        headers: httpHeaders,
        params: httpParams,
        responseType: "json",
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getLogFile(hash: string, contentType: string): any {
    return this.http.get(
      AppSettings.API_ENDPOINT + "common/print-form/" + hash,
      {
        headers: new HttpHeaders().append("Content-Type", contentType),
        responseType: "blob",
        observe: "body",
      }
    );
  }

  getCommonParametersById(id: string): Observable<TepField[]> {
    return this.http
      .get<TepField[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/common-information"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getOverhaul(id: number): Observable<RepairtableItem[]> {
    return this.http
      .get<RepairtableItem[]>(
        AppSettings.CURR_REPAIR_API_ENDPOINT +
        "rest/list?class=capital&house_id=" +
        id
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong with repairs!");
        })
      );
  }

  saveOverhaul(id: number, data: any): Observable<RepairtableItem[]> {
    return this.http
      .post<RepairtableItem[]>(
        AppSettings.CURR_REPAIR_API_ENDPOINT +
        "rest/save?class=capital&house_id=" +
        id,
        data
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong with repairs!");
        })
      );
  }

  deleteOverhaul(id: number, data: any): Observable<RepairtableItem[]> {
    return this.http
      .post<RepairtableItem[]>(
        AppSettings.CURR_REPAIR_API_ENDPOINT +
        "rest/delete?class=capital&house_id=" +
        id,
        { ids: [data] }
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong with repairs!");
        })
      );
  }

  getLivingQuarters(id: number): Observable<Flatstable> {
    return this.http
      .get<Flatstable>(
        AppSettings.API_ENDPOINT +
        "houses/" +
        id +
        "/living-quarters-characteristics"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getCleaningAreas(id: number): Observable<Explication[]> {
    return this.http
      .get<Explication[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/cleaning-areas"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getExplications(id: number): Observable<Explication[]> {
    return this.http
      .get<Explication[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/explication-land"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getEnergyCosts(id: number): Observable<Energycost[]> {
    return this.http
      .get<Energycost[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/energy-cost"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getEnergyUse(id: number): Observable<Energyuse[]> {
    return this.http
      .get<Energyuse[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/energy-use"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getEnergyTemp(id: number): Observable<Energytemp[]> {
    return this.http
      .get<Energytemp[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/temperature-conditions"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getMeteringDevices(id: number): Observable<MeteringDevices[]> {
    return this.http
      .get<MeteringDevices[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/metering-devices"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getEnergyMeters(id: number) {
    return this.http
      .get(AppSettings.API_ENDPOINT + "houses/" + id + "/metering-system")
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getParameterData(id: number, path: string) {
    return this.http.get(
      AppSettings.API_ENDPOINT + "houses/" + id + "/" + path
    );
  }

  getTepMenu(): Observable<TepMenuItem[]> {
    return this.http
      .get<TepMenuItem[]>(AppSettings.API_ENDPOINT + "common/tep-menu")
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  sendTepToReview(id: number) {
    return this.http.get(
      AppSettings.API_ENDPOINT + "houses/" + id + "/sent-tep-to-review"
    );
  }

  postFieldSetData(id: number, path: string, pack: string): any {
    return this.http
      .post<any>(AppSettings.API_ENDPOINT + "houses/" + id + "/" + path, pack)
      .pipe(catchError(this.handleError));
  }

  deleteTep(id: number): any {
    return this.http
      .delete<any>(AppSettings.API_ENDPOINT + "tep/delete/" + id)
      .pipe(catchError(this.handleError));
  }

  getExternalFinishing(id: number): Observable<BasementsWallsFloors[]> {
    return this.http
      .get<BasementsWallsFloors[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/external-finishing"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getHeatSupplySystem(id: number): Observable<BasementsWallsFloors[]> {
    return this.http
      .get<BasementsWallsFloors[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/heat-supply-system"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getImprovementPlaygrounds(id: number): Observable<BasementsWallsFloors[]> {
    return this.http
      .get<BasementsWallsFloors[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/improvement-playgrounds"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getSpecialEngineeringEquipment(
    id: number
  ): Observable<BasementsWallsFloors[]> {
    return this.http
      .get<BasementsWallsFloors[]>(
        AppSettings.API_ENDPOINT +
        "houses/" +
        id +
        "/special-engineering-equipment"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getTepPageData(id: number, url: string): Observable<any[]> {
    return this.http
      .get<any[]>(AppSettings.API_ENDPOINT + `houses/${id}/${url}`)
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getBasementsWallsFloors(id: number): Observable<BasementsWallsFloors[]> {
    return this.http
      .get<BasementsWallsFloors[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/basements-walls-floors"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getElectricitySupply(id: number): Observable<BasementsWallsFloors[]> {
    return this.http
      .get<BasementsWallsFloors[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/electricity-supply"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getSpecialPurposeRooms(id: number): Observable<BasementsWallsFloors[]> {
    return this.http
      .get<BasementsWallsFloors[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/special-purpose-rooms"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getInteriorFinishing(id: number): Observable<BasementsWallsFloors[]> {
    return this.http
      .get<BasementsWallsFloors[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/interior-finishing"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getHouseRoofing(id: number): Observable<any[]> {
    return this.http
      .get<any[]>(AppSettings.API_ENDPOINT + "houses/" + id + "/house-roofing")
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getWatersupplySewerage(id: number): Observable<any[]> {
    return this.http
      .get<any[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/watersupply-sewerage"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getWindowOpeningDoorway(id: number): Observable<any[]> {
    return this.http
      .get<any[]>(
        AppSettings.API_ENDPOINT + "houses/" + id + "/window-opening-doorway"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getLiftData(house_id: number): Observable<any[]> {
    return this.http
      .get<any[]>(AppSettings.API_ENDPOINT + "houses/" + house_id + "/lifts-equipment-data")
      .pipe(
         map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
  }

  getLiftType(): Observable<any[]> {
  return this.http
    .get<any[]>(AppSettings.API_ENDPOINT + "lifts-equipment-data/refs")
    .pipe(
       map((res) => {
        return res;
      }),
      catchError((error) => {
        return throwError("Something went wrong!");
      })
    );
  }

  addLift(data:any, house_id:any): Observable<any> {
  return this.http
    .put<any>(AppSettings.API_ENDPOINT + "houses/"+house_id+"/lifts-equipment-data", data)
    .pipe(
       map((res) => {
        return res;
      }),
      catchError((error) => {
        return throwError("Something went wrong!");
      })
    );
  }

  editLift(data:any, house_id:any, liftId:any): Observable<any> {
  return this.http
    .post<any>(AppSettings.API_ENDPOINT + "houses/"+house_id+"/lifts-equipment-data/"+liftId, data)
    .pipe(
       map((res) => {
        return res;
      }),
      catchError((error) => {
        return throwError("Something went wrong!");
      })
    );
  }

  deleteLift(id: number, house_id: number): any {
  return this.http
    .delete<any>(AppSettings.API_ENDPOINT + "houses/"+house_id+"/lifts-equipment-data/"+ id)
    .pipe(catchError(this.handleError));
  }
  deleteAllSelectLift(lifts:any, house_id:any): any {
  return this.http
    .post<any>(AppSettings.API_ENDPOINT + "houses/"+house_id+"/lifts-equipment-data/batch-delete",lifts)
    .pipe(catchError(this.handleError));
  }

  exportExcelLift(house_id: any): any {
  return this.http
    .get<any>(AppSettings.API_ENDPOINT + "houses/"+house_id+"/lifts-equipment-data/export-to-excel", {
      headers: new HttpHeaders().append("Content-Type", "application/json"),
      responseType: "blob" as "json",
      observe: "body",
    })
    .pipe(catchError(this.handleError));
  }
  setDemageTime(filter: TepListFilter) {
    const fil = {"filter": filter}
    return this.http
    .post<any>(AppSettings.API_ENDPOINT + "houses/update-wear-service-life", fil)
    .pipe(catchError(this.handleError));
  }
}
