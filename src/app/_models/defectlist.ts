// Ведомость дефектов
export interface DefectList {
    id: number;
    caption: string;
    close_flag: boolean;
    coefficient_sum: number;
    total_damage: number;
    update_date: string;
    actual_flag: boolean;
    comment: string;
    close_date: string;
}

// Элемент ведомости
export interface DefectlistEntry {
    // 30
    id: number;
    // 6
    coefficient: number;
    // 53.4191017150879
    damage: number;
    // 19-05-2017
    update_date: string;
    repair_date_remark: string;
    inspection_date_remark: string;
    techStateDescr: string;
    comment: string;
    necessary_work_list: string;
    necessary_work_cost: string;
    structural_element_id: number;
    // Фундаменты
    structural_element_name: string;
    // 1
    sort_order: number;
    // Идентификаторы типов (ленточные бутовые, свайные, ленточные бетонные и железобетонные)
    structural_element_detail_ids: number[];
    // Названия (ленточные бутовые, свайные, ленточные бетонные и железобетонные)
    structural_element_detail_names: string[];
    // Выбранные в текущей дефектной ведомости
    // structural_element_detail_selected_ids: number[];


    section: DefectListEntryDetail[];
}


// Дефектный участок
export interface DefectListEntryDetail {
    id: number;
    section_number: number;
    section_size: number;
    element_size: number;
    damage: number;
    damage_by_size: number;
}

export interface DefectRefDetail {
    structural_element_detail_id: number;
    structural_element_detail_name: string;
    sort_order: number;
}

export interface DefectRef {
    structural_element_id: number;
    structural_element_name: string;
    sort_order: number;
    structural_element_details: DefectRefDetail[];
}
