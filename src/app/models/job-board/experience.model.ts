import { ProfessionalModel } from './professional.model';
import {CatalogueModel} from '@models/core';

export interface ExperienceModel {
  id?: number;
  professional?: ProfessionalModel;
  area?: CatalogueModel;
  employer?: string;
  position?: string;
  startedAt?: Date;
  endedAt?: Date;
  activities?: string[];
  reason_leave?: string;
  worked?: boolean;
  disabilited?: boolean;
}
