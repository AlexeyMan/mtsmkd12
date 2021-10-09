import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthenticationService } from "../../_services";
import { Observable } from "rxjs";
import { FiltersComponent } from "../filters/filters.component";
// import { Message } from "../../_models/message";
// import { MessagingService } from "../../_services/messaging.service";
import { MatSnackBar } from "@angular/material/snack-bar";
// import { TeplistService } from "src/app/_services/teplist.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  isEnabledRole$!: Observable<boolean>;
  userName$!: Observable<string>;
  userFullName$!: Observable<string>;
  userId$!: Observable<string>;
  // messages!: Observable<Message[]>;
  // unreadMessages$!: Observable<Message[]>;
  // @ViewChild(FiltersComponent, {static: false})
  // private openFilter: FiltersComponent|undefined;

  isConnected = false;
  ws: any;
  retryCount = -1;
  reconnectInterval = 5;
  reconnectTimeoutId: any;

  constructor(
    private authService: AuthenticationService,
    // private mservice: MessagingService,
    private _snackBar: MatSnackBar,
    // private api: TeplistService
  ) {}

  ngOnInit() {
    // this.startWSListen();
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.isEnabledRole$ = this.authService.hasRole("ROLE_ADMIN");
    // this.userName$ = this.authService.userName;
    // this.userFullName$ = this.authService.userFullName;
    // this.userId$;
  }

  // ngAfterViewInit() {
  //   this.isLoggedIn$.subscribe((p) => {
  //     if (p) {
  //       console.log("logged in: " + p);
  //       this.messages = this.mservice.getMessageList();
  //       this.unreadMessages$ = this.mservice.unreadMessages;
  //       this.mservice.getUnreadMessageList();
  //       this.user();
  //     }
  //   });
  // }
  btnOpen:boolean = false;
  openFiltersComponent(){
    this.btnOpen = !this.btnOpen;
}
  onLogout() {
    this.authService.logout();
  }

  // user() {
  //   let userId;
  //   this.userId$ = this.authService.userId;
  //   this.userId$.subscribe((p) => (userId = p));
  //   if (userId != null) {
  //     try {
  //       this.ws.send(
  //         JSON.stringify({ type: "clientConnected", data: Number(userId) })
  //       );
  //     } catch {
  //       console.log("ws no connection");
  //     }
  //   }
  // }

  // saveAsFile(fileName, data = "", postfix = (+new Date()).toString()) {
  //   if (typeof document === "undefined") {
  //     throw new Error("Предназначено для работы в браузере!");
  //   }

  //   let lnk = document.createElement("a");
  //   lnk.href = `data:text/plain;content-disposition=attachment;filename=${fileName},${data}`;
  //   lnk.download = fileName;
  //   lnk.target = "_blank";
  //   lnk.style.display = "none";
  //   lnk.id = `downloadlnk-${postfix}`;
  //   document.body.appendChild(lnk);
  //   lnk.click();
  //   document.body.removeChild(lnk);
  // }

  // downloadFile(name) {
  //   this.api.downloadFile(name).subscribe(
  //     (res) => {
  //       console.log("start download:", res);
  //       const url = window.URL.createObjectURL(res);
  //       const a = document.createElement("a");
  //       document.body.appendChild(a);
  //       a.setAttribute("style", "display: none");
  //       a.href = url;
  //       a.download = name;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       a.remove();
  //     },
  //     (error) => {
  //       this._snackBar.open("Ошибка получения файла", undefined, {
  //         panelClass: "snackbar-error",
  //       });
  //     }
  //   );
  // }

  // startWSListen() {
  //   this.ws = new WebSocket(`ws://${window.location.hostname}:80/mtsmkd-ws`);
  //   this.ws.onopen = () => {
  //     console.log("WS подключенно");
  //     this.user();
  //   };
  //   this.ws.onclose = (eventclose) => {
  //     this.isConnected = false;
  //     console.log("соеденение закрыто причина: " + eventclose);
  //     if (this.retryCount > 0 || this.retryCount === -1) {
  //       if (this.retryCount !== -1) {
  //         this.retryCount--;
  //       }
  //       clearTimeout(this.reconnectTimeoutId);
  //       this.reconnectTimeoutId = setTimeout(
  //         function () {
  //           this.startWSListen();
  //         }.bind(this),
  //         this.reconnectInterval * 1000
  //       );
  //     } else {
  //     }
  //   };
  //   this.ws.onerror = (code, reason) => {
  //     console.log("соеденение закрыто причина: " + reason);
  //   };
  //   this.ws.onmessage = ({ data }) => {
  //     const msg = JSON.parse(data);
  //     try {
  //       let btnFlag = this.api.enabledBtnRP;
  //       if (msg.data.jobType === "kp") {
  //         btnFlag = this.api.enabledBtnKP;
  //       }
  //       if (msg.type === "importCapital:updateProgress") {
  //         btnFlag = true;
  //       } else if (msg.type === "importCapital:updated") {
  //         btnFlag = false;
          // this.saveAsFile("Лог.txt", msg.data.log.join("\n"));
//           this._snackBar.open("Импорт завершен", undefined, {
//             panelClass: "snackbar-success",
//           });
//         }
//       } catch {
//         console.log("no jobType");
//       }
//       if (msg.type === "connected") {
//         this.isConnected = true;
//       } else if (
//         msg.type === "importCapital:updateProgress" ||
//         msg.type === "lq:updateProgress"
//       ) {
//         const msgStr = `Прогресс выполнения ${msg.data.progress}%`;
//         this._snackBar.open(msgStr, undefined, {
//           panelClass: "snackbar-warning",
//         });
//       } else if (msg.type === "importCapital:updated") {
//         const notifyParams = { type: "success", title: "Задача выполнена" };
//         const msgStr = `Импорт прошел успешно`;
//         let snackBarRef = this._snackBar.open(msgStr, "Скачать лог", {
//           panelClass: "snackbar-success",
//           duration: 60 * 1000,
//         });
//         snackBarRef.onAction().subscribe(() => {
//           this.saveAsFile("Лог.txt", msg.data.log.join("\n"));
//         });
//       } else if (msg.type === "lq:done") {
//         const notifyParams = { type: "success", title: "Задача выполнена" };
//         const msgStr = `Экспорт прошел успешно`;
//         let snackBarRef = this._snackBar.open(msgStr, "Скачать", {
//           panelClass: "snackbar-success",
//           duration: 60 * 1000,
//         });
//         snackBarRef.onAction().subscribe(() => {
//           this.downloadFile(msg.data.file);
//         });
//       } else if (msg.type === "importCapital:error") {
//         this._snackBar.open(
//           `Критическая ошибка импорта. ${msg.data.msg}`,
//           undefined,
//           {
//             panelClass: "snackbar-error",
//           }
//         );
//       } else {
//         this._snackBar.open(
//           "Импорт завершился с неизвестной ошибкой",
//           undefined,
//           {
//             panelClass: "snackbar-error",
//           }
//         );
//       }
//     };
//   }
}
