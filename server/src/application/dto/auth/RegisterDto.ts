import { Role } from "../../../shared/enums/Role.enum";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: Role;
}
