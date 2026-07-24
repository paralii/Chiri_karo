import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../../domain/services/IPasswordService";
import { ITokenService } from "../../../domain/services/ITokenService";
import { ICacheService } from "../../../domain/services/ICacheService";
import { AcceptInviteDto } from "../../dto/auth/InviteAdminDto";
import { AuthResponseDto } from "../../dto/auth/AuthResponseDto";
import { BadRequestError } from "../../../shared/errors";
import {
  buildAdminInviteKey,
  buildRefreshTokenKey,
} from "../../../shared/constants/redis-keys.constant";

export interface AcceptInviteResult {
  authResponse: AuthResponseDto;
  refreshToken: string;
  refreshTokenTtlSeconds: number;
}

export class AcceptInviteUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService,
    private readonly cacheService: ICacheService,
  ) {}

  public async execute(dto: AcceptInviteDto): Promise<AcceptInviteResult> {
    const inviteKey = buildAdminInviteKey(dto.token);
    const userId = await this.cacheService.get<string>(inviteKey);

    if (!userId) {
      throw new BadRequestError("Invite link is invalid or has expired");
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestError("Invite link is invalid or has expired");
    }

    const hashedPassword = await this.passwordService.hash(dto.password);
    const updatedUser = await this.userRepository.updateById(userId, {
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new BadRequestError("Unable to complete account setup");
    }

    await this.cacheService.del(inviteKey);

    const tokenPayload = {
      sub: updatedUser._id.toString(),
      email: updatedUser.email,
      role: updatedUser.role,
    };
    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const {
      token: refreshToken,
      jti,
      expiresInSeconds,
    } = this.tokenService.generateRefreshToken(tokenPayload);

    await this.cacheService.set(
      buildRefreshTokenKey(updatedUser._id.toString(), jti),
      "1",
      expiresInSeconds,
    );

    return {
      authResponse: {
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          isEmailVerified: updatedUser.isEmailVerified,
          createdAt: updatedUser.createdAt,
        },
        accessToken,
      },
      refreshToken,
      refreshTokenTtlSeconds: expiresInSeconds,
    };
  }
}
