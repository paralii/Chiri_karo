import { IUser } from "../entities/User.entity";
import { IBaseRepository } from "./base/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string, withPassword?: boolean): Promise<IUser | null>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  existsByEmail(email: string): Promise<boolean>;
  findByIdWithOtp(id: string): Promise<IUser | null>;
  findByEmailWithOtp(email: string): Promise<IUser | null>;
}
