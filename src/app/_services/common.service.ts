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
import { ConsoleLoggerService } from "./console-logger.service";
import {
  Addresses,
  AddressItem,
  HouseInfo,
  Street,
  UserInfo,
} from "../_models/common";
import { Statuses } from "../_models/filters";

// tslint:disable-next-line:max-line-length

@Injectable({ providedIn: "root" })
export class CommonService {
  constructor(private http: HttpClient, private log: ConsoleLoggerService) {}

//Сохранение фильтра в базу данных
saveDbFilters(allFilters:any):Observable<any>{
    return this.http
      .post<any>(AppSettings.API_ENDPOINT + "common/user-filters",  { data:{filters: allFilters} } )
      .pipe(
         map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong!");
        })
      );
    }

  getCommonInfo(house_id: number): Observable<HouseInfo> {
    return this.http
      .get<HouseInfo>(
        AppSettings.API_ENDPOINT + "houses/" + house_id + "/general-info"
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

  getStreetsByDistrict(districts: number[]): Observable<Street[]> {
    const dist = { districts: districts };

    const httpHeaders = new HttpHeaders().set("Accept", "application/json");
    const httpParams = new HttpParams().set("data", JSON.stringify(dist));

    return this.http
      .get<Street[]>(AppSettings.API_ENDPOINT + "district/streets", {
        headers: httpHeaders,
        params: httpParams,
        responseType: "json",
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: streets!");
        })
      );
  }

  getDepartments() {
    return this.http
      .get<Statuses[]>(
        AppSettings.API_ENDPOINT +
          "admin/departments"
      )
      .pipe(
        map((res) => {
          console.log("districts");
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: statuses!");
        })
      );
  }

  getTepStatuses(house_id: number): Observable<Statuses[]> {
    return this.http
      .get<Statuses[]>(
        AppSettings.API_ENDPOINT +
          "admin/houses/" +
          house_id +
          "/get-available-statuses"
      )
      .pipe(
        map((res) => {
          console.log("statuses");
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: statuses!");
        })
      );
  }

  sendTepStatus(house_id: number, status_id: number): any {
    return this.http
      .put<any>(
        AppSettings.API_ENDPOINT +
          "admin/houses/" +
          house_id +
          "/set-status/" +
          status_id,
        { data: "" }
      )
      .pipe(catchError(this.handleError));
  }

  getAddressList(
    page: number,
    pageSize: number,
    sort: string,
    sortDirection: string,
    eas_address: string,
    eas_house_id: string
  ): Observable<Addresses> {
    const httpHeaders = new HttpHeaders().set("Accept", "application/json");
    const httpParams = new HttpParams()
      .set("page", String(page))
      .set("limit", String(pageSize))
      .set("sortDirection", sortDirection ? sortDirection: 'asc')
      .set("sort", sort ? sort : 'mtsmkd_address')
      .set("address", eas_address)
      .set("eas_house_id", eas_house_id);
    return this.http
      .get<Addresses>(AppSettings.API_ENDPOINT + "refernce/addresses", {
        headers: httpHeaders,
        params: httpParams,
        responseType: "json",
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: code user logs!");
        })
      );
  }

  getAddressListExcel(
    page: number,
    pageSize: number,
    sort: string,
    sortDirection: string
  ): any {
    const httpHeaders = new HttpHeaders().set("Accept", "application/json");
    const httpParams = new HttpParams()
      .set("page", String(page))
      .set("limit", String(pageSize))
      .set("sortDirection", sortDirection)
      .set("sort", sort)
      .set("export_exel", "true");
    return this.http
      .get(AppSettings.API_ENDPOINT + "refernce/addresses", {
        headers: httpHeaders,
        params: httpParams,
        responseType: "json",
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: code user logs!");
        })
      );
  }

//   editAddressr(
//     mtsmkd_id: number,
//     eas_address: string,
//     eas_house_id: number,
//     fias_house_id: string
//   ): any {
//     return this.http
//       .post<any>(AppSettings.API_ENDPOINT + "reference/addresses/" + mtsmkd_id, {
//         data: {
//           eas_address: eas_address,
//           eas_house_id: eas_house_id,
//           fias_house_id: fias_house_id,
//         },
//       })
//       .pipe(catchError(this.handleError));
//   }
  editAddress(
    mtsmkd_id: string,
    house_number: any,
    house_street: any,
    district_id: any,
    department_id: any,
    house_block: any,
    house_letter: any,
    house_construction: any,
    eas_address: any,
    eas_house_id: any,
    fias_house_id: any
  ): any {
    return this.http
      .post<any>(AppSettings.API_ENDPOINT + "refernce/addresses/" + mtsmkd_id, {
        data: {
        //   mkdaddress: mkdaddress,
          house_number: house_number,
          street_id: house_street,
          district_id: district_id,
          department_id: department_id,
          house_block: house_block,
          house_letter: house_letter,
          house_construction: house_construction,
          eas_address: eas_address,
          eas_house_id: eas_house_id,
          fias_house_id: fias_house_id,
        },
      })
      .pipe(catchError(this.handleError));
  }

  getAddressById(id: number): Observable<AddressItem> {
    return this.http
      .get<AddressItem>(AppSettings.API_ENDPOINT + "refernce/addresses/" + id)
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: get address!");
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

  getCommonUserInfo(): Observable<UserInfo> {
    return this.http
      .get<UserInfo>(AppSettings.API_ENDPOINT + "common/user-info")
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: get common user info!");
        })
      );
  }

  deleteUserPhoto(user_id: number): any {
    return this.http
      .delete<any>(
        AppSettings.API_ENDPOINT + "upload/users/" + user_id + "/avatar"
      )
      .pipe(catchError(this.handleError));
  }

  getBuildingsUO(house_id: number): Observable<any> {
    return this.http
      .get<any>(
        AppSettings.API_ENDPOINT + "refernce/addresses/" + house_id + "/eas-info"
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

  getUOinfo(escId:number): Observable<any>{
    return this.http
    .get<any>(
      AppSettings.API_ENDPOINT + "refernce/addresses/" + escId + "/org-by-eas"
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

}
