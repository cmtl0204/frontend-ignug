import {Injectable} from '@angular/core';
import {ProfessionalModel} from '@models/license-work';

@Injectable({
  providedIn: 'root'
})
export class LicenseWorkService {

  constructor() {
  }

  set professional(professional: ProfessionalModel | undefined) {
    localStorage.setItem('professional', JSON.stringify(professional));
  }

  get professional(): ProfessionalModel {
    return JSON.parse(String(localStorage.getItem('professional')));
  }
}
