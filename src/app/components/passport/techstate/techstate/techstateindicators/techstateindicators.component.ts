import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-techstateindicators",
  templateUrl: "./techstateindicators.component.html",
  styleUrls: ["./techstateindicators.component.css"],
})
export class TechstateindicatorsComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  @Input() defectentries;
  @Input() damage;
  @Input() totalDamage;
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();

  house_id: number;
  defect_id: number;
  defects: any = [];

  displayedColumns = [
    "id",
    "structural_element_name",
    "structural_element_detail_names",
    "techStateDescr",
    "coefficient",
    "damage",
    "damagePeriod",
  ];

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.house_id = parseFloat(url[1].path);
      this.defect_id = parseInt(url[3].path, 10);
    });

    this.defectentries.forEach((defect) => {
      defect.childs.forEach((child) => {
        this.defects.push(child);
      });
    });
  }

  onRowClicked(entry_id): void {
    // this.router.navigate([
    //   "mkd",
    //   this.house_id,
    //   "techstate",
    //   this.defect_id,
    //   entry_id,
    // ]);
    this.dataChanged.emit(entry_id);
  }

  getCostCoefficient() {
    this.defects = [];
    this.defectentries.forEach((defect) => {
      defect.childs.forEach((child) => {
        this.defects.push(child);
      });
    });
    return (
      this.defectentries
        .map((el) => el.childs)
        .flat()
        .map((el) => el.coefficient)
        .reduce((acc, value) => Number(acc) + Number(value), 0) ||
      "Нет результата"
    );
  }
}
