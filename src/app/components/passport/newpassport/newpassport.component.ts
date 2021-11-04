import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { TeplistService } from "../../../_services/teplist.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable } from "rxjs";
import { ListFilter } from "../../../_models/filters";
import { SettingsService } from "../../../_services/settings.service";
import { GeneralSettings, Street } from "../../../_models/common";
import { CommonService } from "../../../_services/common.service";
import { ActivatedRoute } from "@angular/router";
import { DepartmentListEntry } from "../../../_models/admin";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthenticationService } from "src/app/_services";

const outstreets: Street[] = [
  { id: 1, name: "Все", street_name_old: "" },
  { id: 2, name: "Все", street_name_old: "" },
];

@Component({
  selector: "app-newpassport",
  templateUrl: "./newpassport.component.html",
  styleUrls: ["./newpassport.component.scss"],
})
export class NewpassportComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: TeplistService,
    private formBuilder: FormBuilder,
    private settings: SettingsService,
    private common: CommonService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<any>,
    private _snackBar: MatSnackBar
  ) {
    this.common.getStreetsByDistrict([]).subscribe((p) => {
      this.allstreets = p;
    });
  }

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  filters: ListFilter;
  submitted = false;
  newForm: FormGroup;
  private sendingFailSubject = new BehaviorSubject<boolean>(false);
  public sendingFail$ = this.sendingFailSubject.asObservable();

  private sendingSuccessSubject = new BehaviorSubject<boolean>(false);
  public sendingSuccess$ = this.sendingSuccessSubject.asObservable();

  private error = "";
  settings$: Observable<GeneralSettings>;
  allstreets: Street[] = outstreets;
  alldepartments: DepartmentListEntry[];
  selectedDistricts = [];
  selectedStreet = [];
  selectedDepartments = [];
  modified = false;

  ngOnInit() {
    this.sendingFailSubject.next(false);
    this.settings$ = this.settings.settings$;
    this.filters = this.data["filters"];
    this.alldepartments = this.data["alldepartments"];
    this.newForm = this.formBuilder.group({
      number: ["", Validators.required],
      streets: ["", Validators.required],
      districts: ["", Validators.required],
      departments: ["", Validators.required],
      building: [""],
      letter: [""],
      construction: [""],
    });
  }

  get f() {
    return this.newForm.controls;
  }

  clearMessage() {
    this.sendingSuccessSubject.next(false);
    this.sendingFailSubject.next(false);
  }

  onSubmit() {
    this.submitted = true;

    if (this.newForm.invalid) {
      return;
    }

    this.api
      .addTep(
        this.f.departments.value,
        this.f.districts.value,
        this.f.streets.value,
        this.f.number.value,
        this.f.building.value,
        this.f.letter.value,
        this.f.construction.value
      )
      .pipe()
      .subscribe(
        (data) => {
          if (data["error"] !== true) {
            // this.sendingFailSubject.next(false);
            // this.sendingSuccessSubject.next(true);
            this.modified = true;
            this._snackBar.open("Запись успешно создана", undefined, {
              panelClass: "snackbar-success",
            });
            this.dialogRef.close(true);
          } else {
            // this.error = data["message"];
            // this.sendingFailSubject.next(true);
            // this.sendingSuccessSubject.next(false);
            this._snackBar.open("Ошибка создания записи", undefined, {
              panelClass: "snackbar-error",
            });
          }
        },
        (error) => {
          this.error = error;
          console.log(this.error);
          this.sendingFailSubject.next(true);
          this.sendingSuccessSubject.next(false);
        }
      );
  }

  districtChange($event) {
    this.selectedDistricts = [];

    this.selectedDistricts.push($event.value);

    this.common.getStreetsByDistrict(this.selectedDistricts).subscribe((p) => {
      this.allstreets = p;
    });
  }

  dismissAlerts() {
    this.sendingFailSubject.next(false);
    this.sendingSuccessSubject.next(false);
    if (this.modified) {
      this.notify.emit(this.modified);
    }
  }
}
