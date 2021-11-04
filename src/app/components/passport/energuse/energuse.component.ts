import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject, Observable } from "rxjs";
import { first } from "rxjs/operators";
import { TeplistService } from "../../../_services/teplist.service";
import { Energyuse } from "../../../_models/tep";
import { GeneralSettings } from "../../../_models/common";
import { SettingsService } from "../../../_services/settings.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-energuse",
  templateUrl: "./energuse.component.html",
  styleUrls: ["./energuse.component.scss"],
})
export class EnerguseComponent implements OnInit {
  @Input() tepPart: string;
  @Input() house_id: number;
  @Input() menuTitle: string;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  // tslint:disable-next-line:no-inferrable-types
  mergeLevel: number = 5;
  constructor(
    private api: TeplistService,
    private settings: SettingsService,
    private _snackBar: MatSnackBar
  ) {}

  explications: Energyuse[] = [];
  exp_view: Energyuse[] = [];

  // Form variables
  private error = "";
  form = new FormGroup({});

  settings$: Observable<GeneralSettings>;

  private saveFailSubject = new BehaviorSubject<boolean>(false);
  public saveFail$ = this.saveFailSubject.asObservable();

  private saveSuccessSubject = new BehaviorSubject<boolean>(false);
  public saveSuccess$ = this.saveSuccessSubject.asObservable();

  list_to_tree(list) {
    // tslint:disable-next-line:prefer-const
    let map = {},
      node,
      roots = [],
      i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i].attr_id] = i; // initialize the map
      list[i].explications = []; // initialize the children
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parent_attr_id !== null) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parent_attr_id]].explications.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  ngOnInit() {
    this.settings$ = this.settings.settings$;
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);

    this.api.getEnergyUse(this.house_id).subscribe((res) => {
      const data = res;
      this.exp_view = data.slice();
      this.explications = this.list_to_tree(data);

      const formGroup = {};

      data.forEach((element) => {
        if (element.group_flag === 0) {
          formGroup["attr_id" + element.attr_id] = new FormControl(
            element.attr_value,
            undefined
          );
        }
      });

      this.form = new FormGroup(formGroup);

      this.notify.emit(false);
    });
  }

  clearMessage() {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);
  }

  onSubmit(form) {
    const result = {};
    result["data"] = this.printValue();
    console.log(JSON.stringify(result));

    this.api
      .postFieldSetData(this.house_id, this.tepPart, JSON.stringify(result))
      .pipe(first())
      .subscribe(
        (data) => {
          // this.saveSuccessSubject.next(true);
          // this.saveFailSubject.next(false);
          this._snackBar.open("Успешно", undefined, {
            panelClass: "snackbar-success",
          });
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
    if (this.exp_view !== undefined) {
      const result = [];

      this.exp_view.forEach((element) => {
        const el = <Energyuse>{};
        el.attr_caption = element.attr_caption;
        el.attr_id = element.attr_id;

        el.explications = [];
        el.group_flag = element.group_flag;
        el.measure_unit = element.measure_unit;
        el.parent_attr_id = element.parent_attr_id;
        // el.tree_level = element.tree_level;
        // el.value_id = element.value_id;

        if (element.group_flag === 0) {
          el.attr_value = this.form.controls["attr_id" + element.attr_id].value;
        }

        result.push(el);
      });

      return result;
    }
  }
}
