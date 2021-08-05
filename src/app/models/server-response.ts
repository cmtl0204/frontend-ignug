import {ProjectModel} from './project.model';

export interface ServerResponse {
  data?: any;
  message?: Message;
  current_page: number;
  last_page: number;
  total: number;
  to: number;
  from: number;
}

interface Message {
  summary: string;
  detail: string;
  code: string;
}
