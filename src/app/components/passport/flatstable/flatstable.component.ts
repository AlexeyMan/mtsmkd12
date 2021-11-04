import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Flatstable } from "../../../_models/tep";
import { TeplistService } from "../../../_services/teplist.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { SettingsService } from "../../../_services/settings.service";
import { GeneralSettings } from "../../../_models/common";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-flatstable",
  templateUrl: "./flatstable.component.html",
  styleUrls: ["./flatstable.component.scss"],
})
export class FlatstableComponent implements OnInit {
  @Input() tepPart: string;
  @Input() house_id: number;
  @Input() menuTitle: string;

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  indi: Flatstable;

  constructor(
    private api: TeplistService,
    private settings: SettingsService,
    private _snackBar: MatSnackBar
  ) { }

  // Form variables
  private error = "";
  settings$: Observable<GeneralSettings>;
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

  private ilpoSumSubject = new BehaviorSubject<number>(0);
  public ilpoSum$ = this.ilpoSumSubject.asObservable();

  private ilsoSumSubject = new BehaviorSubject<number>(0);
  public ilsoSum$ = this.ilsoSumSubject.asObservable();

  private itpoSumSubject = new BehaviorSubject<number>(0);
  public itpoSum$ = this.itpoSumSubject.asObservable();

  private itsoSumSubject = new BehaviorSubject<number>(0);
  public itsoSum$ = this.itsoSumSubject.asObservable();

  private clpoSumSubject = new BehaviorSubject<number>(0);
  public clpoSum$ = this.clpoSumSubject.asObservable();

  private clsoSumSubject = new BehaviorSubject<number>(0);
  public clsoSum$ = this.clsoSumSubject.asObservable();

  private ctpoSumSubject = new BehaviorSubject<number>(0);
  public ctpoSum$ = this.ctpoSumSubject.asObservable();

  private ctsoSumSubject = new BehaviorSubject<number>(0);
  public ctsoSum$ = this.ctsoSumSubject.asObservable();

  ngOnInit() {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);

    this.settings$ = this.settings.settings$;

