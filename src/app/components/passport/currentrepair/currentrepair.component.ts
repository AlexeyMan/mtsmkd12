import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { TepMenuItem } from "../../../_models/tepmenu";
import { TepField } from "../../../_models/tep";
import { GeneralSettings, HouseInfo } from "../../../_models/common";
import { Observable, from, zip } from "rxjs";
import { CommonService } from "../../../_services/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SettingsService } from "../../../_services/settings.service";
import { first } from "rxjs/operators";
import { CurrentRepairList } from "../../../_models/currentrepair";
import { CurrentrepairService } from "../../../_services/currentrepair.service";
import { Statuses } from "../../../_models/filters";
import { DocumentsService } from "../../../_services/documents.service";
import { MatDialog } from "@angular/material/dialog";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { RefserviceService } from "src/app/_services/refservice.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AddInTableDialogComponent } from "../../dialog/add-in-table-dialog/add-in-table-dialog.component";
import { AuthenticationService } from "src/app/_services";

@Component({
  selector: "app-currentrepair",
  templateUrl: "./currentrepair.component.html",
  styleUrls: ["./currentrepair.component.css"],
})
export class CurrentrepairComponent implements OnInit {

  permission: boolean = false;

  filterCells = [
    "year",
    "structure_element_id",
    "volume",
    "unit",
    "volume_cost",
    "executor",
  ];

  displayedColumns: any[];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  tepMenu: TepMenuItem[];
  tepFields: TepField[] = [];
  statuses: Statuses[] = [];

  house_id: number;
  tep_part: string;
  menuTitle: string;

  house_info: HouseInfo;

  settings$: Observable<GeneralSettings>;

  repairs: any[] = [];
  order: any[] = [];
  cellsCurrentRepairLists: any[];

  imageObject: Array<object> = [];

  selectedCell: number;
  oldSelectedCell: number;

  selectData: any = {
    type_work_id: "",
    material_id: "",
    structure_element_id: { data: [] },
  };

  filter: any = "p";
  oldData: any;
  filterYear: string = "";

  constructor(
    private common: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService,
    private apiFiles: DocumentsService,
    private api: CurrentrepairService,
    public dialog: MatDialog,
    private apiRS: RefserviceService,
    private _snackBar: MatSnackBar,
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.tepMenu = this.route.snapshot.data["tepMenu"];
    this.tepFields = this.route.snapshot.data["fields"];

    this.tep_part = this.route.snapshot.data["section"];
    this.house_id = this.route.snapshot.data["houseid"];

    this.settings$ = this.settings.settings$;

    this.route.url.subscribe((url) => {
      this.house_id = parseFloat(url[1].path);
      this.tep_part = url[2].path;

      this.common.getCommonInfo(this.house_id).subscribe((p) => {
        this.house_info = p;
      });

      this.common.getTepStatuses(this.house_id).subscribe((q) => {
        this.statuses = q;
      });

      this.apiFiles.getFileList(this.house_id).subscribe((p) => {
        p.filter((img) => img.isImage == true).forEach((img) => {
          let data = { image: "", thumbImage: "" };
          data.image = "data:image/jpeg;base64," + img.raw;
          data.thumbImage = "data:image/jpeg;base64," + img.raw;
          this.imageObject.push(data);
        });
      });

      const ref = zip(
        this.apiRS.getCurrRepairApiRefList("workType&per_page=-1"),
        this.apiRS.getMaterialList(),
        this.apiRS.getConstructionList()
      );

      ref.subscribe((p) => {
        this.selectData.type_work_id = p[0];
        this.selectData.material_id = p[1];
        this.selectData.structure_element_id.data = p[2]["data"].filter(
          (el) => el.parent !== null
        );
      });

      this.api.getCurrentRepairsList(this.house_id).subscribe((res) => {
        this.repairs = res.data;
        this.order = res.meta.order;
        this.cellsCurrentRepairLists = res.meta.labels;
        this.displayedColumns = this.filterCells;
        this.dataSource = new MatTableDataSource(
          res["data"].filter((data) => data["type"] == this.filter)
        );
        this.notify.emit(false);
      });
    });
    this.permission = !this.authService.hasRole('ROLE_CONFIRM_TEP');
  }

  isNotSelect(key): boolean {
    return (
      key != "type_work_id" &&
      key != "material_id" &&
      key != "structure_element_id"
    );
  }

  listElementValue(key, value) {
    try {
      if (Array.isArray(value[key]) && this.selectData[key].data.length) {
        let str = "";
        value[key].forEach((id) => {
          str += this.selectData[key].data.filter((elem) => elem.id == id)[0]
            ?.name;
          value[key].length > 1 ? (str += ", ") : null;
        });
        return str;
      } else if (value) {
        return this.selectData[key].data.filter(
          (elem) => elem.id == value[key]
        )[0]?.name;
      } else return "";
    } catch {
      console.log("Загрузка справочников");
    }
  }

  selectCell(id) {
    this.selectedCell = id;
    this.colorize(id);
  }

