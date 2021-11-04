import { Component, OnInit, Input } from "@angular/core";
import { SettingsService } from "src/app/_services/settings.service";
import { Observable } from "rxjs";
import { GeneralSettings } from "src/app/_models/common";

@Component({
  selector: "app-techstatecommission",
  templateUrl: "./techstatecommission.component.html",
  styleUrls: ["./techstatecommission.component.css"],
})
export class TechstatecommissionComponent implements OnInit {
  
  @Input() comission: number;

  constructor(private settings: SettingsService) {}

  settings$: Observable<GeneralSettings>;

  ngOnInit(): void {
    this.settings$ = this.settings.settings$;
  }

  OnChange($event) {
    this.settings.setEditMode($event.checked);
  }
}
