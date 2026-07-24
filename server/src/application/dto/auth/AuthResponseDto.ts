import { Role } from "../../../shared/enums/Role.enum";

export interface SafeUserDto {
  id: string;
  name: string;
  email: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt: Date;
}

export interface AuthResponseDto {
  user: SafeUserDto;
  accessToken: string;
}
