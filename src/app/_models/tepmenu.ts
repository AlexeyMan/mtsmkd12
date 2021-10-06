export interface TepMenuItem {
    id: number;
    menuCaption: string;
    items: TepMenuSubitem[];
}

export interface TepMenuSubitem {
    id: number;
    menuCaption: string;
    parentId: number;
    alias: string;
}
