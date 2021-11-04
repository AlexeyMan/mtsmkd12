import { Component, OnInit, ViewChild } from "@angular/core";
import { TepMenuItem } from "../../../../_models/tepmenu";
import { GeneralSettings, HouseInfo } from "../../../../_models/common";
import { Observable, zip } from "rxjs";
import { DefectList, DefectlistEntry } from "../../../../_models/defectlist";
import { CommonService } from "../../../../_services/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SettingsService } from "../../../../_services/settings.service";
import { TechstateService } from "../../../../_services/techstate.service";
import { first } from "rxjs/operators";
import { Statuses } from "../../../../_models/filters";
import { DocumentsService } from "../../../../_services/documents.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TechstateindicatorsComponent } from "./techstateindicators/techstateindicators.component";
import { AuthenticationService } from "src/app/_services";
import { TechstateeditComponent } from "./techstateedit/techstateedit.component";
import { DeleteDialogComponent } from "../../../dialog/delete-tep-dialog/delete-tep-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
export class EventData {
  name: string;
  value: any;
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

@Component({
  selector: "app-techstate",
  templateUrl: "./techstate.component.html",
  styleUrls: ["./techstate.component.scss"],
})
export class TechstateComponent implements OnInit {
  @ViewChild(TechstateindicatorsComponent)
  viewChild: TechstateindicatorsComponent;

  tepMenu: TepMenuItem[];
  statuses: Statuses[] = [];

  house_id: number;
  defect_id: number;
  entry_id: number;
  tep_part: string;
  menuTitle: string;

  currComp: string = "commission";

  house_info: HouseInfo;

  settings$: Observable<GeneralSettings>;

  defect: DefectList;
  defectentries: DefectlistEntry[] = [];
  isShow: boolean = false;

  defectStatusUnderSave: number;

  imageObject: Array<object> = [];

  actDate: any;

  isDefectsUpdate: boolean = false;

  permission1: boolean = false;
  permission2: boolean = false;

  constructor(
    private common: CommonService,
    private route: ActivatedRoute,
    private settings: SettingsService,
    private api: TechstateService,
    private apiFiles: DocumentsService,
    private _snackBar: MatSnackBar,
    private authService: AuthenticationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.tepMenu = this.route.snapshot.data["tepMenu"];

    this.settings$ = this.settings.settings$;

    this.route.url.subscribe((url) => {
      this.openIndicators();
      this.house_id = parseFloat(url[1].path);
      this.tep_part = url[2].path;
      this.defect_id = parseInt(url[3].path, 10);
      this.getData();
    });

    let param = this.getParam("open");
    if (param) {
      this.currComp = "edit"
    }

    this.permission1 = !this.authService.hasRole('ROLE_CONFIRM_TEP');
    this.permission2 = !!this.authService.hasRole('ROLE_CONFIRM_DEFECT_ACT');
  }

  getParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
      return "";
    else
      return results[1];
  }

  getData() {
    zip(
      this.common.getCommonInfo(this.house_id),
      this.common.getTepStatuses(this.house_id),
      this.api.getDefectListList(this.house_id),
      this.api.getDefectList(this.house_id, this.defect_id),
      this.apiFiles.getFileList(this.house_id)
    ).subscribe((p) => {
      this.house_info = p[0];
      this.statuses = p[1];
      this.defect = p[2].filter((dfc) => dfc.id === this.defect_id)[0];
      this.defect["status"] = Number(this.defect["status"]);
      this.defectStatusUnderSave = this.defect["status"]
      this.actDate = this.defect["dateFrom"];
      this.defectentries = p[3];
      p[4]
        .filter((img) => img.isImage == true)
        .forEach((img) => {
          let data = { image: "", thumbImage: "" };
          data.image = "data:image/jpeg;base64," + img.raw;
          data.thumbImage = "data:image/jpeg;base64," + img.raw;
          this.imageObject.push(data);
        });
      this.isShow = true;
    });
  }

  filledByActual() {
    this.api.filledByActual(this.house_id, this.defect_id).subscribe(
      (res) => {
        this._snackBar.open(`Успешно`, undefined, {
          panelClass: "snackbar-success",
        });
        window.location.reload();
      },
      (error) => {
        this._snackBar.open("Последний акт осмотра не найден!", undefined, {
          panelClass: "snackbar-error",
        });
      }
    );
  }

