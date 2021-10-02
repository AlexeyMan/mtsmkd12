export interface Department {
    department_id: number;
    parent_department_id: number;
    department_name: string;
    description: string;
    info: string;
    type: any;
    children: Department[];
}

export interface Role {
    id: number;
    name: string;
    description: string;
}
export interface UserDetail {
    id: number;
    username: string;
    user_full_name: string;
    email: string;
    password: string;
    password2: string;
    active: boolean;
    mustchange: boolean;
    valid_till: string;
    note: string;
    groups: Role[];
    departments: Department[];
    phone: string;
    houses_choice: number;
    district_id: number;
    management_companies_id: number;
}

export interface DepartmentListEntry {
    department_id: number;
    department_name: string;
    description: string;
}