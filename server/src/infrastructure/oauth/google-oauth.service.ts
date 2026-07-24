import { OAuth2Client, TokenPayload } from "google-auth-library";
import { googleOAuthConfig } from "./google-oauth.config";
import {
  IOAuthService,
  GoogleProfile,
} from "../../domain/services/IOAuthService";
import { UnauthorizedError } from "../../shared/errors";

const GOOGLE_SCOPES = ["openid", "email", "profile"];

export class GoogleOAuthService implements IOAuthService {
  private readonly client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      googleOAuthConfig.clientId,
      googleOAuthConfig.clientSecret,
      googleOAuthConfig.callbackUrl,
    );
  }

  public getAuthUrl(): string {
    return this.client.generateAuthUrl({
      access_type: "offline",
      scope: GOOGLE_SCOPES,
      prompt: "consent",
    });
  }

  public async getProfileFromCode(code: string): Promise<GoogleProfile> {
    const { tokens } = await this.client.getToken(code);

    if (!tokens.id_token) {
      throw new UnauthorizedError(
        "Google authentication failed: missing id token",
      );
    }

    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: googleOAuthConfig.clientId,
    });

    const payload: TokenPayload | undefined = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email) {
      throw new UnauthorizedError(
        "Google authentication failed: invalid profile payload",
      );
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? payload.email.split("@")[0],
      avatar: payload.picture,
    };
  }
}
