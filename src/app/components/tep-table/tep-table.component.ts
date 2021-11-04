import { HttpClient } from '@angular/common/http';
import { DataSource } from '@angular/cdk/table';
// import {Component, ViewChild, AfterViewInit} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import {
  merge,
  BehaviorSubject,
  Observable,
  of,
  of as observableOf,
  forkJoin,
} from 'rxjs';
import {
  catchError,
  finalize,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
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
} from '../../_models/common';
import { Options } from '../../_models/mkdlistitem';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FavoritTabsComponent } from '../favorit-tabs/favorit-tabs.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonService } from 'src/app/_services/common.service';
import { RefserviceService } from 'src/app/_services/refservice.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../dialog/delete-tep-dialog/delete-tep-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'tep-table.component.html',
  styleUrls: ['tep-table.component.scss'],
})
export class TepTableComponent implements AfterViewInit, OnInit {
  dataSource = new MatTableDataSource<Mkdlistitem>([]);
  permission: String = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FavoritTabsComponent, { static: false })
  private favoriteComp: FavoritTabsComponent | undefined;
  loadData = true;
  loadFiltrs = true;
  // filters!: TepListFilter;
  // @ViewChild(FiltersComponent)
  // private counterComponent: FiltersComponent|undefined;
  openCloseFilter: boolean = false;
  // filters = <TepListFilter>{};
  // dataSource: TepListDataSource;
  options: Options | undefined;
  reconnectTableData: boolean = false;
  // filters: ListFilter;
  displayedColumns:string[] = [
    // 'favorite',
    // 'house_id',
    // 'district_name',
    // 'address',
    // 'category_name',
    // 'total_damage',
    // 'status_name',
    // 'total_building_area',
    // 'living_building_area',
    // 'management_company',
    // 'heating_name',
    // 'bdate',
  ];

  lastSelectedRowIndex: number = NaN;
  // selectedRowIndex: number = -1;

  drop(event: CdkDragDrop<Mkdlistitem>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }
  // totalDataTable: number = 0;
  tableLocal: any = [];

  constructor(
    private api: TeplistService,
    private apiStore: LocalStorageService,
    private common: CommonService,
    private refApi: RefserviceService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private router: Router,
  ) {
    if (localStorage.mainPageTableData) {
      this.reconnectTableData = true;
      // this.totalDataTable = Number(localStorage.getItem("mainPageTotal"));
    }
  }
  //Износ по сроку
  demageTime() {
    let data = {
      header: "Износ по сроку",
      message: "Подтвердите пересчет износа по сроку эксплуатации",
    };
    if(this.apiStore.checkStore("mainPageUserFilters")) {
      let filter = this.apiStore.getStore("mainPageUserFilters")
      let dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: data,
        width: "500px",
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadData = true;
          this.api.setDemageTime(filter).subscribe(
            (res) => {
              this.loadData = false;
              this._snackBar.open(res.message, undefined, {
                verticalPosition: 'top',
                duration: 2000,
                panelClass: "snackbar-success",
              });
            },
            (error) => {
              this.loadData = false;
              this._snackBar.open("Ошибка операции износ по сроку", undefined, {
                verticalPosition: 'top',
                duration: 2000,
                panelClass: "snackbar-error",
              });
            }
          );
        }
      });
    } else {
      this._snackBar.open("Ошибка загрузки фильтра", undefined, {
        panelClass: "snackbar-error",
        verticalPosition: 'top',
                duration: 2000,
      });
    }
  }
  // addValinFilters={
  //     // const this.filters = <TepListFilter>{};
  //   pageIndex: this.paginator.pageIndex + 1,
  //   limi: this.paginator.pageSize,
  //   sortDirection:
  //   (this.sort.direction === "asc" ? "" : "-") + this.sort.active,
  // }
  addValinFilters:any;
  ngOnInit() {
    this.loadData = true;
    this.lastSelectedRowIndex = Number(
      localStorage.getItem("lastSelectedRowIndex")
    );
    //Проверка на роль пользователя
    if (this.authService.hasRole('ROLE_VIEW_TEP')) {
      this.permission = 'ROLE_VIEW_TEP';
    }
    // this.apiStore.setStore("mainPageUserFilters", mainUserFilters);
    if (this.apiStore.checkStore('userFilters')) {
      this.filters = this.apiStore.getStore('userFilters');

      //TODO заменить после исправления бэк
      // let key: string;
      // for (let key in this.filters) {
      //   if (this.filters[key] === -1) {
      //     this.filters[key] = 'null';
      //   }
      // }
      // this.filters.columns = ["favorite","house_id",...this.filters.columns]
    }
    if (this.apiStore.checkStore('mainPageTableData')) {
      this.filters = this.apiStore.getStore('mainPageUserFilters');
      let tableStore = this.apiStore.getStore('mainPageTableData');
      this.dataSource = new MatTableDataSource(tableStore);
      this.displayedColumns = this.filters.columns;
      this.loadData = false;
      this.loadFiltrs = false;
    } else {
      this.loadMkdListItems(this.filters);
    }
  //   this.addValinFilters={
  //     // const this.filters = <TepListFilter>{};
  //   pageIndex: this.paginator.pageIndex + 1,
  //   limi: this.paginator.pageSize,
  //   sortDirection:
  //   (this.sort.direction === "asc" ? "" : "-") + this.sort.active,
  // }
    // if(!this.reconnectTableData){
    // this.reconnectTableData = true;
    // }
  }
  ngAfterViewInit() {
    //переход по страницам
    // let filters = this.apiStore.getStore('mainPageUserFilters')
    this.paginator.page.pipe(tap(() => this.filters)).subscribe();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
    .pipe(tap(() => {
      this.filters.pageIndex = this.paginator.pageIndex+1;
      this.filters.limit = this.paginator.pageSize;
      this.filters.sortDirection =
    (this.sort.direction === "asc" ? "" : "-") + this.sort.active;
    }))
    .subscribe(
      ()=>{this.loadMkdListItems(this.filters)
      this.addValinFilters}
      );

    if (this.apiStore.checkStore('mainPageTableData')) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      setTimeout(
        () => {
          if (this.apiStore.checkStore('mainPageTotal')) {
            this.paginator.length = Number(this.apiStore.getStore('mainPageTotal'))
            // this.totalDataTable = Number(this.apiStore.getStore('mainPageTotal'))
          }else{
            // this.totalDataTable = 0;
            this.paginator.length = 0;
          }

        }
      );
    }
    if (!this.apiStore.checkStore("mainPageFilters")){
      this.loadAllFilters();
    }
  }
  // на полный экран таблицу
  resTabs: boolean = false;
  resizeTable(){
    this.resTabs = !this.resTabs;
  }
  // открываем избранные
  btnOpenFav: boolean = true;
  openFav(event: any) {
    this.btnOpenFav = event;
  }
  // открываем колонку удалить
  tabDel: boolean = false;
  openDel() {
    this.tabDel = !this.tabDel;
  }
  // Добавляем в избранные дом
  addTochild(event: any) {
    let id: number = event.id;
    let isFavorite: boolean = event.isFavorite;
    this.addToFavourites(id, isFavorite);
    // console.log(event);
  }
  load = false;
  addToFavourites(id: number, isFavorite: boolean) {
    if (!this.load) {
      let favEl = this.dataSource.data.find((el) => el.house_id == id);
      if (favEl) favEl.favorite = !isFavorite;
      this.load = true;
    }

    this.api.toFavorite(id, !isFavorite).subscribe(
      (res) => {
        this.favoriteComp?.getFavoriteList();
        this.load = false;
      },
      (error) => {
        let favEl = this.dataSource.data.find((el) => el.house_id == id);
        if (favEl) favEl.favorite = isFavorite;
        this.load = false;
        // this._snackBar.open(JSON.stringify(error), undefined, {
        //   panelClass: "snackbar-error",
        // });
      }
    );
  }

  filters: TepListFilter = {
    appz: 'null',
    archive: false,
    cap_repair: 'null',
    category: [],
    coldwater: 'null',
    columns: [
      'favorite',
      'house_id',
      'district_name',
      'address',
      'category_name',
      'total_damage',
      'status_name',
      'total_building_area',
      'living_building_area',
    ],
    culture: 'null',
    curr_repair: 'null',
    district: [],
    failure: 'null',
    gas_name: [],
    heating: [],
    hot_water: [],
    lifts: 'null',
    limit: 10,
    management_company: [],
    management_form: [],
    materials: [],
    ownership: [],
    pageIndex: 1,
    power: 'null',
    pzu: 'null',
    sewer: 'null',
    sortDirection: 'address',
    statuses: [],
    statusesDR: [],
    street: [],
    house_number: '',
    house_building: '',
    house_letter: '',
    house_construction: '',
    selectedStreet: [],
    project_type: '',
    storeys_from: 1,
    storeys_to: 0,
    bdate_from: 0,
    bdate_to: 0,
    rdate_to: 0,
    rdate_from: 0,
    damage_from: 0,
    damage_to: 0,
    defect_element_name: 0,
    disabled_people_lifts_count: 'null',
    capital_repair_to: 0,
    capital_repair_from: 0,
    current_repair_to: 0,
    current_repair_from: 0,
    capital_repair: '',
    current_repair: '',
  };

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loadMkdListItems(filter: TepListFilter) {
      this.loadData = true;
      // this.totalDataTable = 555;
    // let filters = this.apiStore.getStore("userFilters");
    // this.loadingSubject.next(true);
    this.api
      .getTepListEntries(filter)
      .pipe(catchError(() => of([])))
      .subscribe(
        (teps) => {
          let data = (teps as { [key: string]: any })['data'];
          let mainUserFilters = (teps as { [key: string]: any })['filters'];
          // mainUserFilters.paginator = this.paginator.pageIndex + 1;
          this.options = (teps as { [key: string]: any })['options'];
          this.dataSource = new MatTableDataSource(data);
          this.apiStore.setStore('mainPageUserFilters', mainUserFilters);
          this.apiStore.setStore('mainPageTableData', data);
          this.apiStore.setStore('mainPageTotal', this.options?.total);
          this.displayedColumns = mainUserFilters.columns;
          setTimeout(() => {
            this.paginator.pageIndex = mainUserFilters.pageIndex-1;
            this.paginator.length = this.options!.total;
          })
          // this.paginator.length = this.options!.total;

          this.dataSource.sort = this.sort;
          this.loadData = false;



          // this.loadPage();
          // this.loadAllFilters();
        },
        (error) => {}
      );
    // finalize(() => {  this.loadingSubject.next(false);});
  }

  loadAllFilters() {
    setTimeout(()=>{
      this.loadFiltrs = true;
      forkJoin([
        this.common.getStreetsByDistrict([]),
        this.api.getFilters(),
        this.refApi.getRefList("5"),
        this.refApi.getCurrRepairApiRefList("workType&per_page=-1"),
        this.refApi.getCapRepairApiRefList(),
        this.refApi.getConstructionList(), //конструктивные элементы
        this.refApi.getRefList("12"),
      ]).subscribe((results) => {
        this.loadFiltrs = false;
        this.apiStore.setStore("mainPageFilters", results)
      });
    },1000)
  }

  groupings = [
    { name: "Район", value: "district", enabled: true },
    { name: "Категория", value: "category", enabled: true },
    { name: "Управляющая организация", value: "organization", enabled: true },
    { name: "Износ", value: "wear", enabled: true },
  ];

  onRowClicked(row:any, event:any) {
    this.lastSelectedRowIndex = row.house_id;
    localStorage.setItem("lastSelectedRowIndex", row.house_id);
    if (
      typeof event.target === "object" &&
      event.target !== null &&
      !Array.isArray(event.target)
    ) {
      if (Object.keys(event.target.dataset).includes("stopPropagation")) {
        // Не перенаправляем
        return;
      }
    }

    this.router.navigate(["mkd", row["house_id"], "common-parameters"]);
  }
    exportExcel() {
      // let data: any = {};
      // data.sortedGroups = this.groupings
      //   .map((x) => {
      //     if (this.selectedGroupings.includes(x.value)) {
      //       return x.value;
      //     }
      //     return 0;
      //   })
      //   .filter((f) => f != 0);
      // if (data.sortedGroups.length > 0 || this.addressGroup) {
      //   data.filter = this.tfilter;
      //   data.fields = this.resultsFieldsSelected;
      //   data.addressGroup = this.addressGroup;
      //   data.outputType = "xlsx";
      //   this.api.exportExcel(data).subscribe(
      //     (res) => {
      //       if (res.size > 20) {
      //         console.log("start download:", res);
      //         const url = window.URL.createObjectURL(res);
      //         const a = document.createElement("a");
      //         document.body.appendChild(a);
      //         a.setAttribute("style", "display: none");
      //         a.href = url;
      //         a.download = "stat.xlsx";
      //         a.click();
      //         window.URL.revokeObjectURL(url);
      //         a.remove();
      //       }
      //     },
      //     (error) => {
      //       this._snackBar.open(JSON.stringify(error), undefined, {
      //         panelClass: "snackbar-error",
      //       });
      //       console.log("download error:");
      //     }
      //   );
      // } else
      //   this._snackBar.open(
      //     '"Группировки" либо "Адрес" должны быть заполнены!',
      //     undefined,
      //     {
      //       panelClass: "snackbar-warning",
      //     }
      //   );
    }
}
