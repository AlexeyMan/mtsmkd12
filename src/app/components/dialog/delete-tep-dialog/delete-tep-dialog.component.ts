import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-delete-tep-dialog",
  templateUrl: "./delete-tep-dialog.component.html",
  styleUrls: ["./delete-tep-dialog.component.css"],
})
export class DeleteDialogComponent implements OnInit {
  constructor(
    public dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialog.close();
  }
}
