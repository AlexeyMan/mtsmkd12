import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { RepairtableItem } from "../../../_models/tep";
import { TeplistService } from "../../../_services/teplist.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SettingsService } from "../../../_services/settings.service";
import { BehaviorSubject, Observable, zip } from "rxjs";
import { GeneralSettings } from "../../../_models/common";
import { first } from "rxjs/operators";
import { AppSettings } from "src/app/appSettings";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { RefserviceService } from "src/app/_services/refservice.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AddInTableDialogComponent } from "../../dialog/add-in-table-dialog/add-in-table-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { AuthenticationService } from "src/app/_services";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-simplerepair",
  templateUrl: "./simplerepair.component.html",
  styleUrls: ["./simplerepair.component.css"],
})
export class SimplerepairComponent implements OnInit {
  repairWorks = AppSettings.RepairWorks;

  // Добавить вид работ после repair_year
  displayedColumns = [
    // "id",
    "repair_year",
    "period",
    "structure_element_id",
    "work_volume",
    "measure_unit",
    "price",
  ];
  cellsCurrentRepairLists: any;
  dataSource: MatTableDataSource<any>;

  @Input() tepPart: string;
  @Input() house_id: number;
  @Input() menuTitle: string;

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  // repairs: RepairtableItem[];
  repairs: any;
  order: any;

  constructor(
    private api: TeplistService,
    private settings: SettingsService,
    private apiRS: RefserviceService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  // Form variables
  form = new FormGroup({});
  formSec = new FormGroup({});
  submitted = false;
  mainsubmitted = false;
  settings$: Observable<GeneralSettings>;
  userId$: Observable<any>;
  userId: any;
  items: any[] = [];
  filter: string = "rp";
  oldData: any;
  constructionList: any;
  workType: any;
  filterYear: string="";
  selectedCell: any = 0;
  oldSelectedCell: any = 0;
  selectData: any = {
    type_work_id: { data: [] },
    material_id: "",
    structure_element_id: { data: [] },
  };

  private saveFailSubject = new BehaviorSubject<boolean>(false);
  public saveFail$ = this.saveFailSubject.asObservable();

  private saveSuccessSubject = new BehaviorSubject<boolean>(false);
  public saveSuccess$ = this.saveSuccessSubject.asObservable();

  ngOnInit() {
    this.userId$ = this.authService.userId;
    this.userId$.subscribe((p) => (this.userId = p));

    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);

    this.settings$ = this.settings.settings$;

    this.route.url.subscribe((url) => {
      this.house_id = parseFloat(url[1].path);
      // this.tep_part = url[2].path;
    });

    this.api.getOverhaul(this.house_id).subscribe((res) => {
      console.log(res);
      this.repairs = res["data"];
      this.order = res["meta"].order;
      this.dataSource = new MatTableDataSource(
        res["data"].filter((data) => data.type == this.filter)
      );
      this.cellsCurrentRepairLists = res["meta"].labels;

      const ref = zip(
        this.apiRS.getCapRepairApiRefList(),
        this.apiRS.getMaterialList(),
        this.apiRS.getConstructionList()
      );

      ref.subscribe((p) => {
        this.selectData.type_work_id.data = p[0];
        this.selectData.material_id = p[1];
        this.selectData.structure_element_id.data = p[2]["data"].filter(
          (el) => el.parent !== null
        );
      });
      this.notify.emit(false);
    });
  }

  isNotSelect(key): boolean {
    return key != "type_work_id" && key != "structure_element_id";
  }

  selectCell(id) {
    this.selectedCell = id;
    this.colorize(id);
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
    } catch {}
  }

  addRow() {
    this.repairs.unshift({
      elevators: null,
      house_id: this.house_id,
      id: 0,
      measure_unit: "",
      old_id_giud: null,
      old_id_int: null,
      period: "",
      price: null,
      repair_year: null,
      type_work_id: [],
      structure_element_id: null,
      type: this.filter,
      user_id: this.userId,
      work_volume: null,
      note: null,
    });
    this.dataSource = new MatTableDataSource(
      this.repairs.filter((data) => data.type == this.filter)
    );
    this.selectedCell = 0;
    this.selectCell(this.selectedCell);
    this.openDialog("add");
  }

  openDialog(u) {
    let data = {};
    data["data"] = this.dataSource["data"].filter(
      (data) => data.id === this.selectedCell
    );
    data["data"] = data["data"][0];
    this.oldData = JSON.parse(JSON.stringify(data["data"]));
    data["header"] = "Сведения о капитальном ремонте";
    data["filter"] = this.filter;
    data["labels"] = this.cellsCurrentRepairLists;
    data["selectData"] = JSON.parse(JSON.stringify(this.selectData));
    data["fwFields"] = ["elevators", "note"];
    data["requiredFields"] = [
      "type_work_id",
      "structure_element_id",
      "repair_year",
    ];
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
        result.data.house_id = this.house_id;
        if (!Number.isInteger(result.data.repair_year)) {
          result.data.repair_year = result.data.repair_year
            ? String(new Date(result.data.repair_year).getFullYear())
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
        this.api.saveOverhaul(this.house_id, result.data).subscribe(
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

  updateRow() {
    this.openDialog("update");
  }

  delRow() {
    this.api.deleteOverhaul(this.house_id, this.selectedCell).subscribe(
      (res) => {
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

  filterTable($event) {
    this.selectedCell = null;
    this.filter = $event.value;
    this.dataSource = new MatTableDataSource(
      this.repairs.filter((repair) => repair.type == this.filter && repair.repair_year.indexOf(this.filterYear) !== -1)
    );
  }
  filterYaer(event: Event) {
    this.selectedCell = null;
    this.filterYear = (event.target as HTMLInputElement).value;
    this.dataSource = new MatTableDataSource(
      this.repairs.filter((repair) => repair.repair_year.indexOf(this.filterYear) !== -1 && repair.type == this.filter)
    );
  }
}
