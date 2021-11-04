import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { BehaviorSubject, Observable, zip } from "rxjs";
import "jquery";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TepField } from "../../../_models/tep";
import { GeneralSettings } from "../../../_models/common";
import { TeplistService } from "../../../_services/teplist.service";
import { FakeviewService } from "../../../_services/fakeview.service";
import { SettingsService } from "../../../_services/settings.service";
import { last } from "rxjs/operators";
import { Category } from "../../../_models/filters";
import { RefserviceService } from "src/app/_services/refservice.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-fieldset",
  templateUrl: "./fieldset.component.html",
  styleUrls: ["./fieldset.component.scss"],
})
export class FieldsetComponent implements OnInit {
  @Input() house_id: number;
  @Input() menuTitle: string;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  // options: any = {format: 'DD/MM/YYYY', locale: 'ru'};

  private _tepPart = new BehaviorSubject<string>("");
  private _strTepPart = "";
  private jquerycalled = 0;
  private submitted = false;

  private saveFailSubject = new BehaviorSubject<boolean>(false);
  public saveFail$ = this.saveFailSubject.asObservable();

  private saveSuccessSubject = new BehaviorSubject<boolean>(false);
  public saveSuccess$ = this.saveSuccessSubject.asObservable();

  private enableSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @Input() set tepPart(value: string) {
    this._tepPart.next(value);
  }

  form = new FormGroup({});

  get items() {
    return this._tepPart.getValue();
  }

  // tslint:disable-next-line:no-inferrable-types
  private initialized: boolean = true;
  private tepFields: TepField[];
  private error = "";
  settings$: Observable<GeneralSettings>;

  category_list$: Observable<Category[]>;
  management_org$: Observable<any[]>;

  constructor(
    private api: TeplistService,
    private fview: FakeviewService,
    private settings: SettingsService,
    private cd: ChangeDetectorRef,
    private apiRef: RefserviceService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);

    this.settings$ = this.settings.settings$;

    this.settings$.subscribe((p) => {
      if (p.canEdit) {
        this.form.enable();
      } else {
        this.form.disable();
      }
    });

    const formGroup = {};

    this._tepPart.subscribe((part) => {
      const merged = zip(this.api.getParameterData(this.house_id, part));
      merged.subscribe((result) => {
        const res = result[0];
        const managementCompanies = result[1] ?? [];
        this.tepFields = [];
        this.tepFields.length = 0;

        const source = Object.entries(res).map(([key, value]) => ({
          key,
          value,
        }));

        source.forEach((element) => {
          const tt = this.fview.getParameterData(element.key);

          // if ((tt["ref"] ?? null) === this.fview.MANAGEMENT_COMPANIES) {
          //   tt["fieldoptions"] = managementCompanies;
          // }
          this.tepFields.push(
            new TepField(
              element.key,
              element.value,
              tt["type"],
              tt["caption"],
              tt["unit"],
              tt["showAs"],
              tt["fieldoptions"]
            )
          );

          formGroup[element.key] = this._assignValue(
            this.tepFields[this.tepFields.length - 1]
          );
        });
        let checkboxFields = this.tepFields.filter(
          (field) => field.showAs == "check"
        );
        checkboxFields.forEach((field) => {
          formGroup[field.code].value = !!field.value;
        });
        this.category_list$ = this.api.getCategories();
        this.management_org$ = this.api.getMcList();

        this.form = new FormGroup(formGroup);
        this._strTepPart = part;
        this.notify.emit(false);
      });
    });

    console.log(this.settings.canEdit());
  }

  get f() {
    return this.form.controls;
  }

  private mapValidators(validators) {
    const formValidators = [];
    if (validators) {
      for (const validation of Object.keys(validators)) {
        if (validation === "required") {
          formValidators.push(Validators.required);
        } else if (validation === "min") {
          formValidators.push(Validators.min(validators[validation]));
        }
      }
    }
    return formValidators;
  }

  private _assignValue(tfield: TepField): FormControl {
    if (tfield.showAs === "check") {
      return new FormControl(
        { value: tfield.value === "1", disabled: !this.settings.canEdit() },
        undefined
      );
    } else if (tfield.type === "int") {
      return new FormControl(
        { value: tfield.value, disabled: !this.settings.canEdit() },
        Validators.pattern("^\\d*$")
      );
    } else if (tfield.type === "float") {
      return new FormControl(
        { value: tfield.value, disabled: !this.settings.canEdit() },
        Validators.pattern("^\\d*(\\,|\\.)?\\d+$")
      );
    } else {
      return new FormControl(
        { value: tfield.value, disabled: !this.settings.canEdit() },
        undefined
      );
    }
  }

  onSubmit(form) {
    this.submitted = true;
    const result = {};
    result["data"] = form;
    console.log(JSON.stringify(result));

    if (this.form.invalid) {
      return;
    }

    this.submitted = false;
    this.api
      .postFieldSetData(this.house_id, this._strTepPart, JSON.stringify(result))
      .pipe(last())
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
    const result = {};

    this.tepFields.forEach((element) => {
      result[element.code] =
        element.type !== "datetime"
          ? this.form.controls[element.code].value
          : this.parseDate(this.form.controls[element.code].value);
    });

    return result;
  }

  clearMessage() {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);
  }

  parseDate(dateString: string): String {
    if (dateString) {
      return String(new Date(dateString).getTime());
    } else {
      return null;
    }
  }
}