  addRow() {
    this.repairs.unshift({
      id: 0,
      house_id: this.house_id,
      type_work_id: [],
      year: null,
      owner_funds: "",
      budget_item: "",
      budget_funds: "",
      planned_volume: "",
      planned_volume_cost: "",
      executed_volume: "",
      executed_volume_cost: "",
      executor: "",
      entrances: "",
      floors: "",
      flats: "",
      old_id_guid: "",
      unit: "",
      volume: "",
      volume_cost: "",
      structure_element_id: undefined,
      material_id: undefined,
      type: this.filter,
    });
    this.dataSource = new MatTableDataSource(
      this.repairs.filter((data) => data.type == this.filter)
    );
    this.selectedCell = 0;
    this.selectCell(this.selectedCell);
    this.openDialog("add");
  }

  updateRow() {
    this.openDialog("update");
  }

  delRow() {
    this.api
      .deleteCurrentRepairsList(this.house_id, this.selectedCell)
      .subscribe(
        (p) => {
          this.repairs = this.repairs.filter(
            (repair) => repair.id != this.selectedCell
          );
          this.dataSource = new MatTableDataSource(
            this.repairs.filter((data) => data.type == this.filter)
          );
          this.selectedCell = null;
          this.oldSelectedCell = null;
          this._snackBar.open(`Данные успешно удалены`, undefined, {
            panelClass: "snackbar-success",
          });
        },
        (error) => {
          this._snackBar.open(`Ошибка`, undefined, {
            panelClass: "snackbar-error",
          });
        }
      );
  }

  openDialog(u) {
    let data = {};
    data["data"] = this.dataSource["data"].filter(
      (data) => data.id === this.selectedCell
    );
    data["data"] = data["data"][0];
    this.oldData = JSON.parse(JSON.stringify(data["data"]));
    data["header"] = "Сведения о текущем ремонте";
    data["filter"] = this.filter;
    data["labels"] = this.cellsCurrentRepairLists;
    data["selectData"] = JSON.parse(JSON.stringify(this.selectData));
    data["fwFields"] = [];
    data["requiredFields"] = ["type_work_id", "structure_element_id", "year"];
    data["order"] = this.order;
    const dialogRef = this.dialog.open(AddInTableDialogComponent, {
      data: data,
      disableClose: true,
      width: "1000px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "cancel") {
        this.repairs = this.repairs.filter((data) => data.id != 0);
        this.dataSource = new MatTableDataSource(
          this.repairs.filter((data) => data.type == this.filter)
        );
        this.selectedCell = this.selectedCell != 0 ? this.selectedCell : null;
        if (this.selectedCell) {
          this.repairs.forEach((data, i) => {
            if (data.id === this.selectedCell) {
              this.repairs[i] = this.oldData;
            }
          });
          this.dataSource = new MatTableDataSource(
            this.repairs.filter((data) => data.type == this.filter)
          );
        }
      } else if ((u = "update")) {
        if (!Number.isInteger(result.data.year)) {
          result.data.year = result.data.year
            ? String(result.data.year?.getFullYear())
            : "";
        }
        this.repairs.forEach((data) => {
          if (data.id === result.data.id) {
            data = result.data;
          }
        });
        this.dataSource = new MatTableDataSource(
          this.repairs.filter((data) => data.type == this.filter)
        );
        this.api.updateCurrentRepairsList(this.house_id, result.data).subscribe(
          (p) => {
            this.repairs.forEach((data) => {
              if (data.id === 0) {
                data.id = p["id"];
                this.selectedCell = p["id"];
              }
            });
            this.dataSource = new MatTableDataSource(
              this.repairs.filter((data) => data.type == this.filter)
            );
            this._snackBar.open(`Данные успешно обновлены`, undefined, {
              panelClass: "snackbar-success",
            });
          },
          (error) => {
            this.selectedCell = null;
            this._snackBar.open(`Ошибка`, undefined, {
              panelClass: "snackbar-error",
            });
            this.repairs = this.dataSource["data"].filter(
              (data) => data.id != 0
            );
            this.dataSource = new MatTableDataSource(
              this.repairs.filter((data) => data.type == this.filter)
            );
          }
        );
      }
    });
  }

  colorize(id) {
    try {
      if (this.oldSelectedCell) {
        if (this.oldSelectedCell != id) {
          document.getElementById(
            String(this.oldSelectedCell)
          ).style.background = "#ffffff";
        }
      }
      this.oldSelectedCell = id;
      if (document.getElementById(id)) {
        document.getElementById(id).style.background = "rgb(63 81 181 / 0.30)";
      }
    } catch { }
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

  filterTable($event) {
    this.selectedCell = null;
    this.filter = $event.value;
    this.dataSource = new MatTableDataSource(
      this.repairs.filter((repair) => repair.type == this.filter && repair.year.toString().indexOf(this.filterYear) !== -1)
    );
  }
  filterYaer(event: Event) {
    this.selectedCell = null;
    this.filterYear = (event.target as HTMLInputElement).value;;
    this.dataSource = new MatTableDataSource(
      this.repairs.filter((repair) => repair.year.toString().indexOf(this.filterYear) !== -1 && repair.type == this.filter)
    );
  }
}
