export interface ReferenceListEntry {
    id: number;
    name: string;
}

export interface RefMc {
  id: number;
  name: string;
  code: string;
  type: number;
}

export interface RefMaterialItem {
  id: number;
  name: string;
  code: string;
  structureElement: number;
  number: number;
}

export interface StructEl {
  id: number;
  name: string;
}

export interface WeightCatItem {
  id: number;
  categoryId: number;
  categoryName: string;
  weightFactor: number;
  elements: [];
}