import {CatalogueModel} from '@models/core';

export interface LanguageModel {
    id?: number;
    idiom?: CatalogueModel;
    writtenLevel?: CatalogueModel;
    spokenLevel?: CatalogueModel;
    readLevel?: CatalogueModel;
}
