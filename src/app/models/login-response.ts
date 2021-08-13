import {UserModel} from './user.model';
import {PermissionModel} from './permission.model';
import {RoleModel} from './role.model';

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
}
