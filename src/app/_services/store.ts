import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  // проверка на наличие переменной в сторе
  checkStore(val: any) {
    if (localStorage.getItem(String(val))) {
      return true;
    }
    return false;
  }
  //Добавить в стор
  setStore(name: string, data: any) {
    if (data) {
      let aaa = JSON.stringify(data);
      localStorage.setItem(name, JSON.stringify(data));
    }
  }
  //Запрос из стор
  getStore(name: string) {
    return JSON.parse(localStorage[name]);
  }
  outstreets: any;
  //запрос улицы по району
  getDistrictStreets(dist: any) {
    this.outstreets = [];
    let streets = this.getStore('mainPageFilters')[0];
    if (dist.length) {
      dist.forEach((el: any) => {
        streets.forEach((st: any) => {
          if (st.districts_ids.find((dt: any) => dt == el)) {
            if (!this.outstreets.find((os: any) => os.id == st.id)) {
              this.outstreets.push(st);
            }
          }
        });
      });
      this.outstreets.sort((a: any, b: any) => a.name.localeCompare(b.name));
      return this.outstreets;
    } else {
      streets.sort((a: any, b: any) => a.name.localeCompare(b.name));
      return streets;
    }
  }
  //запрос материалов по конструктивным элементам
  // materials: any;
  materialsChange(id_ce: any) {
    let materialList = this.getStore('mainPageFilters')[3]; //материалы
    if (id_ce) {
      // let elements = this.getStore('mainPageFilters')[5];
      // let constructionList = elements["data"].filter((el:any)=>el["parent"] > 0); // Конструкторские элемент
      // let idElem = constructionList.find((el:any)=>el.name == name).id; // получаем ID конс.эл.
       let materials = materialList.data.filter((el:any) => el.structural_element_id == id_ce );
      return materials.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else {
      return []
    }
  }
}
