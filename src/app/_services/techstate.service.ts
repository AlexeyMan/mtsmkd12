import { Injectable } from "@angular/core";
import { Observable, Subject, Subscription, throwError } from "rxjs";
import { DefectList, DefectlistEntry, DefectRef } from "../_models/defectlist";
import { AppSettings } from "../appSettings";
import { catchError, filter, map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";

export class EventData {
  name: string;
  value: any;
  constructor(name: string, value: any) {
      this.name = name;
      this.value = value;
  }
}

@Injectable({
  providedIn: "root",
})
export class TechstateService {
  // /api/houses/47984/defects-list

  constructor(private http: HttpClient) { }

  concreteDefectsData: any = [];

  subject$: any = new Subject();

  emit(event: EventData) {
    this.subject$.next(event);
  }

  on(eventName: string, action: any): Subscription {
    return this.subject$.pipe(
      filter( (e: EventData) => e.name === eventName), map( (e: EventData) => e["value"])
      ).subscribe(action);
  }

  // Роли
  getDefectListList(house_id: number): Observable<DefectList[]> {
    return this.http
      .get<DefectList[]>(
        AppSettings.API_ENDPOINT + "houses/" + house_id + "/defects-list"
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect lists!");
        })
      );
  }

  getPrintFormFileVOO(house_id: number): any {
    return this.http.post<any>(
      AppSettings.CURR_REPAIR_API_ENDPOINT + "spring-autumn/index",
      { houseId: house_id },
      {
        headers: new HttpHeaders().append("Content-Type", "application/json"),
        responseType: "blob" as "json",
        observe: "body",
      }
    );
  }

  filledByActual(house_id: number, defect_id: number): Observable<any[]> {
    return this.http
      .post<any[]>(
        AppSettings.API_ENDPOINT +
        `houses/${house_id}/defect/${defect_id}/filled-by-actual`,
        ""
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect lists!");
        })
      );
  }

  deleteDefectList(
    house_id: number,
    defect_id: number
  ): Observable<DefectList[]> {
    return this.http
      .delete<DefectList[]>(
        AppSettings.API_ENDPOINT + "houses/" + house_id + "/defect/" + defect_id
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect lists!");
        })
      );
  }

  createDefectListList(house_id: number, data: any): Observable<DefectList[]> {
    return this.http
      .post<DefectList[]>(
        AppSettings.API_ENDPOINT + "houses/" + house_id + "/defect",
        data
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect lists!");
        })
      );
  }
  saveDefectListList(
    house_id: number,
    defectlist_id: number,
    data: any
  ): Observable<DefectList[]> {
    return this.http
      .post<DefectList[]>(
        AppSettings.API_ENDPOINT +
        "houses/" +
        house_id +
        "/defect/" +
        defectlist_id,
        data
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect lists!");
        })
      );
  }

  saveConcreteTechStateParam(
    house_id: number,
    defectlist_id: number,
    concreteState_id: string,
    data: any
  ): Observable<DefectList[]> {
    return this.http
      .post<DefectList[]>(
        AppSettings.API_ENDPOINT +
        "houses/" +
        house_id +
        "/defect/" +
        defectlist_id +
        "/param/" +
        concreteState_id,
        data
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect lists!");
        })
      );
  }

  getDefectList(
    house_id: number,
    defect_id: number
  ): Observable<DefectlistEntry[]> {
    return this.http
      .get<DefectlistEntry[]>(
        AppSettings.API_ENDPOINT + "houses/" + house_id + "/defect/" + defect_id
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect list!");
        })
      );
  }

  getDefectRef(section: string = ""): Observable<DefectRef> {
    return this.http
      .get<DefectRef>(
        AppSettings.API_ENDPOINT +
        `house/defect/reference/materials?section=${!!section ? section : "%22%22"
        }`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect ref list!");
        })
      );
  }

  getFilteredWorks(section: string = ""): Observable<any> {
    return this.http
      .get<any>(
        AppSettings.API_ENDPOINT +
        `house/defect/reference/work-types?section=${!!section ? section : "%22%22"
        }`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect ref list!");
        })
      );
  }

  getTechCondDescriptions(section: string = "", material_id: any): Observable<any> {
    return this.http
      .get<any>(
        AppSettings.API_ENDPOINT +
        `house/defect/reference/techstate?section=${section}&material_ids=${material_id}`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect ref list!");
        })
      );
  }

  setDefectStatus(house_id: number, defect_id: number, data: any): Observable<any> {
    return this.http
      .post<DefectList[]>(
        AppSettings.API_ENDPOINT +
        "houses/" +
        house_id +
        "/defect/" +
        defect_id +
        "/set-status",
        data
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect lists!");
        })
      );
  }

  addPhoto (house: any, defect: any, dSection: any, data: FormData): Observable<any> {
    return this.http
      .post<DefectList[]>(
        AppSettings.API_ENDPOINT +
        `houses/${house}/defect/${defect}/defect-section/${dSection}`,
        data,
        // {
        //   headers: new HttpHeaders().append("Content-Type", "multipart/form-data"),
        // }
        // {
        //   headers: new HttpHeaders().append("Content-Type", "application/json"),
        //   responseType: "blob" as "json",
        //   observe: "body",
        // }
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect lists!");
        })
      );
  }
  getPhoto (dSection: any): Observable<any> {
    return this.http
    .get<any>(
      AppSettings.API_ENDPOINT +
      `defect-section/${dSection}/photos`
    )
    .pipe(
      map((res) => {
        return res;
      }),
      catchError((error) => {
        return throwError("Something went wrong: defect ref list!");
      })
    );
  }
  updatePhoto (house: any, defect: any, dSection: any, data: { files: never[]; }): Observable<any> {
    return this.http
    .post<DefectList[]>(
      AppSettings.API_ENDPOINT +
      `houses/${house}/defect/${defect}/defect-section/${dSection}/photos`,
      data
    )
    .pipe(
      map((res) => {
        console.log(res);
        return res;
      }),
      catchError((error) => {
        return throwError("Something went wrong: defect lists!");
      })
    );
  }
  deletePhoto(house: any, defect: any, dSection: any, id: any): Observable<any> {
    return this.http
    .delete<DefectList[]>(
      AppSettings.API_ENDPOINT +
      `houses/${house}/defect/${defect}/defect-section/${dSection}/photo/${id}`
    )
    .pipe(
      map((res) => {
        console.log(res);
        return res;
      }),
      catchError((error) => {
        return throwError("Something went wrong: defect lists!");
      })
    );
  }

  setDemageTime(house_id: number, defect_id: number): Observable<any> {
    return this.http
      .post<DefectList[]>(
        AppSettings.API_ENDPOINT +
        "houses/" +
        house_id +
        "/defect/" +
        defect_id +
        "/calc-wear-service-life", ""
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: defect lists!");
        })
      );
  }
}
