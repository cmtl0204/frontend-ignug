import {UserModel,PermissionModel,RoleModel} from '@models/core';
import {ProfessionalModel} from '@models/job-board';

export interface LoginResponse {
  data: Data;
  msg?: Msg;
  token?: string;
}

interface Msg {
  summary: string;
  detail: string;
  code: string;
}

interface Data {
  roles: RoleModel[];
  permissions: PermissionModel[];
  user: UserModel;
  professional?: ProfessionalModel;
}
