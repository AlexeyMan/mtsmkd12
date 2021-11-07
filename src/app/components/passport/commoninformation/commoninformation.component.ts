import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { TeplistService } from "../../../_services/teplist.service";
import { SettingsService } from "../../../_services/settings.service";
import { GeneralSettings } from "../../../_models/common";
import { BehaviorSubject, Observable } from "rxjs";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-commoninformation",
  templateUrl: "./commoninformation.component.html",
  styleUrls: ["./commoninformation.component.css"],
})
export class CommoninformationComponent implements OnInit {
  @Input() tepPart: string ="";
  @Input() house_id: number = -1;
  @Input() menuTitle: string="";

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  isSticky: boolean = false;

  @HostListener("window:scroll", ["$event"])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 450;
  }

  data: any;
  oldData: any;
  rotation: any;

  constructor(
    private api: TeplistService,
    private settings: SettingsService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  // Form variables
  private error = "";
  settings$: Observable<GeneralSettings> | undefined;
  form = new FormGroup({});

  private saveFailSubject = new BehaviorSubject<boolean>(false);
  public saveFail$ = this.saveFailSubject.asObservable();

  private saveSuccessSubject = new BehaviorSubject<boolean>(false);
  public saveSuccess$ = this.saveSuccessSubject.asObservable();

  private ifcSumSubject = new BehaviorSubject<number>(0);
  public ifcSum$ = this.ifcSumSubject.asObservable();

  private ilaSumSubject = new BehaviorSubject<number>(0);
  public ilaSum$ = this.ilaSumSubject.asObservable();

  private ircSumSubject = new BehaviorSubject<number>(0);
  public ircSum$ = this.ircSumSubject.asObservable();

  private itaSumSubject = new BehaviorSubject<number>(0);
  public itaSum$ = this.itaSumSubject.asObservable();

  private cfcSumSubject = new BehaviorSubject<number>(0);
  public cfcSum$ = this.cfcSumSubject.asObservable();

  private claSumSubject = new BehaviorSubject<number>(0);
  public claSum$ = this.claSumSubject.asObservable();

  private crcSumSubject = new BehaviorSubject<number>(0);
  public crcSum$ = this.crcSumSubject.asObservable();

  private ctaSumSubject = new BehaviorSubject<number>(0);
  public ctaSum$ = this.ctaSumSubject.asObservable();

  sumField1: any;
  sumField2: any;
  sumField3: any;

  sumField4: any;
  sumField5: any;
  sumField6: any;

  livingQuarters: any;

  ngOnInit() {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);

    this.settings$ = this.settings.settings$;
    this.api.getCommonParametersById(String(this.house_id)).subscribe((res:any) => {
      const formGroup:any = {};
      this.data = res["subsections"];
      this.rotation = res["order"];
      this.oldData = JSON.parse(
        JSON.stringify(res["subsections"].infos.fields)
      );

      Object.keys(this.data).forEach((key) => {
        this.data[key].fields.forEach((field:any) => {
          formGroup[field.key] = new FormControl(field.value, undefined);
        });
      });

      this.form = new FormGroup(formGroup);

      this.onChanges();
      this.notify.emit(false);
    });

    this.route.url.subscribe((url) => {
      this.house_id = parseFloat(url[1].path);
    });

    this.api.getCleaningAreas(this.house_id).subscribe((res:any) => {
      this.sumField1 = res.find(
        (elem:any) =>
          elem.attr_caption === "Уборочная площадь лестничных маршей и площадок"
      ).attr_value;
      this.sumField2 = res.find(
        (elem:any) =>
          elem.attr_caption ===
          "Уборочная площадь коридоров мест общего пользования"
      ).attr_value;
      this.sumField3 = res.find(
        (elem:any) => elem.attr_caption === "Всего"
      ).attr_value;
    });
    this.api.getLivingQuarters(this.house_id).subscribe((res:any) => {
      this.livingQuarters = res;
      this.sumField4 = res["hostel"].hostelTotalArea;
      this.sumField5 = Object.values(res["individual"])
        .map((t:any) => t.total_area)
        .reduce((acc, value) => Number(acc) + Number(value), 0);

      this.sumField6 = Object.values(res["communal"])
        .map((t:any) => t.total_area)
        .reduce((acc, value) => Number(acc) + Number(value), 0);
    });
  }

  isSum(name: string, key: string) {
    return (
      name == "Общая площадь дома" ||
      name == "Площадь жилых помещений" ||
      name == "Площадь нежилых помещений функционального назначения" ||
      key == "living_building_area_privately_owned" ||
      key == "living_building_area_state_owned"
    );
  }

  diffPercent(a: number, i: string) {
    if (i.search("year") == -1) {
      let oldVal = this.oldData.find((p: { key: string; }) => p.key == i);
      if (Number(oldVal.value)) {
        if (oldVal.value * 0.9 > a || oldVal.value * 1.1 < a) {
          document.getElementById(i)!.style.display = "inherit";
        } else document.getElementById(i)!.style.display = "none";
      }
    }
  }

  sum(name: string, fieldKey: string | null, key: string):any {
    let elems:any = this.data[key].fields;
    switch (name) {
      case "Общая площадь дома": {
        return (
          Number(this.sum("Площадь жилых помещений", null, "infos")) +
          Number(elems[8].value) +
          Number(this.sumField1) +
          Number(this.sumField2) +
          Number(this.sumField3)
        ).toFixed(2);
      }
      case "Площадь жилых помещений": {
        return (
          Number(this.sumField6) +
          Number(this.sumField5) +
          Number(this.sumField4)
        ).toFixed(2);
      }
      // case "Площадь нежилых помещений функционального назначения": {
      //   this.form.controls["non_living_building_area"].setValue(
      //     Number(
      //       this.data[key].fields.filter(
      //         (el) =>
      //           el.name ===
      //           "Площадь нежилых помещений функционального назначения"
      //       )[0].value
      //     ).toFixed(2)
      //   );
      // }
      case "В частной собственности": {
        if (fieldKey === "living_building_area_privately_owned") {
          // общая жилая
          if (this.livingQuarters) {
            let sumIndividual = Object.values(this.livingQuarters["individual"])
              .map((t:any) => t["fta_privately_owned"])
              .reduce((acc, value) => Number(acc) + Number(value), 0);

            let sumCommunal = Object.values(this.livingQuarters["communal"])
              .map((t:any) => t["fta_privately_owned"])
              .reduce((acc, value) => Number(acc) + Number(value), 0);
            this.form.controls["living_building_area_privately_owned"].setValue(
              Number(sumIndividual + sumCommunal).toFixed(2)
            );
          }

          return;
        } else {
          // пл. нежилых

          // debugger

          // let nonLivingBuildingArea = Number(
          //   elems.find((el) => el.key === "non_living_building_area").value
          // );

          // this.form.controls["nlba_state_owned"].setValue(
          //   Number(Number(nonLivingBuildingArea - Number(this.form.controls["nlba_privately_owned"].value)).toFixed(2)).toFixed(2)
          // );
          return;
        }
      }
      case "В государственной собственности": {
        if (fieldKey === "living_building_area_state_owned") {
          // общая жилая
          if (this.livingQuarters) {
            // S11 – Итого Отд. квартиры всего ГОС
            let sumIndividual = Object.values(this.livingQuarters["individual"])
              .map((t:any) => t["fta_state_owned"])
              .reduce((acc, value) => Number(acc) + Number(value), 0);
            // S31 – Итого Ком. квартиры всего ГОС
            let sumCommunal = Object.values(this.livingQuarters["communal"])
              .map((t:any) => t["fta_state_owned"])
              .reduce((acc, value) => Number(acc) + Number(value), 0);
            // S5 – Общая пл. общежитий
            let communal = this.livingQuarters["hostel"].hostelTotalArea;

            this.form.controls["living_building_area_state_owned"].setValue(
              Number(sumIndividual + sumCommunal + communal).toFixed(2)
            );
          }
          return;
        } else {
          // пл. нежилых

          // debugger

          // let nonLivingBuildingArea = Number(
          //   elems.find((el) => el.key === "non_living_building_area").value
          // );

          // this.form.controls["nlba_privately_owned"].setValue(
          //   Number(
          //     nonLivingBuildingArea -
          //       Number(this.form.controls["nlba_state_owned"].value)
          //   ).toFixed(2)
          // );
          return;
        }
      }
    }
  }

  changeField(key: string | number, fieldKey: any) {
    let elems = this.data[key].fields;
    let nonLivingBuildingArea = Number(
      elems.find((el: { key: string; }) => el.key === "non_living_building_area").value
    );
    switch (fieldKey) {
      case "nlba_privately_owned":
        this.form.controls["nlba_state_owned"].setValue(
          Number(
            nonLivingBuildingArea -
              Number(this.form.controls["nlba_privately_owned"].value)
          ).toFixed(2)
        );
        break;
      case "nlba_state_owned":
        this.form.controls["nlba_privately_owned"].setValue(
          Number(
            nonLivingBuildingArea -
              Number(this.form.controls["nlba_state_owned"].value)
          ).toFixed(2)
        );
        break;
    }
  }

  clearMessage() {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);
  }

  sumControlValues(n1: number, n2: number): number {
    let sum =
      Number(this.form.controls[n1].value) +
      Number(this.form.controls[n2].value);
    return sum;
  }

  parse_float(number:any): number {
    return parseFloat(number.toString().replace(/,/g, "."));
  }

  onChanges(): void {
    // this.form.valueChanges.subscribe((val) => {
    //   // this.sumControlValues();
    // });
  }

  onSubmit(form: any) {
    let result;
    result = this.printValue();

    if (this.form.invalid) {
      return;
    }

    this.api
      .postFieldSetData(this.house_id, this.tepPart, JSON.stringify(result))
      .pipe()
      .subscribe(
        (data:any) => {
          if (data["error"]) {
            // this.saveSuccessSubject.next(false);
            // this.saveFailSubject.next(true);
            // this.error = data["error_message"];
            this._snackBar.open("Ошибка", undefined, {
              panelClass: "snackbar-error",
            });
          } else {
            // this.saveSuccessSubject.next(true);
            // this.saveFailSubject.next(false);
            this._snackBar.open("Успешно", undefined, {
              panelClass: "snackbar-success",
            });
          }
        },
        (error:any) => {
          // this.error = error;
          // this.saveFailSubject.next(true);
          // this.saveSuccessSubject.next(false);
          this._snackBar.open("Ошибка", undefined, {
            panelClass: "snackbar-error",
          });
        }
      );
  }

  private printValue(): Object {
    let rez:any = {};
    if (this.data) {
      Object.keys(this.data).forEach((key) => {
        this.data[key].fields.forEach((field:any) => {
          field.value = this.form.controls[field.key].value;
          rez[field.key] = this.form.controls[field.key].value;
        });
      });
    }
    return { data: rez };
  }
}
