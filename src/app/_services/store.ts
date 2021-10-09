
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
    localStorage.setItem(
      name,
      JSON.stringify(data)
    );
  }
//Запрос из стор
  getStore(name:string){
    return JSON.parse(localStorage[name])
  }
}
