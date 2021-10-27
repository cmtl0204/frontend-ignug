import {LocationModel, CatalogueModel} from '@models/core';

export interface ApplicationModel{
  id?: number;
  employee?:string; //fk
  form?:string; //fk
  reason?:string; //fk
  location?:LocationModel;
  type?:CatalogueModel;
  dateStartedAt?: Date;
  dateEndedAt?: Date;
  timeStartedAt?: Date;
  timeEndedAt?: Date;
  observations?: string[];
}