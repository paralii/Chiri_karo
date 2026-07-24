import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { jwtConfig } from "../config";
import {
  ITokenService,
  TokenPayload,
  RefreshTokenPayload,
  GeneratedRefreshToken,
} from "../../domain/services/ITokenService";
import { parseDurationToSeconds } from "../../shared/utils/parseDuration";
import { UnauthorizedError } from "../../shared/errors";

export class TokenService implements ITokenService {
  public generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, jwtConfig.accessSecret, {
      expiresIn: jwtConfig.accessExpiresIn as jwt.SignOptions["expiresIn"],
    });
  }

  public generateRefreshToken(payload: TokenPayload): GeneratedRefreshToken {
    const jti = randomUUID();
    const refreshPayload: RefreshTokenPayload = { ...payload, jti };

    const token = jwt.sign(refreshPayload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiresIn as jwt.SignOptions["expiresIn"],
    });

    const expiresInSeconds = parseDurationToSeconds(jwtConfig.refreshExpiresIn);

    return { token, jti, expiresInSeconds };
  }

  public verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, jwtConfig.accessSecret) as TokenPayload;
    } catch {
      throw new UnauthorizedError("Invalid or expired access token");
    }
  }

  public verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, jwtConfig.refreshSecret) as RefreshTokenPayload;
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }
  }
}
