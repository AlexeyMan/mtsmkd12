import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-add-in-table-dialog",
  templateUrl: "./add-in-table-dialog.component.html",
  styleUrls: ["./add-in-table-dialog.component.css"],
})
export class AddInTableDialogComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  newForm: FormGroup;

  filter: string;

  workData: any;
  materialData: any;

  ngOnInit(): void {
    const formGroup = {};

    Object.keys(this.data.data).forEach((key) => {
      formGroup[key] = new FormControl(this.data.data[key], undefined);
    });

    this.data.requiredFields.forEach((key) => {
      formGroup[key] = new FormControl(
        this.data.data[key],
        Validators.required
      );
    });
    this.workData = JSON.parse(
      JSON.stringify(this.data.selectData.type_work_id.data)
    );

    this.materialData = JSON.parse(
      JSON.stringify(this.data.selectData.material_id.data)
    );

    this.newForm = new FormGroup(formGroup);

    switch (this.data.filter) {
      case "rp":
        this.filter = "РПКР";
        break;
      case "kp":
        this.filter = "КПР РПКР";
        break;
      case "fact":
        this.filter = "Ф (факт)";
        break;
      case "p":
        this.filter = "План";
        break;
      case "f":
        this.filter = "Факт";
        break;
      default:
        this.filter = "";
        break;
    }
  }

  ngAfterViewInit() {
    if (this.data.data.structure_element_id) {
      this.filterData(
        { value: this.data.data.structure_element_id },
        "structure_element_id",
        false
      );
    }
  }

  get f() {
    return this.newForm.controls;
  }

  onSubmit(form) {
    if (this.newForm.invalid) {
      return;
    }
  }

  isMultiselect(value): boolean {
    return value == "Вид работ" || value == "Вид работы" || value == "Материал";
  }

  fwField(key) {
    return !!this.data["fwFields"].filter((field) => field == key).length;
  }

  isSelect(value): boolean {
    return (
      value != "Конструктивный элемент" &&
      value != "Вид работ" &&
      value != "Вид работы" &&
      value != "Материал" &&
      value != "мкд" &&
      value != "Old Id Guid" &&
      value != "Идентификатор ряда ведомости текущего ремонта" &&
      value != "Год проведения"
    );
  }

  filterData($event, key, init: boolean = true) {
    switch (key) {
      case "structure_element_id": {
        this.data.selectData.type_work_id.data = this.workData.filter(
          (work) => work.structural_element_id == $event.value
        );
        if (this.data.selectData.type_work_id.data.length) {
          if (init) {
            this.data.data.type_work_id = [];
            this.f.type_work_id.setValue([]);
          }
        }
        this.data.selectData.material_id.data = this.materialData.filter(
          (material) => material.structural_element_id == $event.value
        );
        if (this.data.selectData.material_id.data.length) {
          if (init) {
            this.data.data.material_id = [];
            this.f.material_id.setValue([]);
          }
        }
      }
    }
  }

  isDisabled(value): boolean {
    return (
      value != "Тип записи: План / Факт" &&
      value != "Плановый период ремонта" &&
      value != "User ID" &&
      value != "Тип записи: импорт из РП / из КП / создано вручную" &&
      value != "id старой системы (2-ой ключ)" &&
      value != "ID старой системы (1-ый ключ house_id)" &&
      value != "id дома" &&
      value != "ID" &&
      value != "мкд" &&
      value != "Old Id Guid" &&
      value != "Идентификатор ряда ведомости текущего ремонта"
    );
  }

  isDate(value): boolean {
    return value != "Год проведения";
  }
}
