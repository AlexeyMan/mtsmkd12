import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { forkJoin, Observable } from "rxjs";
import { TeplistService } from '../../_services/teplist.service';
import { LocalStorageService } from '../../_services/store';
import { CommonService } from 'src/app/_services/common.service';
import { RefserviceService } from 'src/app/_services/refservice.service';
import { AppSettings } from "src/app/appSettings";
import {
  GeneralSettings,
  Ownershipform,
  Street,
  TepListFilter,
} from "../../_models/common";
import {MatAccordion} from '@angular/material/expansion';
import {FormControl} from '@angular/forms';
import { ListFilter, RefItem } from 'src/app/_models/filters';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

const ownership_types: Ownershipform[] = [
  { id: 1, name: "Государственная" },
  { id: 2, name: "Частная" },
];
const demage_types = [
  { value: "null", name: "Выключить" },
  { value: true, name: "Да" },
  { value: false, name: "Нет" },
];
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  filterButtonGroup: boolean = false;
  selectedDistricts = [];
  // filters = this.apiStore.getStore("mainPageFilters");
  // filtersUser = this.apiStore.getStore("mainPageUserFilters");
  filters!: ListFilter;
  filtersUser:any;
  openCloseFilters: boolean = false;
  number: any;
  building: any;
  letter: any;
  house_construction: any;
  // accordion:any;
  // @Input() userAge: number = 0;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(SelectAutocompleteComponent) multiSelect!: SelectAutocompleteComponent;
    districts = new FormControl;
    streets = new FormControl;
  // constructor(
  //   private api: TeplistService,
  //   private apiStore: LocalStorageService,
  //   private common: CommonService,
  //   private refApi: RefserviceService,
  // ) { }
  selectedCategories = [];
  selectedOtypes = [];
  allowntypes: Ownershipform[] = ownership_types;
  selectedMtypes = [];
  lifts: string = "null";
  culture: string = "null";
  failure: string = "null";
  demageType = demage_types;
//////////////////////////////////////////////////////////
  selectedOptions = [];
  selected = this.selectedOptions;
  showError = false; // показывать ли сообщение об ошибке или нет. По умолчанию: false;
  errorMessage = ''; // настраиваемое сообщение об ошибке. По умолчанию: «Поле обязательно для заполнения».

  onToggleDropdown() {
    this.multiSelect.toggleDropdown();
  }

  getSelectedOptions(selected:any) {
    this.selected = selected;
  }

  onResetSelection() {
    this.selectedOptions = [];
  }
  ///////////////////////////////////////////////
  ngOnInit(): void {
    if(this.apiStore.checkStore("mainPageFilters")){
      let filters = this.apiStore.getStore("mainPageFilters");
    }else
    this.loadAllFilters();

    // this.filters = localStorage.getItem("mainPageFilters");
    // this.filtersUser = localStorage.getItem("mainPageUserFilters");
  }
  allmtypes: RefItem[] = [];
  _streetFilter:any;
  streetControl:any;
  // filteredOptions4: Observable<string[]>;
  filteredOptions4:any;
  outstreets: Street[] = [
    { id: 1, name: "Все", street_name_old: "" },
    { id: 2, name: "Все", street_name_old: "" },
  ];
  allstreets: Street[] = this.outstreets;
  constructor(
    private api: TeplistService,
    private common: CommonService,
    private refApi: RefserviceService,
    private apiStore: LocalStorageService,
  ) {
    // forkJoin([
    //   this.common.getStreetsByDistrict([]),
    //   this.refApi.getRefList(AppSettings.MC_TYPE_ID),
    // ]).subscribe((results) => {
    //   this.allstreets = results[0];
    //   this.filteredOptions4 = results[1];
      // this.filteredOptions4 = this.streetControl.valueChanges.pipe(
      //   (value:any) => {this._streetFilter(value)}
      // );
      // this.allmtypes = results[1]["data"];
      // @ts-ignore
      // this.workList = results[2]["data"];
      // this.workCapRepList = results[3];
      // this.filteredOptions1 = this.workControl1.valueChanges.pipe(
      //   startWith(""),
      //   map((value) => this._filter(value))
      // );
      // this.filteredOptions2 = this.workControl2.valueChanges.pipe(
      //   startWith(""),
      //   map((value) => this._filterWorkListCapRep(value))
      // );
    // });
  }
  districtChange($event:any) {
    // this.selectedDistricts = [];
    //
    // $event.value.forEach((element) => {
    // this.selectedDistricts.push(element);
    // });

    this.common.getStreetsByDistrict(this.selectedDistricts).subscribe((p) => {
      this.allstreets = p;
    });

    // this.loadTepPage();
  }
  catyChange($event:any){

  }
  otypeChange($event:any){

  }
  mtypeChange($event:any){

  }
  failureChange($event:any){}
  oknChange($event:any){}
  liftChange($event:any){}
  loadAllFilters(){
    forkJoin([
      this.common.getStreetsByDistrict([]),
      this.api.getFilters(),
      this.refApi.getRefList(AppSettings.MC_TYPE_ID),
    ]).subscribe((results) => {
      this.allstreets = results[0];
      this.filters = results[1];
      this.allmtypes = (results[2] as { [key: string]: any })["data"];
      // this.filteredOptions4 = results[1];
    });
    // this.filters = this.route.snapshot.data["filters"];
    // this.api.getFilters().pipe().subscribe(
    //   (data)=>{
    //     this.filters = data;
    //   },
    //   (error)=>{

    //   }
    // )
  }
  saveFilter() {}
  clearFilter() {}

  // districtChange($event) {
    // this.selectedDistricts = [];
    //
    // $event.value.forEach((element) => {
    // this.selectedDistricts.push(element);
    // });

    // this.common.getStreetsByDistrict(this.selectedDistricts).subscribe((p) => {
    //   this.allstreets = p;
    // });

    // this.loadTepPage();
  // }
}
