
import { RegisterDto } from "../application/dto/auth/RegisterDto";
import { RegisterResult } from "../application/use-cases/auth/register.use-case";

export interface IRegisterUseCase {
  execute(dto: RegisterDto): Promise<RegisterResult>;
}