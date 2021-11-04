import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { forkJoin, from, fromEvent, Observable, Subject } from 'rxjs';
import { TeplistService } from '../../_services/teplist.service';
import { LocalStorageService } from '../../_services/store';
import { CommonService } from 'src/app/_services/common.service';
import { RefserviceService } from 'src/app/_services/refservice.service';
import { AppSettings } from 'src/app/appSettings';
import {
  GeneralSettings,
  Ownershipform,
  Street,
  TepListFilter,
} from '../../_models/common';
import { MatAccordion } from '@angular/material/expansion';
import { FormControl } from '@angular/forms';
import {
  Categories,
  Districts,
  ListFilter,
  RefItem,
  Statuses,
} from 'src/app/_models/filters';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TepTableComponent } from '../tep-table/tep-table.component';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap,
} from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';
import { NgSelectConfig } from '@ng-select/ng-select';

const ownership_types: Ownershipform[] = [
  { id: 1, name: 'Государственная' },
  { id: 2, name: 'Частная' },
];
const demage_types = [
  { value: 'null', name: 'Выкл' },
  { value: 'true', name: 'Да' },
  { value: 'false', name: 'Нет' },
];
const cap_repair_type = [
  { value: 'null', name: 'Выкл' },
  { value: "'rp', 'kp'", name: 'План' },
  { value: "'fact'", name: 'Факт' },
];
const colViewer = [
  { value: 'Район', id: 'district_name' },
  { value: 'Адрес', id: 'address' },
  { value: 'Категория', id: 'category_name' },
  { value: 'Износ', id: 'total_damage' },
  { value: 'Статус', id: 'status_name' },
  { value: 'Общая площадь', id: 'total_building_area' },
  {
    value: 'Площадь жилых помещений',
    id: 'living_building_area',
  },
  {
    value: 'Нежилая площадь функциональная',
    id: 'non_living_building_area',
  },
  {
    value: 'Нежилая площадь общего имущества',
    id: 'room_service_area',
  },
  { value: 'Площадь л/кл и коридоров', id: 'stairs_hall_area' },
  { value: 'Строительный объем', id: 'total_building_volume' },
  { value: 'Количество квартир', id: 'flat_count' },
  { value: 'Количество проживающих', id: 'residents_count' },
  { value: 'Управляющая организация', id: 'management_company' },
  { value: 'Год постройки', id: 'bdate' },
  { value: 'Год реконструкции', id: 'reconstruction_year' },
  { value: 'Лифты', id: 'lifts' },
  { value: 'ОКН', id: 'culture' },
  { value: 'Аварийность', id: 'failure' },
  { value: 'Этажность', id: 'storeys' },
  { value: 'Серия, тип проекта', id: 'project_type' },
  { value: 'Отопление', id: 'heating_name' },
  { value: 'ГВС', id: 'hot_water_name' },
  { value: 'ХВС', id: 'coldwater' },
  { value: 'Газоснабжение', id: 'gas_name' },
  { value: 'ПЗУ', id: 'pzu' },
  { value: 'АППЗ', id: 'appz' },
  { value: 'Эл-во', id: 'electro' },
  { value: 'Водоотв', id: 'sewer' },
  {
    value: 'Количество подъемников',
    id: 'disabled_people_lifts_count',
  },
  // { value: "Архив МКД", id: "archive" },
];

