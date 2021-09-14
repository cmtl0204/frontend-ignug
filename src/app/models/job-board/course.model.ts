import {CatalogueModel} from '@models/core';
import {ProfessionalModel} from '@models/job-board';

export interface CourseModel {
  id?: number;
  professional?: ProfessionalModel;
  type?: CatalogueModel;
  certificationType?: CatalogueModel;
  area?: CatalogueModel;
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  hours?: number;
  institution?: string;
}
