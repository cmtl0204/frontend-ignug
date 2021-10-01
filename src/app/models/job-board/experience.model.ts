import { ProfessionalModel } from './professional.model';
import {CatalogueModel} from '@models/core';

export interface ExperienceModel {
  id?: number;
  professional?: ProfessionalModel;
  area?: CatalogueModel;
  employer?: string;
  position?: string;
  start_date?: Date;
  end_date?: Date;
  activities?: string;
  reason_leave?: string;
  is_working?: boolean;
  is_disability?: boolean;
}
