import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { GeneralSettings } from "../_models/common";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  settings$: Observable<GeneralSettings>;
  private _settings: BehaviorSubject<GeneralSettings>;
  private dataStore: {
    settings$: GeneralSettings;
  };

  private visible_columns: string[] = [
    "favorite",
    "house_id",
    "district_name",
    "address",
    "category_name",
    "total_damage",
    "status_name",
    "total_building_area",
    "living_building_area",
    "failure",
    "management_company",
    "culture",
    "lifts",
    "bdate",
    "storeys",
    "project_type",
    "heating_name",
    "hot_water_name",
    "coldwater",
    "gas",
    "pzu",
    "appz",
    "archive",
    "disabled_people_lifts_count",
  ];

  public canEdit(): Boolean {
    return this._settings.value.canEdit;
  }

  constructor(private http: HttpClient) {
    this.dataStore = { settings$: <GeneralSettings>{} };
    this._settings = <BehaviorSubject<GeneralSettings>>(
      new BehaviorSubject(<GeneralSettings>{})
    );
    this.settings$ = this._settings.asObservable();
    this.dataStore.settings$.visible_columns = [
      "favorite",
      "house_id",
      "district_name",
      "address",
      "category_name",
      "total_damage",
      "status_name",
      "total_building_area",
      "living_building_area",
    ];
  }

  getSettings() {
    return this._settings.asObservable();
  }

  // Редактирование: false = нельзя, true = можно
  setEditMode(arg = false) {
    this.dataStore.settings$.canEdit = arg;
    this._settings.next(Object.assign({}, this.dataStore).settings$);
  }

  // Положение меню: 0 - сверху, 1 - сбоку
  setMenuLayout(arg = false) {
    this.dataStore.settings$.menuPosition = arg;
    this._settings.next(Object.assign({}, this.dataStore).settings$);
  }

  setColumn(arg: string[]) {
    this.dataStore.settings$.visible_columns = arg;
    this._settings.next(Object.assign({}, this.dataStore).settings$);
  }

  setVisibleColumns(arg: string[]) {
    this.dataStore.settings$.visible_columns = arg;
    this._settings.next(Object.assign({}, this.dataStore).settings$);
  }

  showDebugPanel(arg = true) {
    this.dataStore.settings$.showDebugPanel = arg;
    this._settings.next(Object.assign({}, this.dataStore).settings$);
  }
}
