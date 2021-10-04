import {Injectable} from '@angular/core';
import {ProfessionalModel} from '@models/job-board';

@Injectable({
  providedIn: 'root'
})
export class JobBoardService {

  constructor() {
  }

  set professional(professional: ProfessionalModel | undefined) {
    localStorage.setItem('professional', JSON.stringify(professional));
  }

  get professional(): ProfessionalModel {
    return JSON.parse(String(localStorage.getItem('professional')));
  }
}
