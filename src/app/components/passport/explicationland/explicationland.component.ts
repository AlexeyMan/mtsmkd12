import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TeplistService } from "../../../_services/teplist.service";
import { Explication } from "../../../_models/tep";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable } from "rxjs";
import { first } from "rxjs/operators";
import { GeneralSettings } from "../../../_models/common";
import { SettingsService } from "../../../_services/settings.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-explicationland",
  templateUrl: "./explicationland.component.html",
  styleUrls: ["./explicationland.component.scss"],
})
export class ExplicationlandComponent implements OnInit {
  @Input() tepPart: string;
  @Input() house_id: number;
  @Input() menuTitle: string;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  cadastr = [
    /\d/,
    /\d/,
    ":",
    /\d/,
    /\d/,
    ":",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ":",
    /\d/,
    /\d/,
  ];

  // tslint:disable-next-line:no-inferrable-types
  mergeLevel: number = 5;
  constructor(
    private api: TeplistService,
    private settings: SettingsService,
    private _snackBar: MatSnackBar
  ) {}

  explications: Explication[] = [];
  exp_view: Explication[] = [];

  oldData: any;

  // Form variables
  private error = "";
  form = new FormGroup({});

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

    this.api.getExplications(this.house_id).subscribe((res) => {
      const data = res;
      console.log(res);
      this.exp_view = data.slice();
      this.explications = this.list_to_tree(data);
      console.log(this.explications);

      this.oldData = JSON.parse(JSON.stringify(this.exp_view));

      const formGroup = {};

      this.exp_view.forEach((element) => {
        formGroup[element.attr_id] = new FormControl(element.attr_value);
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
        return Number(elems[5].attr_value) + this.sumEl(7);
      }
      case 7: {
        return this.sumEl(10) + this.sumEl(15) + this.sumEl(20);
      }
      case 10: {
        return (
          Number(elems[11].attr_value) +
          Number(elems[12].attr_value) +
          Number(elems[13].attr_value)
        );
      }
      case 15: {
        return (
          Number(elems[16].attr_value) +
          Number(elems[17].attr_value) +
          Number(elems[18].attr_value)
        );
      }
      case 20: {
        return (
          Number(elems[21].attr_value) +
          Number(elems[22].attr_value) +
          Number(elems[23].attr_value)
        );
      }
    }
  }

  clearMessage() {
    this.saveSuccessSubject.next(false);
    this.saveFailSubject.next(false);
  }

  onSubmit() {
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
          this._snackBar.open(`Данные обновлены`, undefined, {
            panelClass: "snackbar-success",
          });
          this.saveSuccessSubject.next(true);
          this.saveFailSubject.next(false);
        },
        (error) => {
          this.error = error;
          this.saveFailSubject.next(true);
          this.saveSuccessSubject.next(false);
        }
      );
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
