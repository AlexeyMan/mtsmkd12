import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TechstateService } from 'src/app/_services/techstate.service';

@Component({
  selector: 'app-techstatephoto',
  templateUrl: './techstatephoto.component.html',
  styleUrls: ['./techstatephoto.component.css']
})

export class TechstatephotoComponent implements OnInit {

  displayedColumns = ['image', 'title', 'id'];

  defectAreasImageObject: Array<any> = [];

  form = new FormGroup({});

  constructor( 
    private api: TechstateService,
    private _snackBar: MatSnackBar,   
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.updatePhotoArray(this.data.photo);
  }

  uploadPhoto(data) {
    let formData = new FormData();
    Object.values(data).forEach(elem => {
      // @ts-ignore
      formData.append("files[]", elem);
    })

    this.api.addPhoto(this.data.house_id, this.data.defect_id, this.data.defect_section, formData).subscribe(
      (res) => {
        this.updatePhotoArray(this.bloblToImg(res.data))

        this._snackBar.open("Фото успешно загружено", undefined, {
          panelClass: "snackbar-success",
        });
      },
      (error) => {
        this._snackBar.open("Ошибка загрузки фото", undefined, {
          panelClass: "snackbar-error",
        });
      }
    )
  }

  deletePhoto(id) {
    this.api.deletePhoto(this.data.house_id, this.data.defect_id, this.data.defect_section, id).subscribe(
      (res) => {
              this.defectAreasImageObject.filter(elem => elem.id != id)
              this.updatePhotoArray(this.bloblToImg(this.defectAreasImageObject.filter(elem => elem.id != id)))
              this._snackBar.open("Фото успешно удалено", undefined, {
                panelClass: "snackbar-success",
              });
            },
            (error) => {
              this._snackBar.open("Ошибка удаления фото", undefined, {
                panelClass: "snackbar-error",
              });
            }
    )
  }

  updatePhoto() {
    let data = {"files": []};

    Object.keys(this.form.value).forEach(key => {
      data.files.push({id: Number(key), comment: this.form.value[Number(key)]})
    });
    if(data.files.length) {
      this.api.updatePhoto(this.data.house_id, this.data.defect_id, this.data.defect_section, data).subscribe(
      (res) => {
              this._snackBar.open("Фото успешно обновлено", undefined, {
                panelClass: "snackbar-success",
              });
              this.defectAreasImageObject.forEach((elem, i) => {
                this.defectAreasImageObject[i].title = this.form.value[elem.id];
              });
              this.updatePhotoArray(this.defectAreasImageObject);
            },
            (error) => {
              this._snackBar.open("Ошибка обновления фото", undefined, {
                panelClass: "snackbar-error",
              });
            }
    ) 
    } else {
      this._snackBar.open("Нет данных для обновления", undefined, {
        panelClass: "snackbar-warning",
      });
    }
 
  }

  toArray(element) {
    return [element];
  }

  updatePhotoArray(data) {
    this.defectAreasImageObject = data
    const formGroup = {};
    if (this.defectAreasImageObject != undefined) {
    this.defectAreasImageObject.forEach((element) => {
      formGroup[element.id] = new FormControl(element.title, undefined);
    });
    this.form = new FormGroup(formGroup);
    }

  }

  bloblToImg(data) {
    data.map(img => {
      img.image = "data:image/jpeg;base64," + img.image;
      img.thumbImage = "data:image/jpeg;base64," + img.thumbImage;
    return img
    })
    return data;
  }

  closeDialog() {
    this.dialogRef.close({defect_id: this.data.defect_section, photo: this.defectAreasImageObject})
  }
}
