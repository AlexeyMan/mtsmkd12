import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TeplistService } from "../../../_services/teplist.service";
import { Explication } from "../../../_models/tep";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable } from "rxjs";
import { first } from "rxjs/operators";
import { SettingsService } from "../../../_services/settings.service";
import { GeneralSettings } from "../../../_models/common";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-cleaningareas",
  templateUrl: "./cleaningareas.component.html",
  styleUrls: ["./cleaningareas.component.scss"],
})
export class CleaningareasComponent implements OnInit {
  @Input() tepPart: string;
  @Input() house_id: number;
  @Input() menuTitle: string;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  // tslint:disable-next-line:no-inferrable-types
  mergeLevel: number = 3;
  private error = "";

  constructor(
    private api: TeplistService,
    private settings: SettingsService,
    private _snackBar: MatSnackBar
  ) {}

  explications: Explication[] = [];
  exp_view: Explication[] = [];
  form = new FormGroup({});

  oldData: any;

  private saveFailSubject = new BehaviorSubject<boolean>(false);
  public saveFail$ = this.saveFailSubject.asObservable();

  private saveSuccessSubject = new BehaviorSubject<boolean>(false);
  public saveSuccess$ = this.saveSuccessSubject.asObservable();
  settings$: Observable<GeneralSettings>;

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
    // TODO
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);
    this.settings$ = this.settings.settings$;

    this.api.getCleaningAreas(this.house_id).subscribe((res) => {
      const data = res;
      this.exp_view = data.slice();
      this.explications = this.list_to_tree(data);

      this.oldData = JSON.parse(JSON.stringify(this.exp_view));

      const formGroup = {};
      this.exp_view.forEach((element) => {
        formGroup[element.attr_id] = new FormControl(
          element.attr_value,
          Validators.pattern("^\\d*(\\,|\\.)?\\d+$")
        );
      });

      this.form = new FormGroup(formGroup);

      this.notify.emit(false);
    });
  }

  diffPercent(a, i) {
    let oldVal = this.oldData.find((p) => p.attr_id == i);
    if (Number(oldVal.attr_value)) {
      if (oldVal.attr_value * 0.9 > a || oldVal.attr_value * 1.1 < a) {
        document.getElementById(i).style.display = "inherit";
      } else document.getElementById(i).style.display = "none";
    }
  }

  sumEl(id) {
    let elems = this.exp_view;
    switch (id) {
      case 3: {
        return (this.exp_view[id].attr_value =
          Number(elems[5].attr_value) +
          Number(elems[6].attr_value) +
          Number(elems[7].attr_value) +
          Number(elems[8].attr_value));
      }
      case 10: {
        return (this.exp_view[id].attr_value =
          this.sumEl(12) + this.sumEl(26) + this.sumEl(40));
      }
      case 12: {
        return (this.exp_view[id].attr_value =
          this.sumEl(14) + this.sumEl(18) + this.sumEl(22));
      }
      case 14: {
        return (this.exp_view[id].attr_value =
          Number(elems[15].attr_value) + Number(elems[16].attr_value));
      }
      case 18: {
        return (this.exp_view[id].attr_value =
          Number(elems[19].attr_value) + Number(elems[20].attr_value));
      }
      case 22: {
        return (this.exp_view[id].attr_value =
          Number(elems[23].attr_value) + Number(elems[24].attr_value));
      }
      case 26: {
        return (this.exp_view[id].attr_value =
          this.sumEl(28) + this.sumEl(32) + this.sumEl(36));
      }
      case 28: {
        return (this.exp_view[id].attr_value =
          Number(elems[29].attr_value) + Number(elems[30].attr_value));
      }
      case 32: {
        return (this.exp_view[id].attr_value =
          Number(elems[33].attr_value) + Number(elems[34].attr_value));
      }
      case 36: {
        return (this.exp_view[id].attr_value =
          Number(elems[37].attr_value) + Number(elems[38].attr_value));
      }
      case 40: {
        return (this.exp_view[id].attr_value =
          this.sumEl(42) + this.sumEl(46) + this.sumEl(50));
      }
      case 42: {
        return (this.exp_view[id].attr_value =
          Number(elems[43].attr_value) + Number(elems[44].attr_value));
      }
      case 46: {
        return (this.exp_view[id].attr_value =
          Number(elems[47].attr_value) + Number(elems[48].attr_value));
      }
      case 50: {
        return (this.exp_view[id].attr_value =
          Number(elems[51].attr_value) + Number(elems[52].attr_value));
      }
    }
  }

  onSubmit(form) {
    const result = {};
    result["data"] = this.exp_view;

    if (this.form.invalid) {
      return;
    }

    this.api
      .postFieldSetData(this.house_id, this.tepPart, JSON.stringify(result))
      .pipe(first())
      .subscribe(
        (data) => {
          this._snackBar.open(`Данные обновлены`, undefined, {
            panelClass: "snackbar-success",
          });
          this.saveSuccessSubject.next(true);
          this.saveFailSubject.next(false);
        },
        (error) => {
          this._snackBar.open(`Ошибка`, undefined, {
            panelClass: "snackbar-error",
          });
          this.error = error;
          this.saveFailSubject.next(true);
          this.saveSuccessSubject.next(false);
        }
      );
  }

  clearMessage() {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);
  }

  private printValue(): Object {
    if (this.exp_view !== undefined) {
      const result = [];

      this.exp_view.forEach((element) => {
        const el = <Explication>{};
        el.attr_caption = element.attr_caption;
        el.attr_id = element.attr_id;

        el.explications = [];
        el.group_flag = element.group_flag;
        el.measure_unit = element.measure_unit;
        el.parent_attr_id = element.parent_attr_id;
        el.tree_level = element.tree_level;
        el.value_id = element.value_id;

        if (element.group_flag === 0) {
          el.attr_value = this.form.controls[element.attr_id].value;
        }

        result.push(el);
      });

      return result;
    }
  }
}
