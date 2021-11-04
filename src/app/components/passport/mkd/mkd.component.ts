import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { TepMenuItem } from '../../../_models/tepmenu';
import { TepField } from '../../../_models/tep';
import { GeneralSettings, HouseInfo } from '../../../_models/common';
import { CommonService } from '../../../_services/common.service';
import { GetCurrentMenuService } from '../../../_services/getcurrentmenu.service';
import { TeplistService } from '../../../_services/teplist.service';
import { SettingsService } from '../../../_services/settings.service';
import { first } from 'rxjs/operators';
import { Statuses } from '../../../_models/filters';
import { DocumentsService } from '../../../_services/documents.service';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-mkd',
  templateUrl: './mkd.component.html',
  styleUrls: ['./mkd.component.scss'],
})
export class MkdComponent implements OnInit {
  permission: boolean = false;

  tepMenu: TepMenuItem[] = [];
  tepFields: TepField[] = [];

  house_id: number=-1;
  tep_part: string="";
  menuTitle: string="";

  back: string = "";
  next: string = "";

  house_info: HouseInfo | undefined;
  statuses: Statuses[] = [];

  settings$?: Observable<GeneralSettings>;

  isTable: number | undefined;

  imageObject: Array<object> = [];

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private common: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private localapi: GetCurrentMenuService,
    private api: TeplistService,
    private apiFiles: DocumentsService,
    private settings: SettingsService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.tepMenu = this.route.snapshot.data['tepMenu'];
    this.tepFields = this.route.snapshot.data['fields'];

    this.tep_part = this.route.snapshot.data['section'];
    this.house_id = this.route.snapshot.data['houseid'];

    // this.settings$ = this.settings.settings$;

    this.route.url.subscribe((url) => {
      this.loadingSubject.next(true);

      this.house_id = parseFloat(url[1].path);
      this.tep_part = url[2].path;

      this.common.getCommonInfo(this.house_id).subscribe((p) => {
        this.house_info = p;
      });

      this.common.getTepStatuses(this.house_id).subscribe((q) => {
        this.statuses = q;
      });

      this.apiFiles.getFileList(this.house_id).subscribe((p) => {
        p.filter((img) => img.isImage == true).forEach((img) => {
          let data = { image: '', thumbImage: '' };
          data.image = 'data:image/jpeg;base64,' + img.raw;
          data.thumbImage = 'data:image/jpeg;base64,' + img.raw;
          this.imageObject.push(data);
        });
      });
      if (this.tep_part === 'lifts-equipment-data') {
        this.isTable = 22;
      } else if (this.tep_part === 'common-information') {
        this.isTable = 21;
      } else if (this.tep_part === 'special-engineering-equipment') {
        this.isTable = 20;
      } else if (this.tep_part === 'improvement-playgrounds') {
        this.isTable = 19;
      } else if (this.tep_part === 'special-purpose-rooms') {
        this.isTable = 18;
      } else if (this.tep_part === 'electricity-supply') {
        this.isTable = 17;
      } else if (this.tep_part === 'interior-finishing') {
        this.isTable = 16;
      } else if (this.tep_part === 'heat-supply-system') {
        this.isTable = 15;
      } else if (this.tep_part === 'external-finishing') {
        this.isTable = 14;
      } else if (this.tep_part === 'window-opening-doorway') {
        this.isTable = 13;
      } else if (this.tep_part === 'watersupply-sewerage') {
        this.isTable = 12;
      } else if (this.tep_part === 'house-roofing') {
        this.isTable = 11;
      } else if (this.tep_part === 'basements-walls-floors') {
        this.isTable = 10;
      } else if (this.tep_part === 'metering-devices') {
        this.isTable = 9;
      } else if (this.tep_part === 'metering-system') {
        this.isTable = 8;
      } else if (this.tep_part === 'energy-use') {
        this.isTable = 7;
      } else if (this.tep_part === 'energy-cost') {
        this.isTable = 6;
      } else if (this.tep_part === 'temperature-conditions') {
        this.isTable = 5;
      } else if (this.tep_part === 'explication-land') {
        this.isTable = 4;
      } else if (this.tep_part === 'cleaning-areas') {
        this.isTable = 3;
      } else if (this.tep_part === 'living-quarters-characteristics') {
        this.isTable = 2;
      } else if (this.tep_part === 'overhaul-information') {
        this.isTable = 1;
      } else {
        this.isTable = 0;
      }

      this.menuTitle = this.localapi.getSelectedItem(
        this.tepMenu,
        this.tep_part
      ).menuCaption;
    });

    this.permission = !this.authService.hasRole('ROLE_CONFIRM_TEP');
  }

  onNotify(message: boolean): void {
    document.getElementById('back')!.style.display = "";
    document.getElementById('next')!.style.display = '';
    let arr:any = [];
    this.tepMenu.forEach((elem) => {
      elem.items.forEach((item) => {
        return arr.push(item);
      });
    });
    arr.forEach((item, i) => {
      if (item.alias === this.tep_part) {
        console.log(item.alias);
        this.back = arr[i - 1]
          ? arr[i - 1].alias
          : (document.getElementById('back')!.style.display = 'none');
        this.next = arr[i + 1]
          ? arr[i + 1].alias
          : (document.getElementById('next')!.style.display = 'none');
        console.log();
      }
    });

    this.loadingSubject.next(false);
  }

  statusChange(values: any) {
    if (values.currentTarget.checked) {
      this.api
        .sendTepToReview(this.house_id)
        .pipe(first())
        .subscribe(
          (data) => {
            this.router.navigate(['/mkd', this.house_id, this.tep_part]);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  setStatus(status_id) {
    this.common
      .sendTepStatus(this.house_id, status_id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.house_info!.current_status.statusId = status_id;
          // this.house_info.current_status.status_name = status.status_name;

          this.common.getTepStatuses(this.house_id).subscribe((q) => {
            this.statuses = q;
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  OnChange($event) {
    this.settings.setEditMode($event.checked);
  }

  directionSection(direction) {
    switch (direction) {
      case 'back':
        this.router.navigate(['/mkd', this.house_id, this.back]);
        break;
      case 'next':
        this.router.navigate(['/mkd', this.house_id, this.next]);
        break;
    }
  }
}
