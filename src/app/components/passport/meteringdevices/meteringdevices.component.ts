import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { TeplistService } from "../../../_services/teplist.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { SettingsService } from "../../../_services/settings.service";
import { GeneralSettings } from "../../../_models/common";
import { MeteringDevices } from "../../../_models/tep";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-meteringdevices",
  templateUrl: "./meteringdevices.component.html",
  styleUrls: ["./meteringdevices.component.css"],
})
export class MeteringdevicesComponent implements OnInit {
  @Input() tepPart: string;
  @Input() house_id: number;
  @Input() menuTitle: string;

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  devices: any;

  constructor(
    private api: TeplistService,
    private settings: SettingsService,
    private _snackBar: MatSnackBar
  ) {}

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

  ngOnInit() {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);

    this.settings$ = this.settings.settings$;

    this.api.getMeteringDevices(this.house_id).subscribe((res) => {
      // Object.keys(res).forEach((key) => {
      //   if (res[key].attrs.length) {
      //     res[key].attrs = res[key].attrs.filter((elem) => elem.id != null);
      //   } else {
      //     Object.keys(res[key].children).forEach((chlnKey) => {
      //       res[key].children[chlnKey].attrs = res[key].children[
      //         chlnKey
      //       ].attrs.filter((elem) => elem.id != null);
      //     });
      //   }
      // });

      const formGroup = {};
      let element;
      this.devices = res;
      // освещение
      element = this.devices.electricity.children.lighting.attrs;
      formGroup["el1"] = new FormControl(element[0].value, undefined);
      formGroup["el2"] = new FormControl(element[1].value, undefined);
      formGroup["el3"] = new FormControl(element[2].value, undefined);
      formGroup["el4"] = new FormControl(element[3].value, undefined);
      // силовая нагрузка
      element = this.devices.electricity.children.power_load.attrs;
      formGroup["ep1"] = new FormControl(element[0].value, undefined);
      formGroup["ep2"] = new FormControl(element[1].value, undefined);
      formGroup["ep3"] = new FormControl(element[2].value, undefined);
      formGroup["ep4"] = new FormControl(element[3].value, undefined);
      //  ГВС
      element = this.devices.thermal_energy.children.heating.attrs;
      formGroup["teh1"] = new FormControl(element[0].value, undefined);
      formGroup["teh2"] = new FormControl(element[1].value, undefined);
      formGroup["teh3"] = new FormControl(element[2].value, undefined);
      formGroup["teh4"] = new FormControl(element[3].value, undefined);
      // отопление и вентиляция
      element = this.devices.thermal_energy.children.hot_water.attrs;
      formGroup["tehw1"] = new FormControl(element[0].value, undefined);
      formGroup["tehw2"] = new FormControl(element[1].value, undefined);
      formGroup["tehw3"] = new FormControl(element[2].value, undefined);
      formGroup["tehw4"] = new FormControl(element[3].value, undefined);
      // Вода холодная
      element = this.devices.cold_water.attrs;
      formGroup["cw1"] = new FormControl(element[0].value, undefined);
      formGroup["cw2"] = new FormControl(element[1].value, undefined);
      formGroup["cw3"] = new FormControl(element[2].value, undefined);
      formGroup["cw4"] = new FormControl(element[3].value, undefined);
      // Водоотведение
      element = this.devices.drainage.attrs;
      formGroup["d1"] = new FormControl(element[0].value, undefined);
      formGroup["d2"] = new FormControl(element[1].value, undefined);
      formGroup["d3"] = new FormControl(element[2].value, undefined);
      formGroup["d4"] = new FormControl(element[3].value, undefined);
      // Природный газ
      element = this.devices.gas.attrs;
      formGroup["g1"] = new FormControl(element[0].value, undefined);
      formGroup["g2"] = new FormControl(element[1].value, undefined);
      formGroup["g3"] = new FormControl(element[2].value, undefined);
      formGroup["g4"] = new FormControl(element[3].value, undefined);

      this.form = new FormGroup(formGroup);

      this.onChanges();
      this.notify.emit(false);
    });
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

  parse_float(number): number {
    return parseFloat(number.toString().replace(/,/g, "."));
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((val) => {
      // this.sumControlValues();
    });
  }

  onSubmit(form) {
    let result;
    result = this.printValue();

    if (this.form.invalid) {
      return;
    }

    this.api
      .postFieldSetData(this.house_id, this.tepPart, JSON.stringify(result))
      .pipe(first())
      .subscribe(
        (data) => {
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
        (error) => {
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
    if (this.devices) {
      // освещение
      this.devices.electricity.children.lighting.attrs[0].value = this.form.controls[
        "el1"
      ].value;
      this.devices.electricity.children.lighting.attrs[1].value = this.form.controls[
        "el2"
      ].value;
      this.devices.electricity.children.lighting.attrs[2].value = this.form.controls[
        "el3"
      ].value;
      this.devices.electricity.children.lighting.attrs[3].value = this.form.controls[
        "el4"
      ].value;

      // силовая нагрузка
      this.devices.electricity.children.power_load.attrs[0].value = this.form.controls[
        "ep1"
      ].value;
      this.devices.electricity.children.power_load.attrs[1].value = this.form.controls[
        "ep2"
      ].value;
      this.devices.electricity.children.power_load.attrs[2].value = this.form.controls[
        "ep3"
      ].value;
      this.devices.electricity.children.power_load.attrs[3].value = this.form.controls[
        "ep4"
      ].value;

      // //  ГВС
      this.devices.thermal_energy.children.heating.attrs[0].value = this.form.controls[
        "teh1"
      ].value;
      this.devices.thermal_energy.children.heating.attrs[1].value = this.form.controls[
        "teh2"
      ].value;
      this.devices.thermal_energy.children.heating.attrs[2].value = this.form.controls[
        "teh3"
      ].value;
      this.devices.thermal_energy.children.heating.attrs[3].value = this.form.controls[
        "teh4"
      ].value;

      // отопление и вентиляция
      this.devices.thermal_energy.children.hot_water.attrs[0].value = this.form.controls[
        "tehw1"
      ].value;
      this.devices.thermal_energy.children.hot_water.attrs[1].value = this.form.controls[
        "tehw2"
      ].value;
      this.devices.thermal_energy.children.hot_water.attrs[2].value = this.form.controls[
        "tehw3"
      ].value;
      this.devices.thermal_energy.children.hot_water.attrs[3].value = this.form.controls[
        "tehw4"
      ].value;

      // Вода холодная
      this.devices.cold_water.attrs[0].value = this.form.controls["cw1"].value;
      this.devices.cold_water.attrs[1].value = this.form.controls["cw2"].value;
      this.devices.cold_water.attrs[2].value = this.form.controls["cw3"].value;
      this.devices.cold_water.attrs[3].value = this.form.controls["cw4"].value;

      // Водоотведение
      this.devices.drainage.attrs[0].value = this.form.controls["d1"].value;
      this.devices.drainage.attrs[1].value = this.form.controls["d2"].value;
      this.devices.drainage.attrs[2].value = this.form.controls["d3"].value;
      this.devices.drainage.attrs[3].value = this.form.controls["d4"].value;

      // Природный газ
      this.devices.gas.attrs[0].value = this.form.controls["g1"].value;
      this.devices.gas.attrs[1].value = this.form.controls["g2"].value;
      this.devices.gas.attrs[2].value = this.form.controls["g3"].value;
      this.devices.gas.attrs[3].value = this.form.controls["g4"].value;
    }

    return this.devices;
  }
}
