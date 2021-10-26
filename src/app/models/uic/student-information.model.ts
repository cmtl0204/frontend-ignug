export interface StudentModel {
    id?: number;
    student?: StudentModel;
    relationLaboralCareer?: CatalogueModel;
    companyArea?: CatalogueModel;
    companyPosition?: CatalogueModel;
    companyWork?: string;
}



