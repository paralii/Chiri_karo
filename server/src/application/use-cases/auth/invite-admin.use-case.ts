import crypto from "crypto";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IEmailService } from "../../../domain/services/IEmailService";
import { ICacheService } from "../../../domain/services/ICacheService";
import { InviteAdminDto } from "../../dto/auth/InviteAdminDto";
import { Role } from "../../../shared/enums/Role.enum";
import { ConflictError } from "../../../shared/errors";
import { buildAdminInviteKey } from "../../../shared/constants/redis-keys.constant";
import { appConfig } from "../../../infrastructure/config";

const INVITE_TOKEN_TTL_SECONDS = 60 * 60 * 48;

export class InviteAdminUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService,
    private readonly cacheService: ICacheService,
  ) {}

  public async execute(dto: InviteAdminDto): Promise<void> {
    const emailExists = await this.userRepository.existsByEmail(dto.email);
    if (emailExists) {
      throw new ConflictError("A user with this email already exists");
    }

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      role: Role.CLINIC,
      isEmailVerified: true,
    });

    const token = crypto.randomBytes(32).toString("hex");
    await this.cacheService.set(
      buildAdminInviteKey(token),
      user._id.toString(),
      INVITE_TOKEN_TTL_SECONDS,
    );

    const acceptLink = `${appConfig.clientUrl}/accept-invite?token=${token}`;
    await this.emailService.sendAdminInviteEmail(
      user.email,
      user.name,
      acceptLink,
    );
  }
}
