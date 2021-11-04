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
import { MatSnackBar } from "@angular/material/snack-bar";
import { TechstateService } from "src/app/_services/techstate.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-passport-page",
  templateUrl: "./passport-page.component.html",
  styleUrls: ["./passport-page.component.css"],
})
export class PassportPageComponent implements OnInit {
  @Input() tepPart: string;
  @Input() house_id: number;
  @Input() menuTitle: string;
  @Input() url: string;

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  isSticky: boolean = false;

  @HostListener("window:scroll", ["$event"])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 450;
  }

  data: any;
  rotation: any;

  constructor(
    private api: TeplistService,
    private apiDefect: TechstateService,
    private settings: SettingsService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) { }

  // Form variables
  private error = "";
  settings$: Observable<GeneralSettings>;
  form = new FormGroup({});

  basementArea: any;

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
    this.api.getTepPageData(this.house_id, this.url).subscribe((res) => {
      const formGroup = {};
      this.data = res["subsections"];
      this.rotation = res["order"];

      Object.keys(this.data).forEach((key) => {
        this.data[key].fields.forEach((field) => {
          formGroup[field.key] = new FormControl(field.value, undefined);
        });
      });

      this.form = new FormGroup(formGroup);

      this.onChanges();
      this.notify.emit(false);
    });
    if (this.url === "basements-walls-floors") {
      this.apiDefect.getDefectList(this.house_id, 23210).subscribe((res) => {
        // @ts-ignore
        this.basementArea = res[1].childs[1].childs[0].size
      })
    }
  }

  goToAct() {
    this.router.navigate(["mkd", this.house_id, "techstate", 23210], { queryParams: { open: 969792 } });
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
      .pipe()
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
    let rez = {};
    if (this.data) {
      Object.keys(this.data).forEach((key) => {
        this.data[key].fields.forEach((field) => {
          field.value = this.form.controls[field.key].value;
          rez[field.key] = this.form.controls[field.key].value;
        });
      });
    }
    return { data: rez };
  }

  isSum(name) {
    if (this.url === "external-finishing") {
      return (
        name == "Площадь фасада" ||
        name == "Площадь штукатурки" ||
        name == "Площадь облицовки" ||
        name == "Площадь фактурных и окрасочных слоев"
      );
    } else if (this.url === "improvement-playgrounds") {
      return (name == "Асфальтобетонные покрытия");
    }
  }

  // diffPercent(a, i) {
  //   if (i.search("year") == -1) {
  //     let oldVal = this.oldData.find((p) => p.key == i);
  //     if (Number(oldVal.value)) {
  //       if (oldVal.value * 0.9 > a || oldVal.value * 1.1 < a) {
  //         document.getElementById(i).style.display = "inherit";
  //       } else document.getElementById(i).style.display = "none";
  //     }
  //   }
  // }

  sum(name, key) {
    let elems = this.data[key].fields;
    if (this.url === "external-finishing") {
      switch (name) {
        case "Площадь фасада": {
          return (
            Number(
              elems.find((el) => el.name === "Площадь лицевого фасада").value
            ) +
            Number(
              elems.find((el) => el.name === "Площадь дворового фасада").value
            ) +
            Number(
              elems.find((el) => el.name === "Площадь торцевого фасада").value
            )
          ).toFixed(2);
        }
        case "Площадь штукатурки": {
          return (
            Number(
              elems.find(
                (el) => el.name === "Площадь штукатурки лицевого фасада"
              ).value
            ) +
            Number(
              elems.find(
                (el) => el.name === "Площадь штукатурки дворового фасада"
              ).value
            ) +
            Number(
              elems.find(
                (el) => el.name === "Площадь штукатурки торцевого фасада"
              ).value
            )
          ).toFixed(2);
        }
        case "Площадь облицовки": {
          return (
            Number(
              elems.find(
                (el) => el.name === "Площадь облицовки лицевого фасада"
              ).value
            ) +
            Number(
              elems.find(
                (el) => el.name === "Площадь облицовки дворового фасада"
              ).value
            ) +
            Number(
              elems.find(
                (el) => el.name === "Площадь облицовки торцевого фасада"
              ).value
            )
          ).toFixed(2);
        }
        case "Площадь фактурных и окрасочных слоев": {
          return (
            Number(
              elems.find(
                (el) =>
                  el.name === "Площадь фактурных и окрасочных слоев лицевого фасада"
              ).value
            ) +
            Number(
              elems.find(
                (el) =>
                  el.name === "Площадь фактурных и окрасочных слоев дворового фасада"
              ).value
            ) +
            Number(
              elems.find(
                (el) =>
                  el.name === "Площадь фактурных и окрасочных слоев торцевого фасада"
              ).value
            )
          ).toFixed(2);
        }
      }
    } else if (this.url === "improvement-playgrounds") {
      switch (name) {
        case "Асфальтобетонные покрытия": {
          return (
            Number(
              elems.find((el) => el.name === "Внутридворовые проезды").value
            ) +
            Number(elems.find((el) => el.name === "Тротуары").value) +
            Number(elems.find((el) => el.name === "Прочие").value)
          ).toFixed(2);
        }
      }
    }
  }
}
