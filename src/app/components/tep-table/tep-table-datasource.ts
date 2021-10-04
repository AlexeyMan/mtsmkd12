// import { DataSource } from "@angular/cdk/table";
// import { Mkdlistitem } from "../../_models/mkdlistitem";
// import { BehaviorSubject, Observable, of } from "rxjs";
// import { CollectionViewer } from "@angular/cdk/collections";
// import { TeplistService } from "../../_services/teplist.service";
// import { catchError, finalize } from "rxjs/operators";
// import { TepListFilter } from "../../_models/common";

// export class TepListDataSource implements DataSource<Mkdlistitem> {
//   public tepSubject = new BehaviorSubject<Mkdlistitem[]>([]);
//   private loadingSubject = new BehaviorSubject<boolean>(false);

//   public loading$ = this.loadingSubject.asObservable();

//   private totalSubject = new BehaviorSubject<number>(0);
//   public total$ = this.loadingSubject.asObservable();
//   public total = 0;

//   constructor(private api: TeplistService) {}

//   connect(collectionViewer: CollectionViewer): Observable<Mkdlistitem[]> {
//     return this.tepSubject.asObservable();
//   }

//   disconnect(collectionViewer: CollectionViewer): void {
//     this.tepSubject.complete();
//     this.loadingSubject.complete();
//   }

//   loadMkdListItems(filter: TepListFilter, excel = false) {
//     if (!excel) {
//       this.loadingSubject.next(true);

//       this.api
//         .getTepListEntries(filter)
//         .pipe(
//           catchError(() => of([])),
//           finalize(() => this.loadingSubject.next(false))
//         )
//         .subscribe((teps) => {
//           this.tepSubject.next(teps["data"]);
//           this.totalSubject.next(teps["data"].length);
//           this.total = teps["options"].total;
//           // console.log(teps.length);
//         });
//     } else {
//       this.api.getTepListEntriesExcel(filter).subscribe((response) => {
//         this.api
//           .getLogFile(response["hash_export"], "application/octet-stream")
//           .subscribe(
//             (res) => {
//               console.log("start download:", res);
//               const url = window.URL.createObjectURL(res);
//               const a = document.createElement("a");
//               document.body.appendChild(a);
//               a.setAttribute("style", "display: none");
//               a.href = url;
//               a.download = "Экспорт списка.xls";
//               a.click();
//               window.URL.revokeObjectURL(url);
//               a.remove(); // remove the element
//             },
//             (error) => {
//               console.log("download error:", JSON.stringify(error));
//             },
//             () => {
//               console.log("Completed file download.");
//             }
//           );
//       });
//     }
//   }
// }
