export interface InviteAdminDto {
  name: string;
  email: string;
}

export interface AcceptInviteDto {
  token: string;
  password: string;
}
