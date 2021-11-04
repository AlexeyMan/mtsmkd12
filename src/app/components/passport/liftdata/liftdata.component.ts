import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, zip } from "rxjs";
import { TeplistService } from "../../../_services/teplist.service";
import { SettingsService } from "../../../_services/settings.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {MatPaginator} from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from "../../dialog/delete-tep-dialog/delete-tep-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { GeneralSettings } from "../../../_models/common";

export interface PeriodicElement {
  registrationNum: string;
  floorCount: number;
  stairway: number;
  stopCount: number;
  buildDate: Date;
  liftType: string;
  engineType: string;
  housingServiceName: string;
  damage: number;
  decommissionDate: Date;
  rebuildDate: Date;
  modernizationDate: Date;
  doorType: string;
  id: number;
}

/**
 * @title Table with selection
 */
@Component({
  selector: "app-lift-data",
  templateUrl: "./liftdata.component.html",
  styleUrls: ["./liftdata.component.scss"],
})
export class LiftData implements OnInit {
  @Input() tepPart: string;
  @Input() house_id: number;
  @Input() menuTitle: string;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  // tslint:disable-next-line:no-inferrable-types
  mergeLevel: number = 22;
  constructor(
    public dialog: MatDialog,
    private api: TeplistService,
    private settings: SettingsService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
  ) { }
  displayedColumns: string[] = ['select', 'registrationNum', 'floorCount', 'stairway', 'stopCount', 'buildDate', 'liftType', 'engineType', 'housingServiceName', 'damage', 'editBtn'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  selection = new SelectionModel<PeriodicElement>(true, []);
  editForm: FormGroup; 
  registrationNum: string;
  floorCount: number = 5;
  stairway: number;
  stopCount: number;
  buildDate:Date;
  liftType: string;
  engineType: string;
  housingServiceName: string;
  damage: number;
  decommissionDate:Date;
  rebuildDate: Date;
  modernizationDate: Date;
  doorType: string;
  listLiftType: Array<Object> = [];
  listDoorType: Array<Object> = [];
  listShaftType: Array<Object> = [];
  listEngineType: Array<Object> = [];
  listDespatcherType: Array<Object> = [];
  dispatcherType: string;
  shaftType: string;
  dispatcherServiceName: string;
  remark: string;
  submitted = false;
  dataRep:any = [];
  arrTypeLift: any = [];
  textEditForm: string = "Добавление";
  loading: boolean = true;
  liftId: number;
  onFirstClick = false;
  settings$: Observable<GeneralSettings>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  paginationInit(){
    setTimeout(() => this.dataSource.paginator = this.paginator);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.clear();
    this.selection.select(...this.dataSource.data);
  }

  addColumn() {
    this.displayedColumns.push('editBtn');
  }

  removeColumn() {
    if (this.displayedColumns.length) {
      this.displayedColumns.pop();
    }
  }
  
  ngOnInit() {
    this.settings$ = this.settings.settings$;
    this.settings$.subscribe((p) => {
      if (p.canEdit) {
        if(!this.displayedColumns.find(el=>el === 'editBtn')){
          this.addColumn();
        }
      } else {
        this.removeColumn();
      }
    });
    this.initPage();
    this.editForm = this.formBuilder.group({
      registrationNum: new FormControl(this.registrationNum, [
        Validators.maxLength(10),
        Validators.minLength(1),
        Validators.required,
      ]),
      floorCount: new FormControl(this.floorCount, [
        Validators.maxLength(3),
        Validators.pattern("^[1-9][0-9]*"),
        Validators.minLength(1),
        Validators.required,
      ]),
      stairway: new FormControl(this.stairway, [
        Validators.maxLength(3),
        Validators.pattern("^[1-9][0-9]*"),
        Validators.minLength(1),
        Validators.required,
      ]),
      stopCount: new FormControl(this.stopCount, [
        Validators.maxLength(3),
        Validators.pattern("^[1-9][0-9]*"),
        Validators.minLength(1),
        Validators.required,
      ]),
      buildDate: new FormControl(this.buildDate, [
        Validators.minLength(1),
        Validators.required,
      ]),
      liftType: new FormControl(this.liftType, [
        Validators.required,
      ]),
      housingServiceName: new FormControl(this.housingServiceName, []),
      damage: new FormControl(this.damage, [
        Validators.pattern('^(0|[1-9][0-9]{0,2})([.][0-9]{0,2})?$'),
      ]),
      decommissionDate: new FormControl(this.decommissionDate, []),
      rebuildDate: new FormControl(this.rebuildDate, []),
      modernizationDate: new FormControl(this.modernizationDate, []),
      doorType: new FormControl(this.doorType, [
        Validators.minLength(1),
        Validators.required,
      ]),
      shaftType: new FormControl(this.shaftType, [
        Validators.minLength(1),
        Validators.required,
      ]),
      engineType: new FormControl(this.engineType, [
        Validators.minLength(1),
        Validators.required,
      ]),
      dispatcherType: new FormControl(this.dispatcherType, []),
      dispatcherServiceName: new FormControl(this.dispatcherServiceName, []),
      remark: new FormControl(this.remark, []),
    });
  }

  initPage(){
    zip(
      this.api.getLiftData(this.house_id),
      this.api.getLiftType()
    ).subscribe((p) => {
      this.loading = false;
      this.notify.emit(false);
      this.arrTypeLift = Object.entries(p[1]);
      this.dataRep = p[0];
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.dataRep);
    this.arrTypeLift.forEach(element => {
      const addType = Object.entries(element[1]).map(([value, name]) => ({value,name,}));
      switch (element[0]) {
        case 'liftType': return this.listLiftType = addType;
        case 'doorType': return this.listDoorType = addType;
        case 'shaftType': return this.listShaftType = addType;
        case 'engineType': return this.listEngineType = addType;
        case 'dispatcherType': return this.listDespatcherType = addType;
        default: return [];
        } 
      });
      this.paginationInit();
    });
  }

