export interface Mkdlistitem {
  favorite: boolean;
  district_id: number;
  district_name: string;
  house_id: number;
  street_id: number;
  street_name: string;
  address: string;
  house_category_id: number;
  category_name: string;
  total_damage: number;
  floor_count: number;
  status_name: string;
}

export interface Options {
  page: number;
  limit: number;
  sort: string;
  total: number;
}

export interface Filters {
  district: number;
  category: number;
  street: string;
  house: string;
  house_letter: string;
}

export interface TepList {
  options: Options;
  filters: Filters;
  data: {
    items: Mkdlistitem[];
  };
}
