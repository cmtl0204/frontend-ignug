import { ProfessionalModel } from './professional.model';
import {CatalogueModel} from '@models/core';

export interface ReferenceModel {
    id?: number;
    professional?: ProfessionalModel;
    institution?: CatalogueModel;
    position?: string;
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
}
