export interface ServerResponse {
  data: any;
  msg?: Msg;
  token?: string;
  current_page?: number;
  last_page?: number;
  total?: number;
  to?: number;
  from?: number;
}

interface Msg {
  summary: string;
  detail: string;
  code: string;
}
