export interface RefItem {
    id: number;
    code: string;
    name: string;
}

export interface Districts {
    districtId: number;
    districtName: string;
    pspcdId: string;
}

export interface District {
    id: number;
    name: string;
}

export interface Construction {
    catVisible: boolean;
    id: number;
    name: string;
    code: string;
    parent: number;
}

export interface Category {
    id: number;
    name: string;
}

export interface Street {
    id: number;
    name: string;
}

export interface Streets {
    id: number;
    name: string;
    pspcsId: string;
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

export interface Categories {
    id: number;
    name: string;
}

export interface Statuses {
    statusId: number;
    statusName: string;
    alias: string;
}

export interface ListFilter {
    management_company: any;
    districts: Districts[];
    categories: Categories[];
    statuses: Statuses[];
    construction_elements: any;
    heating_types: any;
    hot_water_types: any;
    gas_supply_types:any;
}

