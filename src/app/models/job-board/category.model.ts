
export interface CategoryModel {
    id?: number;
    parent?: CategoryModel;
    code?: string;
    name?: string;
    icon?: null;
    children?: CategoryModel[];

}



