import {ProfessionalModel} from './professional.model';
import {UserModel, CatalogueModel, AddressModel, StateModel} from '@models/core';


export interface CompanyModel {
  id?: number;
  user?: UserModel;
  type?: CatalogueModel;
  identification_type?: CatalogueModel;
  activityType?: CatalogueModel;
  personType?: CatalogueModel;
  address?: AddressModel;
  state?: StateModel;
  trade_name?: string;
  prefix?: string;
  commercialActivities?: string[];
  web?: string;
  professionals?: ProfessionalModel;
  pivot?: Pivot;
}

export interface Pivot {
  company_id: number;
  professional_id: number;
  created_at: string;
  updated_at: string;
}
