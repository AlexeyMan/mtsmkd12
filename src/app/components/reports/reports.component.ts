import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgSelectConfig } from '@ng-select/ng-select';
import { LocalStorageService } from 'src/app/_services/store';
import { TeplistService } from 'src/app/_services/teplist.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  groupings = [
    { name: 'Район', value: 'district', enabled: true },
    { name: 'Категория', value: 'category', enabled: true },
    { name: 'Управляющая организация', value: 'organization', enabled: true },
    { name: 'Износ', value: 'wear', enabled: true },
  ];
  selectedGroupings: any = [];
  addressGroup: any = false;
  resultsFieldsSelected: string = 'common';
  resultsFields: any = [
    { name: 'Общие сведения', value: 'common' },
    {
      name: 'Характеристики жилых помещений',
      value: 'characteristicsLivingQuarters',
    },
    { name: 'Уборочная площадь внутренняя', value: 'internalCleaningArea' },
    { name: 'Уборочная площадь внешняя', value: 'externalCleaningArea' },
    { name: 'Экспликация земельного участка', value: 'explicationLandPlot' },
    {
      name: 'Фундаменты, Стены и перегородки, Перегородки, Полы',
      value: 'basementsWallsFloors',
    },
    { name: 'Проемы', value: 'openings' },
    { name: 'Крыша, Кровля', value: 'roof' },
    { name: 'Отделка внутренняя', value: 'internalFinishing' },
    { name: 'Отделка наружная', value: 'externalFinishing' },
    { name: 'Система теплоснабжения', value: 'heatingSystem' },
    { name: 'Система водоснабжения', value: 'waterSupplySystem' },
    { name: 'Система электроснабжения', value: 'powerSupplySystem' },
    { name: 'Помещения специальные', value: 'specialPremises' },
    { name: 'Благоустройство', value: 'landscaping' },
  ];
  periodStartTR: any;
  periodEndTR: any;
  structureElementIdTR: number = 0;
  constructionList: any;
  typeWorkIdTR: number = 0;
  workList: any;
  actTR: boolean = true;
  planTR: boolean = true;
  factTR: boolean = true;
  selectedGroupingsTR: any = [];
  showByWorksTR: boolean = false;
  groupingsTR = [
    { name: 'Район', value: 'district', enabled: true },
    { name: 'Констр. элемент', value: 'structureElement', enabled: true },
    { name: 'Год', value: 'year', enabled: true },
    { name: 'Адрес', value: 'address', enabled: true },
    // { name: "Виды работ", value: "typeWork", enabled: true },
    // { name: "Адрес", value: "address", enabled: true },
  ];
  dataYearKP: any = '';
  elementKP: any = null;
  byDistrictsKP: boolean = false;
  executionKP: boolean = false;
  KP: boolean = false;
  byDistrictsDep: boolean = false;
  selectedGroupingsDep: any = [];

  constructor(
    private _snackBar: MatSnackBar,
    private apiHeader: HeaderComponent,
    private apiStore: LocalStorageService,
    private config: NgSelectConfig,
    private api: TeplistService,
  ) {
    this.config.notFoundText = 'Запись не найдена';
    this.config.appendTo = 'body';
  }

  closeReports() {
    this.apiHeader.openReportsComponent();
  }
  ngOnInit(): void {
    // this.constructionList = [];
    // this.workList = [];
    if (this.apiStore.checkStore('mainPageFilters')) {
      let data = this.apiStore.getStore('mainPageFilters');
      let p = data[5]; //Конструктивные элементы (текуший ремонт)
      // let wl = data[3]; // вид работ
      this.constructionList = p['data'].filter((el: any) => el['parent'] > 0);
      // this.workList = wl['data'];
      this.workList = (data[3] as { [key: string]: any })['data'];// вид работ
    }
  }
  changeEvent($event: any) {
    this.addressGroup = $event.checked;
  }

  onNgModelChange($event: any) {
    console.log($event);
    this.selectedGroupings = $event;
  }
  exportExcel() {
    let data: any = {};
    data.sortedGroups = this.groupings
      .map((x) => {
        if (this.selectedGroupings.includes(x.value)) {
          return x.value;
        }
        return 0;
      })
      .filter((f) => f != 0);
    if (data.sortedGroups.length > 0 || this.addressGroup) {
      // data.filter = this.tfilter;
      data.fields = this.resultsFieldsSelected;
      data.addressGroup = this.addressGroup;
      data.outputType = 'xlsx';
      this.api.exportExcel(data).subscribe(
        (res:any) => {
          if (res.size > 20) {
            console.log("start download:", res);
            const url = window.URL.createObjectURL(res);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.setAttribute("style", "display: none");
            a.href = url;
            a.download = "Статестическая информация.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
          }
        },
        (error:any) => {
          this._snackBar.open(JSON.stringify(error), undefined, {
            panelClass: "snackbar-error",
            duration: 2000,
          });
          console.log("download error:");
        }
      );
    } else
      this._snackBar.open(
        '"Группировки" либо "Адрес" должны быть заполнены!',
        undefined,
        {
          panelClass: 'snackbar-warning',
          duration: 2000,
        }
      );
  }

  //пересчет материалов в зависимости от конструкторского элемента
  // onOffselectMaterials: boolean = false;
  sortWorkList: any;//список работ
  onOffselectEl: boolean = false;
  materialsChangeExel(elK: any) {
    if (elK) {
      let ConstElem = this.constructionList.find((el: any) => el.id == elK.id);
      this.sortWorkList = this.workList.filter(
        (el: any) => el.structural_element_id == ConstElem.id
      );
      this.sortWorkList.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
      if (this.sortWorkList.length < 1) {
        this.onOffselectEl = true;
      } else {
        this.onOffselectEl = false;
      }
    } else {
      // this.onOffselectMaterials = true;
      this.sortWorkList = undefined;
    }
  }

  exportExcelTR() {
    let tfilter = this.apiStore.getStore('mainPageUserFilters');
      let sortedGroups = this.groupingsTR
        .map((x) => {
          if (this.selectedGroupingsTR.includes(x.value)) {
            return x.value;
          }
          return 0;
        })
        .filter((f) => f != 0);
      let fields = [];
      if (this.actTR) fields.push("act");
      if (this.planTR) fields.push("plan");
      if (this.factTR) fields.push("fact");
      // if (this.showByWorks) sortedGroups.push("showByWorks");
      if (sortedGroups.length > 0 && (this.planTR || this.factTR)) {
        let data = {
          outputType: "xlsx",
          periodStart: this.periodStartTR
            ? this.periodStartTR.format("DD.MM.YYYY")
            : null,
          structureElementId: this.structureElementIdTR,
          typeWorkId: this.typeWorkIdTR,
          periodEnd: this.periodEndTR
            ? this.periodEndTR.format("DD.MM.YYYY")
            : null,
          sortedGroups: sortedGroups,
          showByWorks: this.showByWorksTR,
          filter: tfilter,
          fields: fields,
        };
        this.api.exportExcelTR(data).subscribe(
          (res) => {
            this._snackBar.open("Успешно", undefined, {
              panelClass: "snackbar-success",
              duration: 2000,
            });
            console.log("start download:", res);
            const url = window.URL.createObjectURL(res);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.setAttribute("style", "display: none");
            a.href = url;
            a.download = "Текущий ремонт.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
          },
          (error) => {
            if (error == "Not Found") {
              this._snackBar.open(
                "Пустой отчёт! По выбранным параметрам данных в Системе нет!",
                undefined,
                {
                  panelClass: "snackbar-warning",
                  duration: 2000,
                }
              );
            }
          }
        );
      } else {
        this._snackBar.open('"Группировки", а также "План" и/или "Факт" должны быть заполнены!', undefined, {
          panelClass: "snackbar-warning",
          duration: 2000,
        });
      }
  }
  onNgModelChangeTR($event: any) {
    console.log($event);
    this.selectedGroupingsTR = $event;
  }
  dropTR(event: any) {
    // moveItemInArray(this.groupingsTR, event.previousIndex, event.currentIndex);
  }
  changeEventShowByWorksTR($event: any) {
    this.showByWorksTR = $event.checked;
  }
  reportKP() {
    // let year
    // try { year = Number(this.dataYearKP._i) || this.dataYearKP.getFullYear() } catch { year = "" }
    // this.api
    //   .exportExcelKP(
    //     year,
    //     this.elementKP,
    //     this.byDistrictsKP,
    //     this.executionKP,
    //     this.KP,
    //     this.tfilter
    //   )
    //   .subscribe(
    //     (res) => {
    //       this._snackBar.open("Успешно", undefined, {
    //         panelClass: "snackbar-success",
    //       });
    //       console.log("start download:", res);
    //       const url = window.URL.createObjectURL(res);
    //       const a = document.createElement("a");
    //       document.body.appendChild(a);
    //       a.setAttribute("style", "display: none");
    //       a.href = url;
    //       a.download = "capital_repair.xlsx";
    //       a.click();
    //       window.URL.revokeObjectURL(url);
    //       a.remove();
    //     },
    //     (error) => {
    //       this._snackBar.open("Ошибка", undefined, {
    //         panelClass: "snackbar-error",
    //       });
    //       console.log("download error:", JSON.stringify(error));
    //     }
    //   );
  }
  eventByDistrictsKP($event: any) {
    this.byDistrictsKP = $event.checked;
  }
  eventExecutionKP($event: any) {
    this.executionKP = $event.checked;
  }
  eventKP($event: any) {
    this.KP = $event.checked;
  }
//Износ конструктивных элементов Отчет
  reportDep() {
    let tfilter = this.apiStore.getStore('mainPageUserFilters');
    this.api
      .exportExcelDep(
        this.selectedGroupingsDep,
        this.byDistrictsDep,
        tfilter
      )
      .subscribe(
        (res:any) => {
          this._snackBar.open("Успешно", undefined, {
            panelClass: "snackbar-success",
            duration: 2000,
          });
          const url = window.URL.createObjectURL(res);
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.href = url;
          a.download = "Износ КЭ Отчет.xlsx";
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        },
        (error:any) => {
          this._snackBar.open("Ошибка: " + error, undefined, {
            panelClass: "snackbar-error",
            duration: 2000,
          });
          console.log("download error:", JSON.stringify(error));
        }
      );
  }
  eventByDistrictsDep($event: any) {
    this.byDistrictsDep = $event.checked;
  }
  onNgModelChangeDep($event: any) {
    this.selectedGroupingsDep = $event;
  }
}
