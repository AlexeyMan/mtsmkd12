import {HttpClient} from '@angular/common/http';
import { DataSource } from '@angular/cdk/table';
// import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {merge,BehaviorSubject, Observable, of, of as observableOf} from 'rxjs';
import {catchError, finalize, map, startWith, switchMap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { ListFilter, RefItem } from "../../_models/filters";
import { Mkdlistitem } from '../../_models/mkdlistitem';
import { TeplistService } from '../../_services/teplist.service';
import { LocalStorageService } from '../../_services/store';
// import { FiltersComponent } from '../filters/filters.component';
import {
  GeneralSettings,
  Ownershipform,
  Street,
  TepListFilter,
} from "../../_models/common";
import { Options } from "../../_models/mkdlistitem";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  templateUrl: 'tep-table.component.html',
  styleUrls: ['tep-table.component.scss'],
})
export class TepTableComponent implements AfterViewInit, OnInit {
  dataSource = new MatTableDataSource <Mkdlistitem> ([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(FiltersComponent)
  // private counterComponent: FiltersComponent|undefined;
  openCloseFilter: boolean = false;
  // filters = <TepListFilter>{};
  // dataSource: TepListDataSource;
  options: Options | undefined;
  reconnectTableData: boolean = false;
  // filters: ListFilter;
  displayedColumns = [
    'favorite',
    'house_id',
    'district_name',
    'address',
    'category_name',
    'total_damage',
    'status_name',
    'total_building_area',
    'living_building_area',
    "management_company",
    "heating_name",
    'bdate'
  ];
  totalDataTable: number = 0;
  tableLocal:any = [];

  constructor(
    private api: TeplistService,
    private apiStore: LocalStorageService
    ) {
      if(localStorage.mainPageTableData){
        this.reconnectTableData = true;
        // this.totalDataTable = Number(localStorage.getItem("mainPageTotal"));
      }
    }
    ngOnInit() {
      if(this.apiStore.checkStore("mainPageTableData")){
        let tableStore = this.apiStore.getStore("mainPageTableData");
        this.dataSource = new MatTableDataSource(tableStore);
      }else
      this.loadMkdListItems(this.filters);

      // if(!this.reconnectTableData){
        // this.reconnectTableData = true;
        // }
      }
      ngAfterViewInit(){
        if(this.apiStore.checkStore("mainPageTableData")){
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        setTimeout(() =>this.totalDataTable = Number(this.apiStore.getStore("mainPageTotal")));
      }
    }
    // }
    // if(this.reconnectTableData){
      // this.totalDataTable = Number(this.apiStore.getStore("mainPageTotal"));
    // loadPage() {
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    //   // setTimeout(() => this.totalDataTable = Number(localStorage.getItem("mainPageTotal")));
    // }


    filters = <TepListFilter> <unknown>{
      appz: "null",
      archive: false,
      cap_repair: "null",
      category: [],
      coldwater: "null",
      columns: [
        0, "favorite",
    1, "house_id",
    2, "district_name",
    3, "address",
    4, "category_name",
    5, "total_damage",
    6, "status_name",
    7, "total_building_area",
    8, "living_building_area",
  ],
  culture: "null",
  curr_repair: "null",
  district: [],
  failure: "null",
  gas_name: [],
  heating: [],
  hot_water: [],
  lifts: "null",
  limit: 100,
  management_company: [],
  management_form: [],
  materials: [],
  ownership: [],
  pageIndex: 1,
  power: "null",
  pzu: "null",
  sewer: "null",
  sortDirection: "address",
  statuses: [],
  statusesDR: [],
  street: [],
  // district = [],
  // street: string[];
  house_number: "",
  house_building: "",
  house_letter: "",
  house_construction: '',
  selectedStreet: [],
  project_type: "",
  storeys_from: 1,
  storeys_to: 0,
  bdate_from: 0,
  bdate_to: 0,
  rdate_to: 0,
  rdate_from: 0,
  damage_from: 0,
  damage_to: 0,
  defect_element_name: 0,
  disabled_people_lifts_count: "null",
  capital_repair_to: "",
  capital_repair_from: 0,

  current_repair_to: 0,
  current_repair_from: 0,

  capital_repair: '',
  current_repair: '',
}
private loadingSubject = new BehaviorSubject<boolean>(false);

  // loadTepPage() {
  //   this.loadMkdListItems(this.filters);
  // }
  aaa = [{
    favorite: false,
    house_id:667098,
    district_name:'Адмиралтейский',
    address:"qqqqqq",
    category_name:'Дореволюционной постройки, прошедшие кап',
    total_damage:1,
    status_name:'утвержден',
    total_building_area:"21",
    living_building_area:"11",
  }]
  loadMkdListItems(filter: TepListFilter) {
      this.loadingSubject.next(true);
      this.api
        .getTepListEntries(filter)
        .pipe(
          catchError(() => of([])),
        )
        .subscribe(
          (teps) => {
            let data = (teps as { [key: string]: any })["data"];
            let mainUserFilters = (teps as { [key: string]: any })["filters"];
            this.options = (teps as { [key: string]: any })["options"];
            this.dataSource = new MatTableDataSource(data);
            this.apiStore.setStore("mainPageUserFilters", mainUserFilters);
            this.apiStore.setStore("mainPageTableData",data);
            this.apiStore.setStore("mainPageTotal",String(this.options!['total']));
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.totalDataTable = this.options!['total'];
            // this.loadPage();
          },
          (error) => {

          }
          );
          finalize(() => this.loadingSubject.next(false))
    }
}
