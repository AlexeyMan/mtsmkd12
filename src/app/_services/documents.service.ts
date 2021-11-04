import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { AppSettings } from "../appSettings";
import { Observable, throwError } from "rxjs";
import { ConsoleLoggerService } from "./console-logger.service";
// tslint:disable-next-line:max-line-length
import { FileListItem } from "../_models/documents.";

@Injectable({ providedIn: "root" })
export class DocumentsService {
  constructor(private http: HttpClient, private log: ConsoleLoggerService) {}

  // Роли
  getFileList(house_id: number): Observable<FileListItem[]> {
    return this.http
      .get<FileListItem[]>(
        AppSettings.API_ENDPOINT + "houses/" + house_id + "/files"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: file list!");
        })
      );
  }

  getFileById(house_id: number, file_id: number, contentType: string): any {
    return this.http.get(
      AppSettings.API_ENDPOINT + "houses/" + house_id + "/files/" + file_id,
      {
        headers: new HttpHeaders().append("Content-Type", contentType),
        responseType: "blob",
        observe: "body",
      }
    );
  }

  getPrintFormFileByHash(hash: string, contentType: string): any {
    return this.http.get(
      AppSettings.API_ENDPOINT + "common/print-form/" + hash,
      {
        headers: new HttpHeaders().append("Content-Type", contentType),
        responseType: "blob",
        observe: "body",
      }
    );
  }

  getPrintForm(house_id: number): any {
    return this.http.get(
      AppSettings.API_ENDPOINT + "houses/" + house_id + "/print-form"
    );
  }

  // getPrintFormFile(house_id: number): any {
  //   return this.http.get(AppSettings.API_ENDPOINT + 'houses/' + house_id + '/print-form-file',
  //     { headers: new HttpHeaders().append('Content-Type', 'application/octet-stream'), responseType: 'blob', observe: 'body' });
  // }

  getPrintFormFile(house_id: number, data: object): any {
    return this.http.post<any>(
      AppSettings.API_ENDPOINT + "houses/" + house_id + "/print-form-file",
      data,
      {
        headers: new HttpHeaders().append(
          "Content-Type",
          "application/octet-stream"
        ),
        responseType: "blob" as "json",
        observe: "body",
      }
    );
  }

  deleteFile(house_id: number, file_id: number): any {
    return this.http
      .delete<any>(
        AppSettings.API_ENDPOINT + "houses/" + house_id + "/files/" + file_id
      )
      .pipe(catchError(this.handleError));
  }

  // Обработка ошибок
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
}
