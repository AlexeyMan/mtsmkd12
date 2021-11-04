import { Injectable } from '@angular/core';
import { TepMenuItem, TepMenuSubitem } from '../_models/tepmenu';

@Injectable({
  providedIn: 'root',
})
export class GetCurrentMenuService {
  constructor() {}

  getSelectedItem(tepMenu: TepMenuItem[], menuAlias: string): TepMenuSubitem {
    let result: TepMenuSubitem = {
      id: 0,
      menuCaption: '',
      parentId: 0,
      alias: '',
    };
    tepMenu.forEach((element) => {
      element.items.forEach((subelement) => {
        if (subelement.alias != null && subelement.alias === menuAlias) {
          result = subelement;
        } else if (subelement.id === parseInt(menuAlias, 10)) {
          result = subelement;
        }
      });
    });
    return result;
  }
}
