import {UserModel, CatalogueModel, AddressModel} from '@models/core';
import {CourseModel, SkillModel, LanguageModel, ReferenceModel, ExperienceModel} from '@models/job-board';

export interface ProfessionalModel {
  id?: number;
  user?: UserModel;
  sex?: CatalogueModel;
  gender?: CatalogueModel;
  nationality?: CatalogueModel;
  courses?: CourseModel[];
  skills?: SkillModel[];
  languages?: LanguageModel[];
  references?: ReferenceModel[];
  experiences?: ExperienceModel[];
  addresses?: AddressModel[];
  traveled?: boolean;
  disabled?: boolean;
  familiarDisabled?: boolean;
  identificationFamiliarDisabled?: string;
  catastrophicDiseased?: boolean;
  familiarCatastrophicDiseased?: boolean;
  aboutMe?: string;
}
