import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import moment from "moment";
import { AuthenticationService } from "src/app/_services";
import { TepMenuItem } from "src/app/_models/tepmenu";
import { Statuses } from "src/app/_models/filters";
import { GeneralSettings, HouseInfo } from "src/app/_models/common";
import { DefectlistEntry } from "src/app/_models/defectlist";
import { CommonService } from "src/app/_services/common.service";
import { SettingsService } from "src/app/_services/settings.service";
import { TechstateService } from "src/app/_services/techstate.service";
import { DocumentsService } from "src/app/_services/documents.service";

@Component({
  selector: 'app-techstatedeleted',
  templateUrl: './techstatedeleted.component.html',
  styleUrls: ['./techstatedeleted.component.css']
})
export class TechstatedeletedComponent implements OnInit {

  permission: Boolean = false;

  tepMenu: TepMenuItem[];
  statuses: Statuses[] = [];

  house_id: number;
  // defect_id: number;
  // tep_part: string;
  menuTitle: string;

  currComp: string = "indicators";

  house_info: HouseInfo;

  settings$: Observable<GeneralSettings>;

  defectentries: DefectlistEntry[] = [];

  imageObject: Array<object> = [];

  defect: any = {
    dateFrom: "",
    comment: "",
    status: 1,
  };

  actDate: any;

  constructor(
    private common: CommonService,
    private route: ActivatedRoute,
    private settings: SettingsService,
    private api: TechstateService,
    private apiFiles: DocumentsService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.tepMenu = this.route.snapshot.data["tepMenu"];

    this.settings$ = this.settings.settings$;

    this.route.url.subscribe((url) => {
      this.house_id = parseFloat(url[1].path);
      // this.tep_part = url[2].path;
      // this.defect_id = parseInt(url[3].path, 10);

      this.common.getCommonInfo(this.house_id).subscribe((p) => {
        this.house_info = p;
      });

      this.common.getTepStatuses(this.house_id).subscribe((q) => {
        this.statuses = q;
      });

      // this.api.getDefectListList(this.house_id).subscribe((p) => {
      //   this.defect = p.filter((dfc) => dfc.id === this.defect_id)[0];
      //   // @ts-ignore
      //   this.actDate = this.defect.dateFrom
      // });

      // this.api
      //   .getDefectList(this.house_id, this.defect_id)
      //   .subscribe((p) => (this.defectentries = p));

      this.apiFiles.getFileList(this.house_id).subscribe((p) => {
        p.filter((img) => img.isImage == true).forEach((img) => {
          let data = { image: "", thumbImage: "" };
          data.image = "data:image/jpeg;base64," + img.raw;
          data.thumbImage = "data:image/jpeg;base64," + img.raw;
          this.imageObject.push(data);
        });
      });
    });
    this.permission = !this.authService.hasRole('ROLE_CONFIRM_TEP');
  }

  setStatus(status_id) {
    this.common
      .sendTepStatus(this.house_id, status_id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.house_info.current_status.status_id = status_id;
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

  openComission() {
    this.currComp = "commission";
  }

  openIndicators() {
    this.currComp = "indicators";
  }

  dateChange($event) {
    this.defect.dateFrom =
      moment($event.value).format("YYYY-MM-DD") +
      " " +
      moment().subtract(1, "days").format("HH:mm:ss");
  }

  createAct() {
    this.api.createDefectListList(this.house_id, this.defect).subscribe((p) => {
      this._snackBar.open("Акт осмотра создан", undefined, {
        panelClass: "snackbar-success",
      });
      this.onTechStateClicked(p["data"].id);
    });
  }

  onTechStateClicked(defect_id) {
    this.router.navigate(["mkd", this.house_id, "techstate", defect_id]);
  }
}
