import { Statuses } from "./filters";

export interface HouseInfo {
  id: number;
  current_status: Statuses;
  statuses: Statuses[];
  district: string;
  address: string;
  category: string;
  department: string;
  coefficient_sum: number;
  total_damage: number;
  filename: string;
  eas_id: number;
  district_name: string;
}

export interface GeneralSettings {
  menuPosition: Boolean;
  canEdit: any;
  showDebugPanel: Boolean;
  visible_columns: string[];
}
interface IObjectKeys {
  [key: string]: string | number | any;
}
export interface TepListFilter extends IObjectKeys {
  district: number[];
  street: string[];
  house_number: string;
  house_building: string;
  house_letter: string;
  house_construction: string;

  selectedStreet: any[];
  category: number[];
  materials: number[];
  failure: string;
  culture: string;
  lifts: string;
  management_form: number[];
  ownership: number[];
  management_company: number[];
  statuses: number[];
  heating: string[];
  hot_water: string[];
  gas_name: string[];
  power: string;
  pzu: string;
  appz: string;
  archive: boolean;
  disabled_people_lifts_count: string;
  coldwater: string;
  sewer: string;
  project_type: string;
  storeys_from: number;
  storeys_to: number;
  bdate_from: number;
  bdate_to: number;
  rdate_to: number;
  rdate_from: number;
  damage_from: number;
  damage_to: number;
  defect_element_name: number;
  statusesDR: number[];

  cap_repair: string;
  curr_repair: string;

  pageIndex: number;
  limit: number;
  sortDirection: string;

  columns: string[];

  capital_repair_to: number;
  capital_repair_from: number;

  current_repair_to: number;
  current_repair_from: number;

  capital_repair: string;
  current_repair: string;
}

export interface Ownershipform {
  id: number;
  name: string;
}

export interface Street {
  id: number;
  districts_ids: [];
  name: string;
  street_name_old: string;
}

export interface StatusListEntry {
  statusId: number;
  statusName: string;
  alias: string;
}

export interface AddressOptions {
  sortDirection: string;
  pageSize: number;
  page: number;
  sort: string;
  total: number;
}

export interface Addresses {
  options: AddressOptions;
  data: AddressItem[];
}

export interface UserInfoDepartment {
  department_id: number;
  department_name: string;
  description: string;
}

export interface UserInfoGroups {
  group_id: number;
  group_name: string;
}

export interface UserInfo {
  id: number;
  roles: string[];
  departments: UserInfoDepartment[];
  groups: UserInfoGroups[];
  settings: any;
  username: string;
  phone: string;
  avatar: string;
  user_full_name: string;
}

export interface AddressItem {
  mtsmkd_address: string;
  eas_address: string;
  total: string;
  mtsmkd_house_id: number;
  eas_house_id: number;
  fias_house_id: string;
}

export interface StructEl {
  id: number;
  name: string;
}

export interface TypesStructEl {
  id: number;
  name: string;
  // parent_id: number;
}

export interface TechCondStructEl {
  id: number;
  description: string;
  defect_size: string;
  wear: string;
  works: string;
  // parent_id: number;
}
