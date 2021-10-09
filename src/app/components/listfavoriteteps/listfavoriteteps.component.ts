import { Component, OnInit, Inject } from "@angular/core";
import { TeplistService } from "src/app/_services/teplist.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { PageEvent } from "@angular/material/paginator";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { DeleteDialogComponent } from "../../dialog/delete-tep-dialog/delete-tep-dialog.component";

@Component({
  selector: "app-listfavoriteteps",
  templateUrl: "./listfavoriteteps.component.html",
  styleUrls: ["./listfavoriteteps.component.css"],
})
export class ListfavoritetepsComponent implements OnInit {
  constructor(
    private api: TeplistService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  pageEvent: PageEvent;
  filter: any = {
    limit: 10,
    page: 1,
    sortDirection: "address",
    total: 4,
    userId: 1,
  };
  dataSource: any;
  displayedColumns = [
    "favorite",
    "house_id",
    "district_name",
    "address",
    "category_name",
    "total_damage",
    "status_name",
    "total_building_area",
    "living_building_area",
  ];

  ngOnInit(): void {
    this.getFavoriteList();
  }

  pageChange($event) {
    this.pageEvent = $event;
    this.getFavoriteList(this.pageEvent.pageIndex + 1, this.pageEvent.pageSize);
  }

  getFavoriteList(pageIndex = 1, pageSize = 10) {
    this.api
      .getTepListEntries({
        sortDirection: "address",
        pageIndex: pageIndex,
        // @ts-ignore
        limit: pageSize,
        // @ts-ignore
        favorite: 1,
      })
      .subscribe((teps) => {
        this.dataSource = teps;
      });
  }

  addToFavourites(id: number, isFavorite: boolean) {
    this.api.toFavorite(id, !isFavorite).subscribe(
      (res) => {
        if (this.pageEvent) {
          this.getFavoriteList(
            this.pageEvent.pageIndex + 1,
            this.pageEvent.pageSize
          );
        } else {
          this.getFavoriteList();
        }
      },
      (error) => {
        this._snackBar.open(JSON.stringify(error), undefined, {
          panelClass: "snackbar-error",
        });
      }
    );
  }

  deleteTep(id: number) {
    let data = {
      header: "Удаление записи ТЭП МКД",
      message: "Вы действительно хотите удалить выбранную запись ТЭП МКД?",
    };
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: data,
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api.deleteTep(id).subscribe(
          (res) => {
            this._snackBar.open("Запись успешно удалена", undefined, {
              panelClass: "snackbar-success",
            });
            if (this.pageEvent) {
              this.getFavoriteList(
                this.pageEvent.pageIndex + 1,
                this.pageEvent.pageSize
              );
            } else {
              this.getFavoriteList();
            }
          },
          (error) => {
            this._snackBar.open("Ошибка удаления записи", undefined, {
              panelClass: "snackbar-error",
            });
          }
        );
      }
    });
  }

  onRowClicked(row, event) {
    if (
      typeof event.target === "object" &&
      event.target !== null &&
      !Array.isArray(event.target)
    ) {
      if (Object.keys(event.target.dataset).includes("stopPropagation")) {
        return;
      }
    }

    this.router.navigate(["mkd", row["house_id"], "common-parameters"]);
  }
}
