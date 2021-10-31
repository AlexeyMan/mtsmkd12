import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Mkdlistitem } from '../../_models/mkdlistitem';
import { TeplistService } from '../../_services/teplist.service';
import { LocalStorageService } from '../../_services/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-favorit-tabs',
  templateUrl: './favorit-tabs.component.html',
  styleUrls: ['./favorit-tabs.component.scss'],
})
export class FavoritTabsComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Mkdlistitem>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() displayedColumns: any = [];
  @Output() onChanged = new EventEmitter<Object>();

  filter: any = {
    limit: 100,
    page: 1,
    sortDirection: 'address',
    total: 4,
    userId: 1,
  };

  changeFavorite(id: number, isFavorite: boolean) {
    this.onChanged.emit({ id, isFavorite });
  }
  // открываем колонку удалить
  tabDel: boolean = false;
  openDel() {
    this.tabDel = !this.tabDel;
  }
  // displayedColumns = [
  //   'favorite',
  //   'house_id',
  //   'district_name',
  //   'address',
  //   'category_name',
  //   'total_damage',
  //   'status_name',
  //   'total_building_area',
  //   'living_building_area',
  //   'management_company',
  //   'heating_name',
  //   'bdate',
  // ];

  totalNitem: number = 10;

  constructor(
    private api: TeplistService,
    private apiStore: LocalStorageService
  ) {}

  ngOnInit(): void {
    if (this.apiStore.checkStore('favoriteTeps')) {
      let teps = this.apiStore.getStore('favoriteTeps');
      this.dataSource = new MatTableDataSource(teps.data);
      this.totalNitem = teps.options.total;
      // this.displayedColumns = this.columns;
      this.getFavoriteList();//TODO сделать перегрузку
    } else {
      this.getFavoriteList();
    }
  }
  drop(event: CdkDragDrop<Mkdlistitem>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }
  // на полный экран таблицу
  resTabs: boolean = false;
  resizeTable() {
    this.resTabs = !this.resTabs;
  }
  // pageChange($event) {
  //   this.pageEvent = $event;
  //   this.getFavoriteList(this.pageEvent.pageIndex + 1, this.pageEvent.pageSize);
  // }

  getFavoriteList(pageIndex = 1, pageSize = 100) {
    this.api
      .getTepListFavorite({
        sortDirection: 'address',
        pageIndex: pageIndex,
        limit: pageSize,
        favorite: 1,
      })
      .subscribe((teps) => {
        let data = (teps as { [key: string]: any })['data'];
        let options = (teps as { [key: string]: any })['options'];
        this.dataSource = new MatTableDataSource(data);
        this.totalNitem = options.total;
        // this.displayedColumns = this.columns;
        this.apiStore.setStore('favoriteTeps', teps);
        this.ngAfterViewInit();
      });
  }

  ngAfterViewInit(): void {
    if (this.apiStore.checkStore('favoriteTeps')) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // setTimeout(
      //   () =>
      //     (this.totalNitem = Number(
      //       this.apiStore.getStore('mainPageTotal')
      //     ))
      // );
    }
  }
}
