import {CategoryModel} from './category.model';
import {Location as LocationOffer} from './location-offer.model';
import {ContractTypeModel} from './contract-type.model';

export interface OfferModel {
    id: number;
    company_id?: number;
    location_id?: number;
    contract_type_id?: number;
    position_id?: number;
    sector_id?: number;
    working_day_id?: number;
    experience_time_id?: number;
    training_hours_id?: number;
    status_id?: number;
    code?: string;
    description?: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_cellphone?: string;
    remuneration?: string;
    vacancies?: number;
    startedAt?: string;
    endedAt?: string;
    activities?: string[];
    requirements?: string;
    aditional_information?: string;
    deleted_at?: null;
    created_at?: string;
    updated_at?: string;
    position?: ContractTypeModel;
    location?: LocationOffer;
    categories?: CategoryModel[];
    contract_type?: any;
}

export interface SearchParams {
    generalSearch?: string;
    searchCode?: string;
    searchIDs: Array<number>;
    searchProvince?: string;
    searchCanton?: string;
    searchPosition?: string;
    searchIdCategory?: Array<number>;
    searchParentCategory?: Array<number>;
}
