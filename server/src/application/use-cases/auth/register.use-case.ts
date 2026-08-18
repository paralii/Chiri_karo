import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../../domain/services/IPasswordService";
import { ITokenService } from "../../../domain/services/ITokenService";
import { ICacheService } from "../../../domain/services/ICacheService";
import { IOtpService } from "../../../domain/services/IOtpService";
import { IEmailService } from "../../../domain/services/IEmailService";
import { RegisterDto } from "../../dto/auth/RegisterDto";
import { AuthResponseDto } from "../../dto/auth/AuthResponseDto";
import { Role } from "../../../shared/enums/Role.enum";
import { ConflictError } from "../../../shared/errors";
import { buildRefreshTokenKey } from "../../../shared/constants/redis-keys.constant";
import { IRegisterUseCase } from "container/IRegisterUseCase";

export interface RegisterResult {
  authResponse: AuthResponseDto;
  refreshToken: string;
  refreshTokenTtlSeconds: number;
}

export class RegisterUseCase implements IRegisterUseCase{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService,
    private readonly cacheService: ICacheService,
    private readonly otpService: IOtpService,
    private readonly emailService: IEmailService,
  ) {}

  public async execute(dto: RegisterDto): Promise<RegisterResult> {
    const emailExists = await this.userRepository.existsByEmail(dto.email);
    if (emailExists) {
      throw new ConflictError("Email is already registered");
    }

    const hashedPassword = await this.passwordService.hash(dto.password);
    const { code, codeHash, expiresAt } = this.otpService.generate();

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      role: dto.role ?? Role.PATIENT,
      isEmailVerified: false,
      otp: { codeHash, expiresAt, attempts: 0 },
    });

    await this.emailService.sendOtpEmail(user.email, user.name, code);

    const tokenPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const {
      token: refreshToken,
      jti,
      expiresInSeconds,
    } = this.tokenService.generateRefreshToken(tokenPayload);

    await this.cacheService.set(
      buildRefreshTokenKey(user._id.toString(), jti),
      "1",
      expiresInSeconds,
    );

    return {
      authResponse: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
        accessToken,
      },
      refreshToken,
      refreshTokenTtlSeconds: expiresInSeconds,
    };
  }
}