const districtsConst = [
  {
    districtId: 3,
    districtName: 'Выборгский',
    pspcdId: '763DEE58C24611D5BCDE0050049E59AD',
  },
  {
    districtId: 4,
    districtName: 'Калининский',
    pspcdId: '763DEE59C24611D5BCDE0050049E59AD',
  },
  {
    districtId: 5,
    districtName: 'Колпинский',
    pspcdId: '763DEE5AC24611D5BCDE0050049E59AD',
  },
  {
    districtId: 6,
    districtName: 'Кировский',
    pspcdId: '763DEE5BC24611D5BCDE0050049E59AD',
  },
  {
    districtId: 7,
    districtName: 'Красногвардейский',
    pspcdId: '763DEE5CC24611D5BCDE0050049E59AD',
  },
  {
    districtId: 8,
    districtName: 'Красносельский',
    pspcdId: '763DEE5DC24611D5BCDE0050049E59AD',
  },
  {
    districtId: 9,
    districtName: 'Кронштадтский',
    pspcdId: '763DEE5EC24611D5BCDE0050049E59AD',
  },
  {
    districtId: 10,
    districtName: 'Курортный',
    pspcdId: '763DEE5FC24611D5BCDE0050049E59AD',
  },
  {
    districtId: 12,
    districtName: 'Московский',
    pspcdId: '763DEE61C24611D5BCDE0050049E59AD',
  },
  {
    districtId: 13,
    districtName: 'Невский',
    pspcdId: '763DEE62C24611D5BCDE0050049E59AD',
  },
  {
    districtId: 14,
    districtName: 'Петроградский',
    pspcdId: '763DEE63C24611D5BCDE0050049E59AD',
  },
  {
    districtId: 15,
    districtName: 'Приморский',
    pspcdId: '763DEE64C24611D5BCDE0050049E59AD',
  },
  {
    districtId: 17,
    districtName: 'Петродворцовый',
    pspcdId: '763DEE66C24611D5BCDE0050049E59AD',
  },
  {
    districtId: 18,
    districtName: 'Пушкинский',
    pspcdId: '763DEE67C24611D5BCDE0050049E59AD',
  },
  {
    districtId: 19,
    districtName: 'Фрунзенский',
    pspcdId: '763DEE68C24611D5BCDE0050049E59AD',
  },
  {
    districtId: 20,
    districtName: 'Центральный',
    pspcdId: '763DEE69C24611D5BCDE0050049E59AD',
  },
  {
    districtId: 1,
    districtName: 'Адмиралтейский',
    pspcdId: '763DEE54C24611D5BCDE0050049E59AD',
  },
];

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  //фильт оределение
  filterRequest = <TepListFilter>{};
  filters!: ListFilter;
  demageType = demage_types; //список аварийность/окн/лифты
  //Основной
  selectedDistricts: number[] = []; //район
  districts: Districts[] = districtsConst; //список районов
  selectedStreet = []; //улица
  outstreets: Street[] = [
    { id: 1, name: 'Нет улиц', street_name_old: '', districts_ids: [] },
  ]; //список улиц
  number: string = ''; //номер
  building: string = ''; //корпус
  letter: string = ''; //литера
  house_construction: string = ''; //строение
  selectedCategories = []; //категория
  categories: Categories[] = []; // список категория
  selectedOtypes = []; //Вид собственности
  allowntypes: Ownershipform[] = ownership_types; //селект Вид собственности
  failure: string = 'null'; //аварийность
  selectedCompany = []; //Управляющая компания
  management_company = []; //this.filters?.management_company список Управляющая компания
  selectedMtypes = []; //Тип управляющей организации
  allmtypes: RefItem[] = []; // список Тип управляющей организации
  culture: string = 'null'; //окн
  lifts: string = 'null'; //лифты

  //Дополнительный фильтр
  construction_elements = []; //Конструктивный элемент (износ)
  selectedDefectElements!: number; //Конструктивный элемент
  damageFrom: any;
  damageTo: any;
  materialsForConst: any; //Материал
  selectedMaterials = []; //Материал
  selectedStatuses = []; //Статус ТЭП
  statuses: Statuses[] = []; //список Статус ТЭП
  selectedDefectRegister = []; //Статус акта осмотра
  selectedHeating = []; //Отопление
  selectedHotWater = []; //ГВС
  selectedGas = []; //Газоснабжение
  coldWater: string = 'null'; //ХВС
  electro: string = 'null';
  sewer: string = 'null';
  appz: string = 'null';
  pzu: string = 'null';
  archive: boolean = false;
  cap_repair: string = 'null';
  crep: string = '';
  crepFrom: any = 0;
  crepTo: any = 0;
  curr_repair: string = 'null'; //Текущий ремонт
  trep: string = '';
  trepFrom: any = 0;
  trepTo: any = 0;
  series: any;
  storeysFrom: any;
  storeysTo: any;
  buildFrom: any;
  buildTo: any;
  rbuildFrom: any;
  rbuildTo: any;
  columsSelectView: string[] = []; // выбранные для отображения колонки

  ////////////////////////////////////////////////////////////////

  filterButtonGroup: boolean = false;
  filtersUser: any;
  streamFilters$ = new Subject();
  openCloseFilters: boolean = false;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  // districts = new FormControl();
  streets = new FormControl();
  repairType = cap_repair_type;
  capType: RefItem[] = []; //список вид работ капитального ремонта
  currType: RefItem[] = [];
  columsListView = colViewer; // все колонки таблицы
  //////////////////////////////////////////////////////////

  showError = false; // показывать ли сообщение об ошибке или нет. По умолчанию: false;
  errorMessage = ''; // настраиваемое сообщение об ошибке. По умолчанию: «Поле обязательно для заполнения».

  // allstreets: Street[] =[];
  // allstreets: Street[] = this.outstreets;
  // yearMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  column_viewer: any;
  // onOffselectMaterials: boolean;
  // tslint:disable-next-line:no-inferrable-types
  selectedRowIndex: number = -1;
  // selectedCompany = [];

  // lifts: string = "null";
  // culture: string = "null";
  // failure: string = "null";
  disabled_people_lifts_count: string = '';
  // constructionList: any;
  workList: any;
  workCapRepList: any;
  dataYearKP: any = '';
  executionKP: boolean = false;
  KP: boolean = false;
  byDistrictsKP: boolean = false;
  elementKP: any = null;
  materialList: any;
  actTR: boolean = true;
  planTR: boolean = true;
  factTR: boolean = true;
  byDistrictsDep: boolean = false;
  // allmtypes: RefItem[] = [];
  // allowntypes: Ownershipform[] = ownership_types;

  // allstreets: Street[] = outstreets;
  // settings$: Observable<GeneralSettings>;
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
  ];
  groupingsTR = [
    { name: 'Район', value: 'district', enabled: true },
    { name: 'Констр. элемент', value: 'structureElement', enabled: true },
    { name: 'Год', value: 'year', enabled: true },
    { name: 'Адрес', value: 'address', enabled: true },
    // { name: "Виды работ", value: "typeWork", enabled: true },
    // { name: "Адрес", value: "address", enabled: true },
  ];
  selectedGroupingsTR: any = [];
  selectedCurrentRepair: any;
  showByWorksTR: boolean = false;
  periodStartTR: any;
  periodEndTR: any;
  // structureElementIdTR: number;
  // typeWorkIdTR: number;

  constructor(
    private api: TeplistService,
    private common: CommonService,
    private refApi: RefserviceService,
    private apiStore: LocalStorageService,
    private _snackBar: MatSnackBar,
    private loadMkd: TepTableComponent,
    private apiHeader: HeaderComponent,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Запись не найдена';
    this.config.appendTo = 'body';
  }
  // Развернуть меню
  onToggleDropdown() {
    // this.multiSelect.toggleDropdown();
  }
  closeFilters() {
    this.apiHeader.openFiltersComponent();
  }
  // Сравниваем два объекта на идентичность
  deepEqual(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  //Обновление данных таблицы после изменений фильтра
  getNewFilteredData(v: any) {
    this.loadTepPage();
    if (
      !this.deepEqual(
        this.filterRequest,
        this.apiStore.getStore('mainPageUserFilters')
      )
    ) {
      this.apiStore.setStore('mainPageUserFilters', this.filterRequest);
      this.loadMkd.loadMkdListItems(this.filterRequest);
      this._snackBar.open('Данные обновленны', undefined, {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: 'snackbar-success',
      });
    }
  }

  //Отслеживаем изменения
  // this.streamFilters$.subscribe()
  timerOn: any = -1;
  setChangeFilters() {
    // this.loadTepPage();
    this.streamFilters$.next(this.filterRequest);
    // if (this.timerOn) {
    //   clearTimeout(this.timerOn);
    //   this.timerOn = setTimeout(() => {
    //     this.timerOn = null;
    //     this.getNewFilteredData();
    //     // clearTimeout(this.timerOn);
    //   }, 2000);
    // } else {
    //   this.timerOn = -1;
    // }
  }
  //пересчет материалов в зависимости от конструкторского элемента
  onOffselectMaterials: boolean = false;
  materialsChange(name: any) {
    this.selectedMaterials = [];
    if (name) {
      this.materialsForConst = this.apiStore.materialsChange(name);
      if (this.materialsForConst.length < 1) {
        this.onOffselectMaterials = true;
      } else {
        this.onOffselectMaterials = false;
      }
    }
    this.setChangeFilters();
    // else{
    //   this.onOffselectMaterials = true;
    // }
    // this.loadTepPage();
  }

  ///////////////////////////////////////////////
  ngOnInit(): void {
    this.filterRequest = this.apiStore.getStore('mainPageUserFilters');
    //подписываемся на изменение фильтра
    this.streamFilters$.pipe(debounceTime(2000)).subscribe((v) => {
      // tap((v) => console.log(v));
      this.getNewFilteredData(v);
    });
    // this.filterBindValues();
    // setTimeout(()=>{
    if (this.apiStore.checkStore('mainPageFilters')) {
      let data = this.apiStore.getStore('mainPageFilters');
      // this.allstreets = data[0];
      this.filters = data[1];
      this.allmtypes = (data[2] as { [key: string]: any })['data'];
      this.currType = (data[3] as { [key: string]: any })['data'];
      this.capType = data[4];
      this.columsSelectView = this.filterRequest.columns;
      this.selectedDistricts = this.filterRequest.district;
      // this.selectedDistricts = this.filterRequest.district;
      this.districts = this.filters.districts;
      this.categories = this.filters.categories;
      this.statuses = this.filters.statuses;
      this.construction_elements = this.filters.construction_elements;
      this.outstreets = this.apiStore.getDistrictStreets(
        this.filterRequest.district
      );
      this.materialsChange(this.filterRequest.defect_element_name);
      //  this.districtChange(this.filterRequest.district);
      //  this.columsSelectView = ["show_district_name","show_address"];
      this.filterBindValues();

      // this.apiStore.setStore("mainPageFilters", results)
    } else this.loadAllFilters();
    // });
  }

  // distStreets!: string[];
  //запрос улиц по району
  // districtChange(dist: any) {
  //   this.outstreets = [];
  //   if(dist.length){
  //     dist.forEach((el:any) => {
  //       this.allstreets.forEach(st=>{
  //         if(st.districts_ids.find(st=>st==el)){
  //           if(!this.outstreets.find(os=>os.id == st.id)){
  //             this.outstreets.push(st)
  //           }
  //         }
  //       })
  //     });
  //   } else {
  //     this.outstreets = this.allstreets
  //   }
  //   // this.outstreets = this.allstreets
  //   // this.common.getStreetsByDistrict(dist).subscribe((p) => {
  //   //   this.allstreets = p;
  //   // });
  // }
  //Сохранение фильтра в базу данных
  saveClientFilters() {
    this.loadTepPage();
    this.common.saveDbFilters(this.filterRequest).subscribe(
      (res) => {
        this._snackBar.open('Фильтр сохранен!', undefined, {
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'snackbar-success',
        });
      },
      (error) => {
        this._snackBar.open(JSON.stringify(error), undefined, {
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'snackbar-error',
        });
      }
    );
  }
  //Сброс на настройки из базы
  resetFilter() {
    this.common.getCommonUserInfo().subscribe(
      (res) => {
        let filtrs = res.settings.filters;
        this.filterRequest = filtrs;
        this.apiStore.setStore('mainPageUserFilters', filtrs);
        this.filterBindValues();
        // this.ngOnInit();
        // this.setChangeFilters();
        this._snackBar.open('Настройки сброшены на сохраненные!', undefined, {
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'snackbar-success',
        });
      },
      (error) => {
        this._snackBar.open(JSON.stringify(error), undefined, {
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'snackbar-error',
        });
      }
    );
  }
  // Выбор района
  selectDistrict(selected: any) {
    this.outstreets = this.apiStore.getDistrictStreets(selected);
    this.setChangeFilters();
    // }
  }
  // Выбор улицы
  selectStreet(selected: any) {
    // this.selectedStreet = selected;
    this.setChangeFilters();
  }
  //чекбокс Архив vrl
  archiveChange($event: any) {
    this.archive = $event.checked;
    this.setChangeFilters();
  }
  // Выбор уо
  // selectUO(selected: any) {
  //   // this.selectedCompany = selected;
  //   this.setChangeFilters();
  // }
  setColumsView(selected: any) {
    // this.columsSelectView = selected;
    this.setChangeFilters();
  }
  // workControl2 = new FormControl();
  // filteredOptions2: Observable<string[]> | undefined;
  // crepChange($event:any) {
  //   this.crep = $event.value;
  //   this.setChangeFilters();
  // }
  // private _filterWorkListCapRep(value: string): string[] {
  //   const filterValue = value ? value.toLowerCase() : "";
  //   // @ts-ignore
  //   return this.workCapRepList.filter(
  //     (option:any) => option.name.toLowerCase().search(filterValue) != -1
  //   );
  // }
  // crepView=["4"]
  // setCapFilters(selected: any) {
  //   this.crep = selected;
  //   this.crepView = selected;
  //   this.setChangeFilters();
  // }

  // Очистить фильтр
  unselectAll() {
    this.selectedStreet = [];
  }
  clearFilter() {
    //Основной
    this.selectedDistricts = []; //район

    this.selectedStreet = []; //улица

    this.number = ''; //номер
    this.building = ''; //корпус
    this.letter = ''; //литера
    this.house_construction = ''; //строение
    this.selectedCategories = []; //категория

    this.selectedOtypes = []; //Вид собственности

    this.failure = 'null'; //аварийность
    this.selectedCompany = []; //Управляющая компания

    this.selectedMtypes = []; //Тип управляющей организации

    this.culture = 'null'; //окн
    this.lifts = 'null'; //лифты

    //Дополнительный фильтр
    this.construction_elements = []; //Конструктивный элемент (износ)
    this.selectedDefectElements = NaN; //Конструктивный элемент
    this.damageFrom = 'null';
    this.damageTo = 'null';
    this.materialsForConst = ''; //Материал
    this.selectedMaterials = []; //Материал
    this.selectedStatuses = []; //Статус ТЭП

    this.selectedDefectRegister = []; //Статус акта осмотра
    this.selectedHeating = []; //Отопление
    this.selectedHotWater = []; //ГВС
    this.selectedGas = []; //Газоснабжение
    this.coldWater = 'null'; //ХВС
    this.electro = 'null';
    this.sewer = 'null';
    this.appz = 'null';
    this.pzu = 'null';
    this.archive = false;
    this.cap_repair = 'null';
    this.crep = '';
    this.crepFrom = '';
    this.crepTo = '';
    this.curr_repair = 'null'; //Текущий ремонт
    this.trep = '';
    this.trepFrom = '';
    this.trepTo = '';
    this.series = '';
    this.storeysFrom = '';
    this.storeysTo = '';
    this.buildFrom = '';
    this.buildTo = '';
    this.rbuildFrom = '';
    this.rbuildTo = '';
    // this.columsSelectView = []; // выбранные для отображения колонки
  }

  //изменение катигорий
  // catyChange($event: any) {
  //     this.filterRequest.category = $event.value;
  //   }

  // otypeChange($event: any) {}
  // mtypeChange($event: any) {}
  // failureChange($event: any) {}
  // oknChange($event: any) {}
  // liftChange($event: any) {}

  loadAllFilters() {
    forkJoin([
      this.common.getStreetsByDistrict([]),
      this.api.getFilters(),
      this.refApi.getRefList(AppSettings.MC_TYPE_ID),
      this.refApi.getCurrRepairApiRefList('workType&per_page=-1'),
      this.refApi.getCapRepairApiRefList(),
    ]).subscribe((results) => {
      // this.outstreets = results[0];
      this.filters = results[1];
      this.allmtypes = (results[2] as { [key: string]: any })['data'];
      this.currType = (results[3] as { [key: string]: any })['data'];
      this.capType = results[4];
      this.apiStore.setStore('mainPageFilters', results);
      // this.apiStore.getDistrictStreets([]);
      this.columsSelectView = this.filterRequest.columns;
      this.districts = this.filters.districts;
      this.categories = this.filters.categories;
      this.statuses = this.filters.statuses;
      this.construction_elements = this.filters.construction_elements;
      this.outstreets = this.apiStore.getDistrictStreets(
        this.filterRequest.district
      );
      this.materialsChange(this.filterRequest.materials);
      this.filterBindValues();
      // this.districtChange([]);
      // this.columsSelectView = []; // выбранные для отображения колонки

      // this.filteredOptions2 = this.workControl2.valueChanges.pipe(
      //   startWith(""),
      //   map((value) => this._filterWorkListCapRep(value))
      // );
    });
  }

  // clearFilter() {}
  // адресная часть

  filterBindValues() {
    //адрес
    this.selectedDistricts = this.filterRequest.district as [];
    this.selectedStreet = this.filterRequest.street as [];
    this.building = this.filterRequest.house_building;
    this.number = this.filterRequest.house_number;
    this.letter = this.filterRequest.house_letter;
    this.house_construction = this.filterRequest.house_construction;
    //Общие параметры
    this.selectedCategories = this.filterRequest.category as [];
    this.selectedOtypes = this.filterRequest.ownership as [];
    this.failure = this.filterRequest.failure;
    this.selectedCompany = this.filterRequest.management_company as [];
    this.selectedMtypes = this.filterRequest.management_form as [];
    this.culture = this.filterRequest.culture;
    this.lifts = this.filterRequest.lifts;

    this.damageFrom = this.filterRequest.damage_from;
    this.damageTo = this.filterRequest.damage_to;

    this.crepTo = this.filterRequest.capital_repair_to;
    this.crepFrom = this.filterRequest.capital_repair_from;

    this.trepTo = this.filterRequest.current_repair_to;
    this.trepFrom = this.filterRequest.current_repair_from;

    this.crep = this.filterRequest.capital_repair;
    this.trep = this.filterRequest.current_repair;

    this.house_construction = this.filterRequest.house_construction;

    this.selectedDefectElements = this.filterRequest.defect_element_name;
    this.selectedStatuses = this.filterRequest.statuses as [];
    this.selectedDefectRegister = this.filterRequest.statusesDR as [];

    this.selectedHotWater = this.filterRequest.hot_water as [];
    this.selectedGas = this.filterRequest.gas_name as [];
    this.selectedHeating = this.filterRequest.heating as [];
    this.selectedMaterials = this.filterRequest.materials as [];

    this.storeysFrom = this.filterRequest.storeys_from;
    this.storeysTo = this.filterRequest.storeys_to;
    this.series = this.filterRequest.project_type;
    this.buildFrom = this.filterRequest.bdate_from;
    this.buildTo = this.filterRequest.bdate_to;
    this.rbuildTo = this.filterRequest.rdate_to;
    this.rbuildFrom = this.filterRequest.rdate_from;

    this.electro = this.filterRequest.power;
    this.sewer = this.filterRequest.sewer;
    this.appz = this.filterRequest.appz;

    this.archive = this.filterRequest.archive;

    this.cap_repair = this.filterRequest.cap_repair;
    this.curr_repair = this.filterRequest.curr_repair;

    this.disabled_people_lifts_count =
      this.filterRequest.disabled_people_lifts_count;

    this.pzu = this.filterRequest.pzu;

    this.coldWater = this.filterRequest.coldwater;

    this.displayedColumns = this.filterRequest.columns;
    // this.loadTepPage();
  }
  loadTepPage() {
    // const this.tfilter = <TepListFilter>{};
    // this.filterRequest.pageIndex = this.paginator.pageIndex + 1;
    // this.filterRequest.limit = this.paginator.pageSize;
    // this.filterRequest.sortDirection =
    // (this.sort.direction === "asc" ? "" : "-") + this.sort.active;

    // адресная часть
    this.filterRequest.house_building = this.building;
    this.filterRequest.house_number = this.number;
    this.filterRequest.house_letter = this.letter;
    this.filterRequest.house_construction = this.house_construction;
    this.filterRequest.damage_from = this.damageFrom;
    this.filterRequest.damage_to = this.damageTo;

    this.filterRequest.capital_repair_to = this.crepTo;
    this.filterRequest.capital_repair_from = this.crepFrom;

    this.filterRequest.current_repair_to = this.trepTo;
    this.filterRequest.current_repair_from = this.trepFrom;

    this.filterRequest.capital_repair = this.crep;
    this.filterRequest.current_repair = this.trep;

    this.filterRequest.defect_element_name = this.selectedDefectElements;
    this.filterRequest.statuses = this.selectedStatuses;
    this.filterRequest.statusesDR = this.selectedDefectRegister;
    this.filterRequest.category = this.selectedCategories;
    // @ts-ignore
    this.filterRequest.street = this.selectedStreet;
    this.filterRequest.district = this.selectedDistricts;
    this.filterRequest.hot_water = this.selectedHotWater;
    this.filterRequest.gas_name = this.selectedGas;
    this.filterRequest.heating = this.selectedHeating;
    this.filterRequest.materials = this.selectedMaterials;
    this.filterRequest.management_company = this.selectedCompany;
    this.filterRequest.management_form = this.selectedMtypes;
    this.filterRequest.ownership = this.selectedOtypes;

    this.filterRequest.storeys_from = this.storeysFrom;
    this.filterRequest.storeys_to = this.storeysTo;
    this.filterRequest.project_type = this.series;
    this.filterRequest.bdate_from = this.buildFrom;
    this.filterRequest.bdate_to = this.buildTo;
    this.filterRequest.rdate_to = this.rbuildTo;
    this.filterRequest.rdate_from = this.rbuildFrom;

    this.filterRequest.power = this.electro;

    this.filterRequest.sewer = this.sewer;

    this.filterRequest.appz = this.appz;

    this.filterRequest.archive = this.archive;

    this.filterRequest.culture = this.culture;

    this.filterRequest.failure = this.failure;

    this.filterRequest.cap_repair = this.cap_repair;
    this.filterRequest.curr_repair = this.curr_repair;

    this.filterRequest.lifts = this.lifts;

    this.filterRequest.disabled_people_lifts_count =
      this.disabled_people_lifts_count;

    this.filterRequest.pzu = this.pzu;

    this.filterRequest.coldwater = this.coldWater;

    this.filterRequest.columns = this.columsSelectView;

    this.filterRequest.pageIndex = 1;
    this.filterRequest.limit = 10;
    this.filterRequest.sortDirection = "address";
  }
  // свернуть развернуть
  cBtn: boolean = true;
  checkBtn() {
    return (this.cBtn = !this.cBtn);
  }
  btnOpenExel: boolean = false; // показать заголовок Фильтр
  btnOE(e: any) {
    return (this.btnOpenExel = e);
  }
}
