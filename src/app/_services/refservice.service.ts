import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AppSettings } from "../appSettings";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  ReferenceListEntry,
  RefMaterialItem,
  RefMc,
  WeightCatItem,
} from "../_models/reference";
import { Category, Construction, District, RefItem } from "../_models/filters";
import { Street } from "../_models/common";
import { StructEl } from "../_models/common";
import { TypesStructEl } from "../_models/common";
import { TechCondStructEl } from "../_models/common";

@Injectable({
  providedIn: "root",
})
export class RefserviceService {
  constructor(private http: HttpClient) {}

  getReferenceList(): Observable<ReferenceListEntry[]> {
    return this.http
      .get<ReferenceListEntry[]>(
        AppSettings.API_ENDPOINT + "admin/reference/list"
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of refs!");
        })
      );
  }

  getCategoriesList(): Observable<Category[]> {
    return this.http
      .get<Category[]>(
        AppSettings.API_ENDPOINT + `admin/reference/${AppSettings.TYPE_MKD_ID}`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of cats!");
        })
      );
  }

  getDistrictList(): Observable<District[]> {
    return this.http
      .get<District[]>(
        AppSettings.API_ENDPOINT + `admin/reference/${AppSettings.DISTRICTS_ID}`
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of cats!");
        })
      );
  }

  getRefList(id: string): Observable<RefItem[]> {
    return this.http
      .get<RefItem[]>(AppSettings.API_ENDPOINT + `admin/reference/${id}`)
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of RefItem!");
        })
      );
  }

  //

  getCurrRepairApiRefList(type: any): Observable<RefItem[]> {
    return this.http
      .get<RefItem[]>(
        AppSettings.CURR_REPAIR_API_ENDPOINT + `rest/list?class=${type}`
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of RefItem!");
        })
      );
  }

  addCurrRepairApiRefList(type: any, params: any): any {
    return this.http
      .post<any>(
        AppSettings.CURR_REPAIR_API_ENDPOINT + `rest/save?class=${type}`,
        params
      )
      .pipe(catchError(this.handleError));
  }

  editCurrRepairApiRefList(type: string, params: any): any {
    return this.http
      .put<any>(
        AppSettings.CURR_REPAIR_API_ENDPOINT + `rest/save?class=${type}`,
        params
      )
      .pipe(catchError(this.handleError));
  }

  deleteCurrRepairApiRefList(type: string, id: any): any {
    return this.http
      .post(
        AppSettings.CURR_REPAIR_API_ENDPOINT + `rest/delete?class=${type}`,
        { ids: [id] }
      )
      .pipe(catchError(this.handleError));
  }

  //

  //

  getCapRepairApiRefList(): Observable<RefItem[]> {
    return this.http
      .get<RefItem[]>(
        AppSettings.API_ENDPOINT + `admin/refernce/overhaul-repair-works`
      )
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of RefItem!");
        })
      );
  }

  addCapRepairApiRefList(data: any): any {
    return this.http
      .put<any>(
        AppSettings.API_ENDPOINT + `admin/refernce/overhaul-repair-works`,
        data
      )
      .pipe(catchError(this.handleError));
  }

  editCapRepairApiRefList(id: number, data: any): any {
    return this.http
      .post<any>(
        AppSettings.API_ENDPOINT + `admin/refernce/overhaul-repair-works/${id}`,
        data
      )
      .pipe(catchError(this.handleError));
  }

  deleteCapRepairApiRefList(id: number): any {
    return this.http
      .delete(
        AppSettings.API_ENDPOINT + `admin/refernce/overhaul-repair-works/${id}`
      )
      .pipe(catchError(this.handleError));
  }

  //

  //

  getConstructionList(): Observable<Construction[]> {
    return this.http
      .get<Construction[]>(
        AppSettings.API_ENDPOINT +
          `admin/reference/${AppSettings.CURR_REP_ELEMENTS_ID}`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of Construction!");
        })
      );
  }

  getMcList(): Observable<RefMc[]> {
    return this.http
      .get<RefMc[]>(
        `${AppSettings.API_ENDPOINT}admin/reference/${AppSettings.MC_ID}`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of refmc!");
        })
      );
  }

  getMaterialList(): Observable<RefMaterialItem[]> {
    return this.http
      .get<RefMaterialItem[]>(
        `${AppSettings.API_ENDPOINT}admin/reference/${AppSettings.CONCRETE_MATERIAL_ID}`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of RefMaterialItem!");
        })
      );
  }

  getStreetList(): Observable<Street[]> {
    return this.http
      .get<Street[]>(
        AppSettings.API_ENDPOINT + `admin/reference/${AppSettings.STREETS_ID}`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of cats!");
        })
      );
  }

  getVsnSctuctElList(): Observable<StructEl[]> {
    return this.http
      .get<StructEl[]>(
        AppSettings.API_ENDPOINT + `admin/reference/${AppSettings.VSN_SE_ID}`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of cats!");
        })
      );
  }

  getVsnTypesSctuctElList(): Observable<TypesStructEl[]> {
    return this.http
      .get<TypesStructEl[]>(
        AppSettings.API_ENDPOINT + `admin/reference/${AppSettings.VSN_TSE_ID}`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of cats!");
        })
      );
  }

  getVsnTechCondSctuctElList(vsn_id: number): Observable<TechCondStructEl[]> {
    return this.http
      .get<TechCondStructEl[]>(
        AppSettings.API_ENDPOINT + `admin/reference/${vsn_id}`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of cats!");
        })
      );
  }

  // --------------------------------- MTSMKD-74

    // 1 уровень

  getTechStateConstructionElementList(): Observable<TechCondStructEl[]> {
    return this.http
      .get<TechCondStructEl[]>(
        AppSettings.API_ENDPOINT +
          `admin/techstate-reference/construction-element`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of cats!");
        })
      );
  }

  getTechStateConstructionElementAdd(
    data: any
  ): Observable<TechCondStructEl[]> {
    return this.http
      .put<TechCondStructEl[]>(
        AppSettings.API_ENDPOINT +
          `admin/techstate-reference/construction-element`,
        data
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of cats!");
        })
      );
  }

  getTechStateConstructionElementEdit(
    id: number,
    data: any
  ): Observable<TechCondStructEl[]> {
    return this.http
      .post<TechCondStructEl[]>(
        AppSettings.API_ENDPOINT +
          `admin/techstate-reference/construction-element/${id}`,
        data
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of cats!");
        })
      );
  }

  getTechStateConstructionElementDelete(
    id: number
  ): Observable<TechCondStructEl[]> {
    return this.http
      .delete<TechCondStructEl[]>(
        AppSettings.API_ENDPOINT +
          `admin/techstate-reference/construction-element/${id}`
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          return throwError("Something went wrong: list of cats!");
        })
      );
  }

    // 2 уровень

    getTechStateMaterialsByIdList(id: any): Observable<TechCondStructEl[]> {
      return this.http
        .get<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/construction-element/${id}/materials`
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

    addTechStateMaterials(data: any): Observable<TechCondStructEl[]> {
      return this.http
        .put<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/materials`, data
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

    editTechStateMaterials(id: any, data: any): Observable<TechCondStructEl[]> {
      return this.http
        .post<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/materials/${id}`, data
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

    deleteTechStateMaterials(id: any): Observable<TechCondStructEl[]> {
      return this.http
        .get<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/materials/${id}`
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

    // 3 уровень

    getTechStateDepreciationScaleByIdList(id: any): Observable<TechCondStructEl[]> {
      return this.http
        .get<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/materials/${id}/depreciation-scale`
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

    addDepreciationScale(data: any): Observable<TechCondStructEl[]> {
      return this.http
        .put<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/depreciation-scale`, data
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

    editDepreciationScale(id: any, data: any): Observable<TechCondStructEl[]> {
      return this.http
        .post<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/depreciation-scale/${id}`, data
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

    deleteDepreciationScale(id: any): Observable<TechCondStructEl[]> {
      return this.http
        .delete<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/depreciation-scale/${id}`
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

    // 4 уровень

    getTechStateWearSignByIdList(id: any): Observable<TechCondStructEl[]> {
      return this.http
        .get<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/depreciation-scale/${id}/wear-sign`
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

    addWearSign(data: any): Observable<TechCondStructEl[]> {
      return this.http
        .put<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/wear-sign`, data
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

    editWearSign(id: any, data: any): Observable<TechCondStructEl[]> {
      return this.http
        .post<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/wear-sign/${id}`, data
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

    deleteWearSign(id: any): Observable<TechCondStructEl[]> {
      return this.http
        .delete<TechCondStructEl[]>(
          AppSettings.API_ENDPOINT +
            `admin/techstate-reference/wear-sign/${id}`
        )
        .pipe(
          map((res) => {
            return res;
          }),
          catchError((error) => {
            return throwError("Something went wrong: list of cats!");
          })
        );
    }

  // --------------------------------- MTSMKD-74

  addRef(ref: string, params: any): any {
    return this.http
      .put<any>(AppSettings.API_ENDPOINT + "admin/reference/" + ref, {
        data: params,
      })
      .pipe(catchError(this.handleError));
  }

  editRef(id: number, ref: string, params: any): any {
    return this.http
      .post<any>(
        AppSettings.API_ENDPOINT + "admin/reference/" + ref + "/" + id,
        { data: params }
      )
      .pipe(catchError(this.handleError));
  }

  deleteRef(ref: number, id: number): any {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "admin/reference/" + ref + "/" + id)
      .pipe(catchError(this.handleError));
  }
//------------------------------------------mtsmkd2021-5
btnGetRef(){
  return this.http
  .put<any>(AppSettings.API_ENDPOINT + "admin/refernce/se-specific-weight/import-data-tree-from-refs",{})
  .pipe(catchError((error) => {
    return throwError(error);
  }));
  }
getWeightCat(): Observable<WeightCatItem[]> {
  return this.http
    .get<WeightCatItem[]>(
      AppSettings.API_ENDPOINT +`admin/refernce/se-specific-weight-categories`
    )
    .pipe(
      map((res) => {
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
}
addWeightCat(params: { categoryId: any; }): any {
  return this.http
    .put<any>(AppSettings.API_ENDPOINT + "admin/refernce/se-specific-weight-categories",{categoryId: params.categoryId})
    .pipe(catchError((error) => {
      return throwError(error);
    }));
}
addWeightEl(params: { categoryId: any; structuralElementId: any; weightFactor: any; }): any {
  return this.http
    .put<any>(AppSettings.API_ENDPOINT + "admin/refernce/se-specific-weight-elements",{categoryId: params.categoryId, structuralElementId: params.structuralElementId, weightFactor: params.weightFactor  })
    .pipe(catchError((error) => {
      return throwError(error);
    }));
}
editWeightCat(id: number, catId: number): any {
  return this.http
    .post<any>(
      AppSettings.API_ENDPOINT + "admin/refernce/se-specific-weight-categories/" + id,
      { categoryId: catId }
    )
    .pipe(catchError((error) => {
      return throwError(error);
    }));
}
editWeightEl(idEl: number, catId: number, strElId: number, wFactor: number ): any {
  return this.http
    .post<any>(
      AppSettings.API_ENDPOINT + "admin/refernce/se-specific-weight-elements/" + idEl,
      { categoryId: catId,
        structuralElementId: strElId,
        weightFactor: wFactor
      }
    )
    .pipe(catchError((error) => {
      return throwError(error);
    }));
}

deleteWeightCat(id: number): any {
  return this.http
    .delete(AppSettings.API_ENDPOINT + "admin/refernce/se-specific-weight-categories/" + id)
    .pipe(catchError((error) => {
      return throwError(error);
    }));
}
deleteWeightEl(id: number): any {
  return this.http
    .delete(AppSettings.API_ENDPOINT + "admin/refernce/se-specific-weight-elements/" + id)
    .pipe(catchError((error) => {
      return throwError(error);
    }));
}
addKatElement(ref: string, params: any, id: string): any {
  return this.http
    .put<any>(AppSettings.API_ENDPOINT + "admin/reference/" + ref+"/"+id, {data: params})
    .pipe(catchError((error) => {return throwError(error);}));
}

editKatElement(id: number, ref: string, params: any, elId: string): any {
  return this.http
    .post<any>(
      AppSettings.API_ENDPOINT + "admin/reference/" + ref + "/" + id +"/"+ elId,
      { data: params }
    )
    .pipe(catchError((error) => {return throwError(error);}));
}

delKatElement(ref: string, id: number, elId: number): any {
  return this.http
    .delete(AppSettings.API_ENDPOINT + "admin/reference/" + ref + "/" + id + "/" + elId)
    .pipe(catchError((error) => {return throwError(error);}));
}
  // Обработка ошибок
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("Возникла ошибка:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Сервер возвратил статус ${error.status}, ` + `ошибка: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Не удалось выполнить запрос, сообщите администратору");
  }
}
