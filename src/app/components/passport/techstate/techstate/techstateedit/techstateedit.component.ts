import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { TepMenuItem } from "../../../../../_models/tepmenu";
import { GeneralSettings, HouseInfo } from "../../../../../_models/common";
import { Observable } from "rxjs";
import {
  DefectList,
  DefectlistEntry,
  DefectRef,
} from "../../../../../_models/defectlist";
import { CommonService } from "../../../../../_services/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SettingsService } from "../../../../../_services/settings.service";
import { TechstateService } from "../../../../../_services/techstate.service";
import { first } from "rxjs/operators";

import { Statuses } from "../../../../../_models/filters";
import { NestedTreeControl, FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeNestedDataSource,
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from "@angular/material/tree";
import { SelectionModel } from "@angular/cdk/collections";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { RefserviceService } from "src/app/_services/refservice.service";
import { MatDialog } from "@angular/material/dialog";
import { TechstatevsnComponent } from "./techstatevsn/techstatevsn.component";
import { param } from "jquery";
import { TechstatephotoComponent } from "./techstatephoto/techstatephoto.component";

export class EventData {
  name: string;
  value: any;
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

@Component({
  selector: "app-techstateedit",
  templateUrl: "./techstateedit.component.html",
  styleUrls: ["./techstateedit.component.css"],
})
export class TechstateeditComponent implements OnInit {

  static updateDefectData(p: unknown[]) {
    throw new Error("Method not implemented.");
  }

  private transformer = (node: any, level: number) => {
    return {
      expandable: !!node.childs && node.childs.length > 0,
      name: node.structural_element_name,
      level: level,
      node: node,
    };
  };
  treeControl = new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.childs
  );
  dataSourceTree = new MatTreeFlatDataSource(
    this.treeControl,
    this.treeFlattener
  );
  dataSourceTable: MatTableDataSource<any>;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  hasChild = (_: number, node: any) => node.expandable;

  childs: any;
  coefficient: any;
  comment: any;
  damage: any;
  damagePeriod: any;
  failure_state: any;
  id: any;
  inspection_date_remark: any;
  necessaryWorkListLink: any;
  necessary_work_cost: any = 0;
  necessary_work_list: any;
  parent_id: any;
  repair_date_remark: any;
  section: any;
  materials: any;
  structural_element_detail_names: any;
  structural_element_id: any;
  structural_element_name: any;
  techStateDescr: any;
  techStateDescrLink: any;
  update_date: any;
  is_field: any;
  psize: any;
  size_measure_unit: any;
  weight_factor: any;

  currentSubparent: any;

  @Input() defectentry;
  @Input() defect_entry_id;

  tepMenu: TepMenuItem[];
  statuses: Statuses[] = [];
  house_id: number;
  defect_id: number;
  tep_part: string;
  menuTitle: string;
  max_number: number;
  house_info: HouseInfo;
  settings$: Observable<GeneralSettings>;

  defect: DefectList;
  defectref$: Observable<DefectRef>;
  structuralElementRef: any;

  imageObject: Array<object> = [];

  displayedColumns: string[] = [
    "id",
    "section_number",
    "section_size",
    "damage",
    "damage_by_size",
    "images",
  ];
  selection = new SelectionModel<any>(true, []);
  editForm: FormGroup;
  disabled: boolean = this.settings.canEdit() ? true : false;
  techCondDescriptions: any[] = [];
  filteredWorks: any;
  refWorksTypes: any;
  activeNode: any;
  isShowForm: boolean = false;

  oldData: any;

  takeAccountMaterial: boolean = false;

  constructor(
    private common: CommonService,
    private route: ActivatedRoute,
    private settings: SettingsService,
    private api: TechstateService,
    private formBuilder: FormBuilder,
    private apiRF: RefserviceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.api.on("updatedData", (data: any) => {
      data.forEach(elem => {
        if (elem.data.structuralElementParamId == this.id || elem.data.structuralElementParentId == this.id) {
          this.comment = elem.data.paramComment;
          this.section = elem.data.defectSections;
          this.dataSourceTable = new MatTableDataSource(this.section);
        }
      })
    })

    this.dataSourceTree.data = this.defectentry;

    this.settings$ = this.settings.settings$;

    this.route.url.subscribe((url) => {
      this.house_id = parseFloat(url[1].path);
      this.tep_part = url[2].path;
      this.defect_id = parseInt(url[3].path, 10);
      this.common.getCommonInfo(this.house_id).subscribe((p) => {
        this.house_info = p;
      });

      this.api.getDefectListList(this.house_id).subscribe((p) => {
        this.defect = p.filter((dfc) => dfc.id === this.defect_id)[0];
        // @ts-ignore
        this.actDate = this.defect.dateFrom;
      });

      this.common.getTepStatuses(this.house_id).subscribe((q) => {
        this.statuses = q;
      });

      this.apiRF
        .getCurrRepairApiRefList("workType&per_page=-1")
        .subscribe((p) => {
          // @ts-ignore
          this.refWorksTypes = p["data"];

          this.defectentry.forEach((dfc, i) => {
            // @ts-ignore
            dfc.childs.forEach((child, j) => {
              if (child.id == this.defect_entry_id) {
                this.setSelected(
                  child,
                  this.defectentry[i].structural_element_name
                );
                this.expandNode(this.defectentry[i].id);
              }
            });
          });
        });
    });

    // this.apiRF.getVsnTechCondSctuctElList(13).subscribe((p) => {
    //   this.vsntechCondDescriptions = p["data"];
    // });

    // this.apiRF.getVsnTechCondSctuctElList(14).subscribe((p) => {
    //   this.vsnTechCondWorks = p["data"];
    // });

    this.editForm = this.formBuilder.group({
      childs: new FormControl({ value: this.childs, disabled: this.disabled }),
      coefficient: new FormControl({
        value: this.coefficient,
      }),
      comment: new FormControl({
        value: this.comment,
      }),
      damage: new FormControl({ value: this.damage }),
      failure_state: new FormControl({
        value: this.failure_state,
      }),
      damagePeriod: new FormControl({ value: this.damagePeriod }),
      id: new FormControl({ value: this.id, disabled: this.disabled }),
      inspection_date_remark: new FormControl({
        value: this.inspection_date_remark,
      }),
      necessaryWorkListLink: new FormControl({
        value: this.necessaryWorkListLink,
        disabled: this.disabled,
      }),
      necessary_work_cost: new FormControl({
        value: this.necessary_work_cost,
      }),
      necessary_work_list: new FormControl({
        value: this.necessary_work_list,
        disabled: this.disabled,
      }),
      parent_id: new FormControl({
        value: this.parent_id,
        disabled: this.disabled,
      }),
      repair_date_remark: new FormControl({
        value: this.repair_date_remark,
      }),
      section: new FormControl({
        value: this.section,
        disabled: this.disabled,
      }),
      materials: new FormControl({
        value: this.materials,
        disabled: this.disabled,
      }),
      structural_element_detail_names: new FormControl({
        value: this.structural_element_detail_names,
        disabled: this.disabled,
      }),
      structural_element_id: new FormControl({
        value: this.structural_element_id,
        disabled: this.disabled,
      }),
      structural_element_name: new FormControl({
        value: this.structural_element_name,
        disabled: this.disabled,
      }),
      techStateDescr: new FormControl({
        value: this.techStateDescr,
        disabled: this.disabled,
      }),
      techStateDescrLink: new FormControl({
        value: this.techStateDescrLink,
        disabled: this.disabled,
      }),
      update_date: new FormControl({
        value: this.update_date,
        disabled: this.disabled,
      }),
      is_field: new FormControl({
        value: this.is_field,
        disabled: this.disabled,
      }),
      size: new FormControl({
        value: this.psize,

      }),
      size_measure_unit: new FormControl({
        value: this.size_measure_unit,
        disabled: this.disabled,
      }),
      takeAccountMaterial: new FormControl({
        value: this.takeAccountMaterial,
      }),
    });

    function btnClick() {
      try {
        document.getElementById("sbmt").click();
        // console.log("click");
      } catch {
        // console.log("no click");
      }
    }
    setInterval(btnClick, 1000);

    let param = this.getParam("open");
    if (param) {
      this.expandNode(Number(969773))
      this.expandNode(Number(969792))
      this.setSelected(
        this.defectentry[1].childs[1].childs[0],
        this.defectentry[1].childs[1].childs[0].structural_element_name
      );
    }
  }

  getParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
      return "";
    else
      return results[1];
  }

  expandNode(id) {
    this.treeControl.dataNodes.forEach((element, i) => {
      if (element.node.id == id) {
        this.treeControl.expand(this.treeControl.dataNodes[i]);
      }
    });
  }

  get f() {
    return this.editForm.controls;
  }

  getStructuralElementRef(section: string = "") {
    this.api.getDefectRef(section).subscribe((p) => {
      this.structuralElementRef = p;
    });
  }

  getFilteredWorksRef(name: string = "") {
    this.api.getFilteredWorks(name).subscribe((p) => {
      this.filteredWorks = p;
    });
  }

  getTechCondDescriptionsRef(name: string = "", material_id: any[]) {
    if (name && material_id.length) {
      this.api.getTechCondDescriptions(name, material_id).subscribe((p) => {
        // this.techCondDescriptions = this.techCondDescriptionsConvert(p);
        this.techCondDescriptions = p;
      });
    } else {
      this.techCondDescriptions = [];
    }
  }

  openVSN() {
    const dialogRef = this.dialog.open(TechstatevsnComponent, {
      data: "data",
      disableClose: true,
    });
  }

  onSubmit(form) {
    let defectentryResult: any = {
      id: this.id,
      // structural_element_name: this.f.structural_element_name.value,
      // structural_element_id: this.structural_element_id,
      techStateDescr: this.f.techStateDescr.value,
      techStateDescrLink: this.f.techStateDescrLink.value,
      necessary_work_list: this.f.necessary_work_list.value,
      necessaryWorkListLink: this.f.necessaryWorkListLink.value,
      necessary_work_cost: this.f.necessary_work_cost.value || 0,
      coefficient: this.f.coefficient.value,
      damage: this.f.damage.value,
      repair_date_remark: this.f.repair_date_remark.value,
      inspection_date_remark: this.f.inspection_date_remark.value,
      comment: this.f.comment.value,
      materials: this.f.materials.value,
      section: this.dataSourceTable.data,
      failure_state: this.f.failure_state.value,
      size: this.f.size.value
    };
    if (this.api.concreteDefectsData.length > 0) {
      let trigger = true;
      this.api.concreteDefectsData.forEach((element, i) => {
        if (element.id == defectentryResult.id) {
          this.api.concreteDefectsData[i] = defectentryResult;
          trigger = false;
        }
      });
      if (trigger) {
        this.api.concreteDefectsData.push(defectentryResult);
      }
    } else {
      this.api.concreteDefectsData.push(defectentryResult);
    }

    this.defectentry.forEach((dfc, i) => {
      if (dfc.id === defectentryResult.id) {
        Object.keys(defectentryResult).forEach((key) => {
          dfc[key] = defectentryResult[key];
        });
      } else {
        dfc.childs.forEach((child_dfc_1) => {
          if (child_dfc_1.id === defectentryResult.id) {
            Object.keys(defectentryResult).forEach((key) => {
              child_dfc_1[key] = defectentryResult[key];
            });
          } else {
            child_dfc_1.childs.forEach((child_dfc_2) => {
              if (child_dfc_2.id === defectentryResult.id) {
                Object.keys(defectentryResult).forEach((key) => {
                  child_dfc_2[key] = defectentryResult[key];
                });
              }
            });
          }
        });
      }
    });
  }

  setSelected(params, parent = "", subparent = "") {
    this.childs = params.childs;
    this.coefficient = params.coefficient;
    this.comment = params.comment;
    this.damage = params.damage;
    this.damagePeriod = params.damagePeriod;
    this.failure_state = params.failure_state;
    this.id = params.id;
    this.inspection_date_remark = params.inspection_date_remark;
    this.necessaryWorkListLink = params.necessaryWorkListLink;
    this.necessary_work_cost = params.necessary_work_cost || 0;
    this.necessary_work_list = params.necessary_work_list;
    this.parent_id = params.parent_id;
    this.repair_date_remark = params.repair_date_remark;
    params.section = params.section.map(section => {
      section.images = this.bloblToImg(section.images);
      return section;
    })
    this.dataSourceTable = new MatTableDataSource(params.section);
    this.section = params.section;
    this.materials = params.materials;
    this.structural_element_detail_names =
      params.structural_element_detail_names;
    this.structural_element_id = params.structural_element_id;
    this.structural_element_name = params.structural_element_name;
    this.techStateDescr = params.techStateDescr;
    this.techStateDescrLink = params.techStateDescrLink;
    this.update_date = params.update_date;
    this.is_field = params.is_field;
    this.psize = params.size;
    this.size_measure_unit = params.size_measure_unit;
    this.weight_factor = params.weight_factor;
    // this.filteredWorks
    // this.refWorksTypes
    this.activeNode = params.id;
    this.defectentry.forEach((dfc, i) => {
      if (dfc.id != params.id) {
        dfc.childs.forEach((child, j) => {
          if (child.id != params.id) {
            child.childs.forEach((field) => {
              if (field.id == params.id) {
                this.filteredWorks = this.refWorksTypes.filter(
                  (work) =>
                    work.structural_element_id === child.structural_element_id
                );
                parent = dfc.structural_element_name;
                subparent = child.structural_element_name;
              }
            });
          } else {
            this.filteredWorks = this.refWorksTypes.filter(
              (work) =>
                work.structural_element_id === child.structural_element_id
            );
            parent = dfc.structural_element_name;
            subparent = child.structural_element_name;
          }
        });
      }
    });

    this.currentSubparent = subparent;

    subparent ? (this.isShowForm = true) : (this.isShowForm = false);
    this.getFilteredWorksRef(subparent);
    this.getStructuralElementRef(subparent);
    this.getTechCondDescriptionsRef(subparent, this.materials);

    if (document.getElementById("damage")) {
      document.getElementById("damage").style.display = "none";
      document.getElementById("necessary_work_cost").style.display = "none";
    }

    this.oldData = JSON.parse(JSON.stringify(params));
  }

  materialsChange(e) {
    this.techStateDescrLink = [];
    if (this.takeAccountMaterial) {
      if (this.currentSubparent && this.materials.length) {
        this.api
          .getTechCondDescriptions(this.currentSubparent, this.materials)
          .subscribe((p) => {
            // this.techCondDescriptions = this.techCondDescriptionsConvert(p);
            this.techCondDescriptions = p;
          });
      } else {
        this.techCondDescriptions = [];
      }
    } else {
      if (this.currentSubparent) {
        this.api
          .getTechCondDescriptions(this.currentSubparent, '')
          .subscribe((p) => {
            // this.techCondDescriptions = this.techCondDescriptionsConvert(p);
            this.techCondDescriptions = p;
          });
      } else {
        this.techCondDescriptions = [];
      }
    }
  }

  // techCondDescriptionsConvert(data) {
  //   let arr = [];
  //   data.forEach((el) => {
  //     el.wearSigns.forEach((wearSign) => {
  //       wearSign.selectName =
  //       el.wsName + " (" + el.dsName + " " + el.materialName + ")"
  //       wearSign.name;
  //       arr.push(wearSign);
  //     });
  //   });
  //   return arr;
  // }

  selectedTechCondName() {
    if (this.techStateDescrLink.length && this.techCondDescriptions.length) {
      let res = "";
      this.techStateDescrLink.forEach((id, i) => {
        res += this.techCondDescriptions.filter((el) => el.id === id)[0].name;
        if (this.techStateDescrLink[this.techStateDescrLink.length - 1] !== id)
          res += ", ";
      });
      return res;
    } else {
      return "";
    }
  }

  diffPercent(a, i) {
    let oldVal = this.oldData;
    if (Number(oldVal[i])) {
      if (
        oldVal[i] * 0.9 > a.srcElement.value ||
        oldVal[i] * 1.1 < a.srcElement.value
      ) {
        document.getElementById(i).style.display = "inherit";
      } else document.getElementById(i).style.display = "none";
    }
  }

  deleteRow(element) {
    this.section = this.dataSourceTable.data.filter(
      (value, key) => value.section_number != element.section_number
    );
    this.dataSourceTable = new MatTableDataSource(this.section);
  }

  addRow() {
    let newSectionNumber;
    if (this.dataSourceTable.data.length > 0) {
      newSectionNumber = this.dataSourceTable.data[0].section_number + 1;
    } else {
      newSectionNumber = 1;
    }

    this.section.unshift({
      id: 0,
      damage: 0,
      damage_by_size: 0,
      element_size: 0,
      section_number: newSectionNumber,
      section_size: 0,
      images: [],
    });
    this.dataSourceTable = new MatTableDataSource(this.section);
  }

  damageBySize(element): number {
    let result;
    if (this.dataSourceTable.data.length >= 2) {
      let elementSize = 0;
      this.dataSourceTable.data.forEach(
        (data) => (elementSize += Number(data.section_size))
      );
      this.dataSourceTable.data.forEach((data, i) => {
        if (element.section_number == data.section_number) {
          result = (
            (Number(data.damage) * Number(data.section_size)) /
            Number(elementSize)
          ).toFixed(2);
          this.dataSourceTable.data[i].damage_by_size = result;
        }
      });
    } else result = "Введите ещё один участок";
    return isNaN(result) && result != "Введите ещё один участок"
      ? "Нет результата"
      : result;
  }

  getSizeCost() {
    if (this.dataSourceTable) {
      return this.dataSourceTable.data
        .map((t) => t.section_size)
        .reduce((acc, value) => Number(acc) + Number(value), 0);
    }
  }

  damageBySizeCost() {
    if (this.dataSourceTable) {
      return (
        this.dataSourceTable.data
          .map((t) => t.damage_by_size)
          .reduce((acc, value) => Number(acc) + Number(value), 0) ||
        "Нет результата"
      );
    }
  }

  dateChangeRepair($event) {
    let date = $event.targetElement.value.split(".");
    // @ts-ignore
    this.repair_date_remark =
      date[2] + "-" + date[1] + "-" + date[0] + " 00:00:00";
  }

  dateChangeInspection($event) {
    let date = $event.targetElement.value.split(".");
    // @ts-ignore
    this.inspection_date_remark =
      date[2] + "-" + date[1] + "-" + date[0] + " 00:00:00";
  }

  failureChange($event) {
    this.failure_state = $event.checked;
  }

  defectAreasPhoto(data) {
    let dialogRef = this.dialog.open(TechstatephotoComponent, {
      data: { photo: data.images, house_id: this.house_id, defect_id: this.defect_id, defect_section: data.id },
      disableClose: true,
      width: "1000px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.section.forEach((elem, i) => {
        if (result.defect_id == elem.id) {
          this.section[i].images = result.photo;
        };
      });
      this.dataSourceTable = new MatTableDataSource(this.section);
    });
  }

  bloblToImg(data) {
    data.map(img => {
      img.image = "data:image/jpeg;base64," + img.image;
      img.thumbImage = "data:image/jpeg;base64," + img.thumbImage;
      return img
    })
    return data;
  }
}
