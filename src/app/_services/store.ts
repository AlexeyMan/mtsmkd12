
import { Injectable } from "@angular/core";
@Injectable({ providedIn: "root" })
export class LocalStorageService {
  // проверка на наличие переменной в сторе
  checkStore(val:any){
    if(localStorage.getItem( String(val))){
      return true
    }
    return false
  }
  //Добавить в стор
  setStore(name:string, data:any){
    if(data){
      localStorage.setItem(
        name,
        JSON.stringify(data)
      );
    }
  }
//Запрос из стор
  getStore(name:string){
    return JSON.parse(localStorage[name])
  }
  outstreets:any;
  //запрос улицы по району
  getDistrictStreets(dist:any){
    this.outstreets = [];
    let streets = this.getStore("mainPageFilters")[0];
    if(dist.length){
      dist.forEach((el:any) => {
        streets.forEach((st:any) =>{
          if(st.districts_ids.find((dt:any)=>dt==el)){
            if(!this.outstreets.find((os:any)=>os.id == st.id)){
              this.outstreets.push(st)
            }
          }
        })
      });
      this.outstreets.sort((a:any, b:any) => a.name.localeCompare(b.name))
      return this.outstreets
    } else {
      streets.sort((a:any, b:any) => a.name.localeCompare(b.name))
      return streets
    }
  }
}
