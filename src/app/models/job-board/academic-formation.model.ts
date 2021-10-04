import {ProfessionalModel, CategoryModel} from '@models/job-board';

export interface AcademicFormationModel {
  id?: number;
  professional?: ProfessionalModel;
  professionalDegree?: CategoryModel;
  registeredAt?: Date;
  senescytCode?: string;
  certificated?: boolean;
}
