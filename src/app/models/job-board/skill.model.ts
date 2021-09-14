import {ProfessionalModel} from './professional.model';
import {CatalogueModel} from '@models/core';

export interface SkillModel {
  id?: number;
  professional?: ProfessionalModel;
  type?: CatalogueModel;
  description?: string;
}
