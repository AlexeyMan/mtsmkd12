export interface MkdCommonParameters {
    management_org_id: string;
    private_date: string;
    create_date: number;
    category_name: string;
    inventory_number: string;
    inventory_date: string;
    registry_number: string;
    registry_date: string;
    cadastre_number: string;
    cadastre_date: string;
    failure_state: number;
    cultural_object_sign: number;
    notes: string;
    archive: number;
    disabled_people_lifts_count: number;
  }


  export interface MkdCommonInformation {
    house_series: string;
    build_year: string;
    reconstruction_year: string;
    total_building_volume: number;
    total_building_area: number;
    living_building_area: number;
    non_living_building_area: number;
    stairway_count: number;
    floor_count: number;
    residents_count: number;
    personal_account_count: number;
    mansard_area: number;
  }

  export interface CapitalRepairString {
    repair_year: string;
    work_list: string;
    price: string;
    work_volume: string;
    measure_unit: string;
    to_delete: number;
  }

  export interface FieldOption {
    value: string;
    display: string;
  }

  export class TepField {
    code: string;
    value: number;
    type: string;
    caption: string;
    unit: string;
    showAs: string;
    fieldoptions: FieldOption[];

    constructor(code: string, value: number, type = 'string', caption = 'Не задано', unit = '', showAs = 'small', fieldoptions = []) {
      this.code = code;
      this.caption = caption;
      this.fieldoptions = fieldoptions;

      if ((type === '') || (type === 'undefined')) {
        this.type = 'input';
      } else {
        this.type = type;
      }

      this.unit = unit;

      if (((this.type === 'int') || (this.type === 'float')) &&
        ((showAs !== 'textarea') && (showAs !== 'select') && (showAs !== 'check'))) {
        this.showAs = 'small';
      } else if ((this.type === 'string') && ((showAs !== 'textarea') && (showAs !== 'select') && (showAs !== 'check'))) {
        this.showAs = 'string';
      } else if ((showAs === '') || (showAs === undefined)) {
        this.showAs = 'string';
      } else {
        this.showAs = showAs;
      }


      this.value = value;
    }
  }

export interface RepairtableItem {
  elevators: number
  house_id: number
  id: number
  measure_unit: string
  old_id_giud: number
  old_id_int: number
  period: string
  price: number
  repair_year: number
  structure_element_id: number
  type: string
  type_work_id: number
  user_id: number
  work_volume: number
}

export interface Flatstable {
  communal: FlatType[];
  individual: FlatType[];
}

export interface FlatsByOwn {
  flats: FlatType[];
}

export interface FlatType {
  flat_count: number;
  room_count: number;
  total_area: number;
  living_area: number;
}

export interface CleaningArea {
  value_id: number;
  area_id: number;
  area_caption: string;
  area_value: number;
  measure_unit: string;
  group_flag: number;
  areas: CleaningArea[];
}

export interface Explication {
  value_id: number;
  attr_id: number;
  attr_caption: string;
  attr_value: number;
  measure_unit: string;
  group_flag: number;
  parent_attr_id: number;
  tree_level: number;
  explications: Explication[];
}

export interface Energycost {
  attr_id: number;
  attr_caption: string;
  attr_value: number;
  group_flag: number;
  measure_unit: string;
  parent_attr_id: number;
  explications: Energycost[];
}

export interface Energyuse {
  attr_id: number;
  attr_caption: string;
  attr_value: number;
  group_flag: number;
  measure_unit: string;
  parent_attr_id: number;
  explications: Energyuse[];
}

export interface Energytemp {
  attr_id: number;
  attr_caption: string;
  attr_value: number;
  group_flag: number;
  measure_unit: string;
  parent_attr_id: number;
  explications: Energytemp[];
}

export interface MeteringDevices {
  cold_water: {};
  drainage: {};
  electricity: {};
  gas: {};
  thermal_energy: {};
}

export interface BasementsWallsFloors {
  fundaments: {};
  overlaps: {};
  walls: {};
}

export interface HouseRoofing {
  // заполнить
}

export interface WatersupplySewerage {
  // заполнить
}
