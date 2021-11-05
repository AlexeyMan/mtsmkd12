import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { TepMenuItem } from "../../_models/tepmenu";
import { Router } from "@angular/router";
import { DefectList } from "src/app/_models/defectlist";
import { TechstateService } from "src/app/_services/techstate.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { GeneralSettings } from "src/app/_models/common";
import { SettingsService } from "src/app/_services/settings.service";
import { AuthenticationService } from "../../_services";
import moment from 'moment';

@Component({
  selector: "app-topmenu",
  templateUrl: "./topmenu.component.html",
  styleUrls: ["./topmenu.component.scss"],
})
export class TopmenuComponent implements OnInit {
  @Input() tepMenu: TepMenuItem[]=[];
  @Input() tepPart: string = "";
  @Input() house_id: number = -1;

  @Input()
  set isDefectsUpdate(isDefectsUpdate: boolean) {
    this.getDefectList();
  }

  settings$: Observable<GeneralSettings> | undefined;

  @ViewChild("childMenu", { static: true }) public childMenu: any;

  defectLists: DefectList[] = [];
  permission: String = '';

  constructor(
    private router: Router,
    private api: TechstateService,
    private _snackBar: MatSnackBar,
    private settings: SettingsService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.settings$ = this.settings.settings$;
    this.getDefectList()
  }

  getDefectList() {
    this.api.getDefectListList(this.house_id).subscribe((p) => {
      p.forEach((elem) => {
        elem["dateFrom"] = new Date(elem["dateFrom"].split(" ")[0]);
      });
      p.sort((a: any, b: any) => {
        a = new Date(a["dateFrom"]);
        b = new Date(b["dateFrom"]);
        return a > b ? -1 : a < b ? 1 : 0;
      });
      p.forEach((elem) => {
        elem["dateFrom"] = moment(elem["dateFrom"]).format("DD.MM.YYYY");
      });
      this.defectLists = p;

      if ((this.authService.hasRole('ROLE_ADMIN'))) {
        this.permission = "ROLE_ADMIN";
      } else if (this.authService.hasRole('ROLE_CONFIRM_DEFECT_ACT')) {
        this.permission = "ROLE_CONFIRM_DEFECT_ACT";
      }
    });
  }

  onRowClicked(house_id, path) {
    this.router.navigate(["mkd", house_id, path]);
  }

  onTechStateClicked(defect_id) {
    this.router.navigate(["mkd", this.house_id, "techstate", defect_id]);
  }

  techStateDelete(defect_id) {
    this.api.deleteDefectList(this.house_id, defect_id).subscribe((p) => {
      this._snackBar.open(`Запись удалена`, undefined, {
        panelClass: "snackbar-success",
      });
      this.defectLists = this.defectLists.filter(
        (list) => list.id != defect_id
      );
      this.router.navigate(["mkd", this.house_id, "techstate", defect_id, "deleted"]);
    });
  }

  newTechStateClicked() {
    this.router.navigate(["mkd", this.house_id, "techstate-new"]);
  }

  OnChange($event) {
    this.settings.setEditMode($event.checked);
  }
}