  get fe() {
    return this.editForm.controls;
  }

  deleteTep(id: number) {
    let data = {
      header: "Удаление лифтового оборудования",
      message: "Вы действительно хотите удалить данные по лифтовому оборудованию?",
    };
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: data,
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api.deleteLift(id,this.house_id).subscribe(
          (res) => {
            this._snackBar.open("Запись успешно удалена", undefined, {
              panelClass: "snackbar-success",
            });
            this.initPage();
          },
          (error) => {
            this._snackBar.open("Ошибка удаления записи", undefined, {
              panelClass: "snackbar-error",
            });
          }
        );
      }
    });
  }

  removeLifts(){
    let requstId = {"ids":[]};
    if(this.selection.selected.length != 0){
    let selectLifts = (this.selection.selected).map((el)=> {return el.id})
     requstId.ids = selectLifts;     
    let data = {
      header: "Удаление лифтового оборудования",
      message: "Вы действительно хотите удалить данные по лифтовому оборудованию?",
    };
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: data,
      width: "500px",
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          this.api.deleteAllSelectLift(requstId ,this.house_id).subscribe(
            (res) => {
              this._snackBar.open("Данные успешно удалены", undefined, {
                panelClass: "snackbar-success",
              });
              this.selection.clear();
              this.initPage();
            },
            (error) => {
              this._snackBar.open("Ошибка удаления данных", undefined, {
                panelClass: "snackbar-error",
              });
            }
          );
        }
      });
    }
  }

  openDialog(){
    this.onFirstClick = false;
    this.textEditForm = "Добавление";
    this.editForm.reset();
    this.submitted = false;
    this.fe.liftType.setErrors(null);
    this.fe.doorType.setErrors(null);
    this.fe.shaftType.setErrors(null);
    this.fe.engineType.setErrors(null);
  }

  openEditDialog(el){
    this.onFirstClick = false;
    this.fe.liftType.setErrors(null);
    this.fe.doorType.setErrors(null);
    this.fe.shaftType.setErrors(null);
    this.fe.engineType.setErrors(null);
    this.textEditForm = "Редактирование";
    this.submitted = false;
    this.editForm.setValue({
      registrationNum: el.registrationNum,
      floorCount: el.floorCount,
      stairway: el.stairway,
      stopCount: el.stopCount,
      damage: el.damage,
      liftType: String(el.liftType == 0 ? "" : el.liftType),
      doorType: String(el.doorType == 0 ? "" : el.doorType),
      shaftType: String(el.shaftType == 0 ? "" : el.shaftType),
      engineType: String(el.engineType == 0 ? "" : el.engineType),
      buildDate: el.buildDate,
      decommissionDate: el.decommissionDate,
      rebuildDate: el.rebuildDate,
      modernizationDate: el.modernizationDate,
      dispatcherType:  String(el.dispatcherType == 0 ? "" : el.dispatcherType),
      dispatcherServiceName: el.dispatcherServiceName,
      housingServiceName: el.housingServiceName,
      remark: el.remark,
    });
    this.liftId = el.id;
    document.getElementById("openDialog").click();
  }

  rundata(e){
    return new Date(e).toLocaleDateString();
  }

  onEditSubmit(){
    this.submitted = true;
    this.fe.liftType.updateValueAndValidity();
    this.fe.doorType.updateValueAndValidity();
    this.fe.shaftType.updateValueAndValidity();
    this.fe.engineType.updateValueAndValidity();
    let setLift = {
      "registrationNum": this.fe.registrationNum.value,
      "floorCount": this.fe.floorCount.value,
      "stairway": this.fe.stairway.value,
      "stopCount": this.fe.stopCount.value,
      "buildDate": this.fe.buildDate.value,
      "rebuildDate": this.fe.rebuildDate.value,
      "shaftType": Number(this.fe.shaftType.value),
      "dispatcherType": Number(this.fe.dispatcherType.value),
      "dispatcherServiceName": this.fe.dispatcherServiceName.value,
      "housingServiceName": this.fe.housingServiceName.value,
      "remark": this.fe.remark.value,
      "damage": this.fe.damage.value,
      "decommissionDate": this.fe.decommissionDate.value,
      "modernizationDate": this.fe.modernizationDate.value,
      "liftType": Number(this.fe.liftType.value),
      "doorType": Number(this.fe.doorType.value),
      "engineType": Number(this.fe.engineType.value),
    }
   
    if (!this.editForm.invalid && this.onFirstClick == false) {
      this.onFirstClick = true;
      document.getElementById("btnClose").click();
      setTimeout( function() {
        this.onFirstClick = false;
    }, 1000 );
      if(this.textEditForm == "Добавление"){
        this.addLift(setLift);
      }
      if(this.textEditForm == "Редактирование"){
        this.editLift(setLift);
      }
    }
  };

  addLift(setLift){
    this.api.addLift(setLift ,this.house_id).subscribe(
      (res) => {
        this._snackBar.open("Запись успешно добавленна", undefined, {
          panelClass: "snackbar-success",
        });
        this.initPage();
      },
      (error) => {
        this._snackBar.open("Ошибка добавления записи", undefined, {
          panelClass: "snackbar-error",
        });
      }
    );
  }

  editLift(setLift){
    this.api.editLift(setLift ,this.house_id, this.liftId).subscribe(
      (res) => {
        this._snackBar.open("Запись успешно отредактирована", undefined, {
          panelClass: "snackbar-success",
        });
        this.initPage();
      },
      (error) => {
        this._snackBar.open("Ошибка редактирования записи", undefined, {
          panelClass: "snackbar-error",
        });
      }
    );
  }

  exportExcel(){
    this.api.exportExcelLift(this.house_id).subscribe(
      (res) => {
        this._snackBar.open("Успешно", undefined, {
          panelClass: "snackbar-success",
        });
        // console.log("start download:", res);
        const url = window.URL.createObjectURL(res);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none");
        a.href = url;
        a.download = "Лифты.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      (error) => {
        this._snackBar.open("Ошибка", undefined, {
          panelClass: "snackbar-error",
        });
        console.log("download error:", JSON.stringify(error));
      }
      );
    }
  validData(e){
    return e.invalid && e.errors && (this.submitted || (e.touched || e.dirty)) 
  }
}

