import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { DocumentsService } from "../../../../_services/documents.service";
import { TepMenuItem } from "../../../../_models/tepmenu";
import { FileListItem } from "../../../../_models/documents.";
import { AppSettings } from "../../../../appSettings";
import { SettingsService } from "../../../../_services/settings.service";
import { GeneralSettings, HouseInfo } from "../../../../_models/common";
import { CommonService } from "../../../../_services/common.service";
import { first } from "rxjs/operators";
import { Statuses } from "../../../../_models/filters";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DeleteDialogComponent } from "src/app/components/dialog/delete-tep-dialog/delete-tep-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { AuthenticationService } from "src/app/_services";

@Component({
  selector: "app-filelist",
  templateUrl: "./filelist.component.html",
  styleUrls: ["./filelist.component.scss"],
})
export class FilelistComponent implements OnInit {

  permission: boolean = false;

  constructor(
    private api: DocumentsService,
    private common: CommonService,
    private route: ActivatedRoute,
    private settings: SettingsService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authService: AuthenticationService,
  ) { }

  tepMenu: TepMenuItem[];
  fileEntries: FileListItem[] = [];
  statuses: Statuses[] = [];
  imageObject: Array<object> = [];

  private sendingFailSubject = new BehaviorSubject<boolean>(false);
  public sendingFail$ = this.sendingFailSubject.asObservable();

  private sendingSuccessSubject = new BehaviorSubject<boolean>(false);
  public sendingSuccess$ = this.sendingSuccessSubject.asObservable();

  settings$: Observable<GeneralSettings>;

  config: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: "",
    maxFilesize: 50,
    acceptedFiles: "image/*",
  };

  config_doc: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: "",
    maxFilesize: 50,
    acceptedFiles: "application/pdf,.docx,.doc,.xls,.xlsx",
  };

  house_id: number;
  tep_part: string;
  menuTitle: string;

  house_info: HouseInfo;
  enableBtn: boolean = false;
  isTable: number;

  active_id = 0;

  formType = "standartForm";

  listUoinfo: any;
  beginDataUO: boolean = false;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private saveFailSubject = new BehaviorSubject<boolean>(false);
  public saveFail$ = this.saveFailSubject.asObservable();

  private saveSuccessSubject = new BehaviorSubject<boolean>(false);
  public saveSuccess$ = this.saveSuccessSubject.asObservable();

  public onUploadError(args: any): void {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(true);
  }

  public onUploadSuccess(args: any): void {
    this.api.getFileList(this.house_id).subscribe((p) => {
      this.fileEntries = p;
    });

    // this.saveSuccessSubject.next(true);
    // this.saveFailSubject.next(false);
    this._snackBar.open("Успешно", undefined, {
      panelClass: "snackbar-success",
    });
  }

  public download(file_id, file_name) {
    this.api
      .getFileById(this.house_id, file_id, "application/octet-stream")
      .subscribe(
        (res) => {
          console.log("start download:", res);
          let url = window.URL.createObjectURL(res);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.href = url;
          a.download = file_name;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        },
        (error) => {
          console.log("download error:", JSON.stringify(error));
        },
        () => {
          console.log("Completed file download.");
        }
      );
  }

  public printForm(type) {
    let data: any = {};
    if (type === "workForm") {
      let elements = <any>document.getElementsByName("printSetting");
      elements.forEach((elem) => {
        data[elem.value] = elem.checked;
        console.log(elem);
      });
      data.type = type;
    } else {
      data = {
        showCommon: true,
        showCommonMkd: true,
        showEnergyCharacteristics: true,
        showEngineeringEquipment: true,
        showExplicationLand: true,
        showFilledFieldsOnly: false,
        showGeneralIndicators: true,
        showMaintenanceList: true,
        showSpecialEngineeringEquipment: true,
        showTitlePages: true,
        type: type
      };
    }
    this.api.getPrintFormFile(this.house_id, data).subscribe(
      (res) => {
        console.log("start download:", res);
        const url = window.URL.createObjectURL(res);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none");
        a.href = url;
        a.download = this.house_info.filename + ".docx";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      },
      (error) => {
        console.log("download error:", JSON.stringify(error));
      },
      () => {
        console.log("Completed file download.");
      }
    );
  }

  clearMessage() {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);
  }

  ngOnInit() {
    this.settings$ = this.settings.settings$;
    this.tepMenu = this.route.snapshot.data["tepMenu"];

    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);
    this.sendingFailSubject.next(false);
    this.sendingSuccessSubject.next(false);

    this.tep_part = this.route.snapshot.data["section"];
    this.house_id = this.route.snapshot.data["houseid"];

    this.config.url =
      AppSettings.API_ENDPOINT +
      "upload/houses/" +
      this.house_id +
      "/files/add";
    this.config_doc.url =
      AppSettings.API_ENDPOINT +
      "upload/houses/" +
      this.house_id +
      "/files/add";

    this.route.url.subscribe((url) => {
      this.house_id = parseFloat(url[1].path);
      this.tep_part = url[2].path;

      this.common.getCommonInfo(this.house_id).subscribe((p) => {
        this.house_info = p;
        this.enableBtn = this.house_info.eas_id ? true : false;
      });

      this.common.getTepStatuses(this.house_id).subscribe((q) => {
        this.statuses = q;
      });

      this.api.getFileList(this.house_id).subscribe((p) => {
        this.fileEntries = p;
        p.filter((img) => img.isImage == true).forEach((img) => {
          let data = { image: "", thumbImage: "" };
          data.image = "data:image/jpeg;base64," + img.raw;
          data.thumbImage = "data:image/jpeg;base64," + img.raw;
          this.imageObject.push(data);
        });
      });
    });

    this.permission = !this.authService.hasRole('ROLE_CONFIRM_TEP');
  }

  setStatus(status_id) {
    this.common
      .sendTepStatus(this.house_id, status_id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.house_info.current_status.status_id = status_id;
          // this.house_info.current_status.status_name = status.status_name;

          this.common.getTepStatuses(this.house_id).subscribe((q) => {
            this.statuses = q;
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  OnChange($event) {
    this.settings.setEditMode($event.checked);
  }

  deleteFile() {
    let data = {
      header: "Удаление файла",
      message: "Вы действительно хотите удалить выбранный файл?",
    };
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: data,
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api.deleteFile(this.house_id, this.active_id).subscribe(
          (data) => {
            this.api.getFileList(this.house_id).subscribe((p) => {
              this.fileEntries = p;
            });

            // this.sendingSuccessSubject.next(true);
            // this.sendingFailSubject.next(false);
            this._snackBar.open("Успешно", undefined, {
              panelClass: "snackbar-success",
            });
          },
          (error) => {
            // this.sendingFailSubject.next(true);
            // this.sendingSuccessSubject.next(false);
            this._snackBar.open("Ошибка", undefined, {
              panelClass: "snackbar-error",
            });
          }
        );
      }
    });
  }

  setCurrentId(file_id: number) {
    this.active_id = file_id;
  }

  dismissFlags() {
    this.sendingFailSubject.next(false);
    this.sendingSuccessSubject.next(false);
  }
  getUOformEac(){
    this.common.getUOinfo(this.house_id).subscribe(
      (data)=>{
        this.listUoinfo = data.organizations[0];
        this.beginDataUO = true;
        this._snackBar.open("Успешно", undefined, {
          panelClass: "snackbar-success",
        });
      },
      (error)=>{
        this._snackBar.open("Ошибка", undefined, {
              panelClass: "snackbar-error",
            });
      }
    )
  }
}