  public printFormVOO() {
    this.api.getPrintFormFileVOO(this.house_id).subscribe(
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

  dataChangeHandler(entry_id) {
    this.entry_id = entry_id;
    this.currComp = "edit";
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

  openComission() {
    this.currComp = "commission";
  }

  openIndicators() {
    this.currComp = "indicators";
  }

  dateChange($event) {
    let date = $event.targetElement.value.split(".");
    // @ts-ignore
    this.defect.dateFrom =
      date[2] + "-" + date[1] + "-" + date[0] + " 00:00:00";
  }

  saveAct() {
    let saveRequests = [];

    this.api.concreteDefectsData.forEach((element) => {
      // TODO: Костыль
      if (typeof element.size === 'object') {
        element.size = "";
      }
      saveRequests.push(
        this.api.saveConcreteTechStateParam(
          this.house_id,
          this.defect.id,
          element.id,
          element
        )
      );
    });

    zip(
      this.api.saveDefectListList(this.house_id, this.defect.id, this.defect),
      ...saveRequests
    ).subscribe((p) => {
      this._snackBar.open(`Данные обновлены`, undefined, {
        panelClass: "snackbar-success",
      });

      this.api.emit(new EventData("updatedData", p));

      if (p[0]["data"].actual_flag) {
        this.house_info.current_status["actual_defect_status"] =
          p[0]["data"].status;
      }
      p.shift();
      p.forEach((el) => {
        this.house_info.total_damage = el["data"].total_damage;
        if (el["data"].isDefectRegisterActual) {
          this.defect.total_damage = el["data"].total_damage;
        }
      });

      this.defectStatusUnderSave = this.defect["status"];

      this.getData();

      // Костыль
      this.isDefectsUpdate = !this.isDefectsUpdate;
      if (!(this.authService.hasRole('ROLE_ADMIN')) && this.defectStatusUnderSave === 6) {
        this.settings.setEditMode(false);
      }
    });
  }
  defectStatus(status_id) {
    // @ts-ignore
    this.defect.status = status_id;
    return Number(status_id);
  }
  changeDefectStatus($event) {
    this.api.setDefectStatus(this.house_id, this.defect_id, { "statusId": $event.value }).subscribe(
      (res) => {
        this._snackBar.open(`Статус изменен`, undefined, {
          panelClass: "snackbar-success",
        });
        this.defectStatusUnderSave = $event.value
        if (this.defectStatusUnderSave === 6) {
          this.settings.setEditMode(false);
        }

      },
      (error) => {
        this._snackBar.open("Ошибка изменения статуса!", undefined, {
          panelClass: "snackbar-error",
        });
      },
    )
  }
  demageTep(id: number) {
    let data = {
      header: "Износ по сроку",
      message: "Подтвердите пересчет износа по сроку эксплуатации",
    };
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: data,
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api.setDemageTime(this.house_id, this.defect_id).subscribe(
          (res) => {
            this.uptData();
            this._snackBar.open(res.message, undefined, {
              panelClass: "snackbar-success",
            });
          },
          (error) => {
            this._snackBar.open("Ошибка пересчета износа эксплуатации", undefined, {
              panelClass: "snackbar-error",
            });
          }
        );
      }
    });
  }
  uptData() {
    zip(
      this.api.getDefectListList(this.house_id),
      this.api.getDefectList(this.house_id, this.defect_id),
    ).subscribe((p) => {
      this.defect = p[0].filter((dfc) => dfc.id === this.defect_id)[0];
      this.defect["status"] = Number(this.defect["status"]);
      this.defectStatusUnderSave = this.defect["status"]
      this.actDate = this.defect["dateFrom"];
      this.defectentries = p[1];
      this._snackBar.open("Данные обновлены", undefined, {
        panelClass: "snackbar-success",
      });
    }, (error) => {
      this._snackBar.open("Ошибка получения данных", undefined, {
        panelClass: "snackbar-error",
      });
    }
    );
  }
}