    this.api.getLivingQuarters(this.house_id).subscribe((res) => {
      const formGroup = {};
      this.indi = res;

      for (const key of Object.keys(this.indi.individual)) {
        const element = this.indi.individual[key];
        formGroup["ifc" + String(key)] = new FormControl(
          element.flat_count,
          Validators.pattern("^\\d*$")
        );
        formGroup["ila" + String(key)] = new FormControl(
          element.living_area,
          Validators.pattern("^\\d*(\\,|\\.)?\\d+$")
        );
        formGroup["irc" + String(key)] = new FormControl(
          element.room_count,
          Validators.pattern("^\\d*$")
        );
        formGroup["ita" + String(key)] = new FormControl(
          element.total_area,
          Validators.pattern("^\\d*(\\,|\\.)?\\d+$")
        );
        formGroup["ilpo" + String(key)] = new FormControl(
          element.fla_privately_owned
        );
        formGroup["ilso" + String(key)] = new FormControl(
          element.fla_state_owned
        );
        formGroup["itpo" + String(key)] = new FormControl(
          element.fta_privately_owned
        );
        formGroup["itso" + String(key)] = new FormControl(
          element.fta_state_owned
        );
      }

      for (const key of Object.keys(this.indi.communal)) {
        const element = this.indi.communal[key];
        formGroup["cfc" + String(key)] = new FormControl(
          element.flat_count,
          Validators.pattern("^\\d*$")
        );
        formGroup["cla" + String(key)] = new FormControl(
          element.living_area,
          Validators.pattern("^\\d*(\\,|\\.)?\\d+$")
        );
        formGroup["crc" + String(key)] = new FormControl(
          element.room_count,
          Validators.pattern("^\\d*$")
        );
        formGroup["cta" + String(key)] = new FormControl(
          element.total_area,
          Validators.pattern("^\\d*(\\,|\\.)?\\d+$")
        );
        formGroup["clpo" + String(key)] = new FormControl(
          element.fla_privately_owned
        );
        formGroup["clso" + String(key)] = new FormControl(
          element.fla_state_owned
        );
        formGroup["ctpo" + String(key)] = new FormControl(
          element.fta_privately_owned
        );
        formGroup["ctso" + String(key)] = new FormControl(
          element.fta_state_owned
        );
      }

      formGroup["hostelLivingArea"] = new FormControl(
        // @ts-ignore
        this.indi.hostel.hostelLivingArea
      );
      formGroup["hostelTotalArea"] = new FormControl(
        // @ts-ignore
        this.indi.hostel.hostelTotalArea
      );

      formGroup["hostelRoomCount"] = new FormControl(
        // @ts-ignore
        this.indi.hostel.hostelRoomCount
      );

      formGroup["nonLivingRoomTotalArea"] = new FormControl(
        // @ts-ignore
        this.indi.otherCharacteristics.nonLivingRoomTotalArea
      );

      formGroup["nonLivingRoomCount"] = new FormControl(
        // @ts-ignore
        this.indi.otherCharacteristics.nonLivingRoomCount
      );

      this.form = new FormGroup(formGroup);

      this.onChanges();
      this.notify.emit(false);
    });
  }

  flaPrivatelyCalc(index, e) {
    let res =
      this.indi.individual[index].total_area -
      this.indi.individual[index]["fla_privately_owned"];

    this.indi.individual[1]["fla_state_owned"];
  }

  clearMessage() {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);
  }

  sumControlValues() {
    let sumifc = 0;
    let sumila = 0;
    let sumirc = 0;
    let sumita = 0;

    let sumilpo = 0;
    let sumilso = 0;
    let sumitpo = 0;
    let sumitso = 0;

    for (const key of Object.keys(this.indi.individual)) {
      sumifc += parseInt(this.form.get("ifc" + String(key)).value, 10);
      sumila += this.parse_float(this.form.get("ila" + String(key)).value);
      sumirc +=
        Number(key) < 7
          ? parseInt(this.form.get("ifc" + String(key)).value, 10) * Number(key)
          : parseInt(this.form.get("irc" + String(key)).value, 10);
      sumita += this.parse_float(this.form.get("ita" + String(key)).value);

      sumilpo += parseInt(this.form.get("ilpo" + String(key)).value, 10);
      sumilso += parseInt(this.form.get("ilso" + String(key)).value, 10);
      sumitpo += parseInt(this.form.get("itpo" + String(key)).value, 10);
      sumitso += parseInt(this.form.get("itso" + String(key)).value, 10);
    }

    this.itaSumSubject.next(sumita);
    this.ilaSumSubject.next(sumila);
    this.ircSumSubject.next(sumirc);
    this.ifcSumSubject.next(sumifc);

    this.ilpoSumSubject.next(sumilpo);
    this.ilsoSumSubject.next(sumilso);
    this.itpoSumSubject.next(sumitpo);
    this.itsoSumSubject.next(sumitso);

    let sumcfc = 0;
    let sumcla = 0;
    let sumcrc = 0;
    let sumcta = 0;

    let sumclpo = 0;
    let sumclso = 0;
    let sumctpo = 0;
    let sumctso = 0;

    for (const key of Object.keys(this.indi.communal)) {
      sumcfc += parseInt(this.form.get("cfc" + String(key)).value, 10);
      sumcla += this.parse_float(this.form.get("cla" + String(key)).value);
      sumcrc +=
        Number(key) < 7
          ? parseInt(this.form.get("cfc" + String(key)).value, 10) * Number(key)
          : parseInt(this.form.get("crc" + String(key)).value, 10);
      sumcta += this.parse_float(this.form.get("cta" + String(key)).value);

      sumclpo += parseInt(this.form.get("clpo" + String(key)).value, 10);
      sumclso += parseInt(this.form.get("clso" + String(key)).value, 10);
      sumctpo += parseInt(this.form.get("ctpo" + String(key)).value, 10);
      sumctso += parseInt(this.form.get("ctso" + String(key)).value, 10);
    }

    this.ctaSumSubject.next(sumcta);
    this.claSumSubject.next(sumcla);
    this.crcSumSubject.next(sumcrc);
    this.cfcSumSubject.next(sumcfc);

    this.clpoSumSubject.next(sumclpo);
    this.clsoSumSubject.next(sumclso);
    this.ctpoSumSubject.next(sumctpo);
    this.ctsoSumSubject.next(sumctso);
  }

  parse_float(number): number {
    return parseFloat(number.toString().replace(/,/g, "."));
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((val) => {
      this.sumControlValues();
    });
  }

  onSubmit(form) {
    const result = {};
    result["data"] = this.printValue();

    if (this.form.invalid) {
      return;
    }

    this.api
      .postFieldSetData(this.house_id, this.tepPart, JSON.stringify(result))
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(data);
          if (data["error"]) {
            // this.saveSuccessSubject.next(false);
            // this.saveFailSubject.next(true);
            this.error = data["error_message"];
            this._snackBar.open(data["error_message"], undefined, {
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
        (error) => {
          this.error = error;
          // this.saveFailSubject.next(true);
          // this.saveSuccessSubject.next(false);
          this._snackBar.open("Ошибка", undefined, {
            panelClass: "snackbar-error",
          });
        }
      );
  }

  private printValue(): Object {
    if (this.indi) {
      for (const key of Object.keys(this.indi.individual)) {
        const element = this.indi.individual[key];
        element.flat_count = this.form.controls["ifc" + String(key)].value;
        element.living_area = this.form.controls["ila" + String(key)].value;
        element.room_count = this.form.controls["irc" + String(key)].value;
        element.total_area = this.form.controls["ita" + String(key)].value;
        element.fla_privately_owned = this.form.controls[
          "ilpo" + String(key)
        ].value;
        element.fla_state_owned = this.form.controls[
          "ilso" + String(key)
        ].value;
        element.fta_privately_owned = this.form.controls[
          "itpo" + String(key)
        ].value;
        element.fta_state_owned = this.form.controls[
          "itso" + String(key)
        ].value;
      }

      for (const key of Object.keys(this.indi.communal)) {
        const element = this.indi.communal[key];
        element.flat_count = this.form.controls["cfc" + String(key)].value;
        element.living_area = this.form.controls["cla" + String(key)].value;
        element.room_count = this.form.controls["crc" + String(key)].value;
        element.total_area = this.form.controls["cta" + String(key)].value;
        element.fla_privately_owned = this.form.controls[
          "clpo" + String(key)
        ].value;
        element.fla_state_owned = this.form.controls[
          "clso" + String(key)
        ].value;
        element.fta_privately_owned = this.form.controls[
          "ctpo" + String(key)
        ].value;
        element.fta_state_owned = this.form.controls[
          "ctso" + String(key)
        ].value;
      }
      // @ts-ignore
      this.indi.hostel.hostelLivingArea = this.form.controls[
        "hostelLivingArea"
      ].value;
      // @ts-ignore
      this.indi.hostel.hostelTotalArea = this.form.controls[
        "hostelTotalArea"
      ].value;
      // @ts-ignore
      this.indi.hostel.hostelRoomCount = this.form.controls[
        "hostelRoomCount"
      ].value;
      // @ts-ignore
      this.indi.otherCharacteristics.nonLivingRoomTotalArea = this.form.controls[
        "nonLivingRoomTotalArea"
      ].value;
      // @ts-ignore
      this.indi.otherCharacteristics.nonLivingRoomCount = this.form.controls[
        "nonLivingRoomCount"
      ].value;
    }

    return this.indi;
  }

  changeRoomCount(key, affiliation, index) {
    // this[key][affiliation][index].room_count = flatCount * index;
    let flatCount = this[key][affiliation][index].flat_count;
    if (affiliation === "individual") {
      this.form.controls["irc" + index].setValue(
        Number(
          Number(this.form.controls["ifc" + index].value * index)
        )
      );
    } else {
      this.form.controls["crc" + index].setValue(
        Number(
          Number(this.form.controls["cfc" + index].value * index)
        )
      );
    }
  }

  changeField(key, index, fieldKey) {
    if (key === "indi") {
      let totalAreaIndi = this.indi.individual[index].total_area;
      let livingAreaIndi = this.indi.individual[index].living_area;
      switch (fieldKey) {
        case "fla_privately_owned":
          this.form.controls["ilso" + index].setValue(
            Number(
              totalAreaIndi - Number(this.form.controls["ilpo" + index].value)
            ).toFixed(2)
          );
          break;
        case "fla_state_owned":
          this.form.controls["ilpo" + index].setValue(
            Number(
              totalAreaIndi - Number(this.form.controls["ilso" + index].value)
            ).toFixed(2)
          );
          break;
        case "fta_privately_owned":
          this.form.controls["itso" + index].setValue(
            Number(
              livingAreaIndi - Number(this.form.controls["itpo" + index].value)
            ).toFixed(2)
          );
          break;
        case "fta_state_owned":
          this.form.controls["itpo" + index].setValue(
            Number(
              livingAreaIndi - Number(this.form.controls["itso" + index].value)
            ).toFixed(2)
          );
          break;
      }
    } else {
      let totalAreaCommunal = this.indi.communal[index].total_area;
      let livingAreaCommunal = this.indi.communal[index].living_area;
      switch (fieldKey) {
        case "fla_privately_owned":
          this.form.controls["clso" + index].setValue(
            Number(
              totalAreaCommunal -
              Number(this.form.controls["clpo" + index].value)
            ).toFixed(2)
          );
          break;
        case "fla_state_owned":
          this.form.controls["clpo" + index].setValue(
            Number(
              totalAreaCommunal -
              Number(this.form.controls["clso" + index].value)
            ).toFixed(2)
          );
          break;
        case "fta_privately_owned":
          this.form.controls["ctso" + index].setValue(
            Number(
              livingAreaCommunal -
              Number(this.form.controls["ctpo" + index].value)
            ).toFixed(2)
          );
          break;
        case "fta_state_owned":
          this.form.controls["ctpo" + index].setValue(
            Number(
              livingAreaCommunal -
              Number(this.form.controls["ctso" + index].value)
            ).toFixed(2)
          );
          break;
      }
    }
  }
}
