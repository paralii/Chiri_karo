import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { ApiResponse } from "../../shared/responses/ApiResponse";
import { RegisterUseCase } from "../../application/use-cases/auth/register.use-case";
import { LoginUseCase } from "../../application/use-cases/auth/login.use-case";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refresh-token.use-case";
import { LogoutUseCase } from "../../application/use-cases/auth/logout.use-case";
import { GetProfileUseCase } from "../../application/use-cases/auth/get-profile.use-case";
import { GoogleAuthUseCase } from "../../application/use-cases/auth/google-auth.use-case";
import { VerifyOtpUseCase } from "../../application/use-cases/auth/verify-otp.use-case";
import { ResendOtpUseCase } from "../../application/use-cases/auth/resend-otp.use-case";
import { ForgotPasswordUseCase } from "../../application/use-cases/auth/forgot-password.use-case";
import { ResetPasswordUseCase } from "../../application/use-cases/auth/reset-password.use-case";
import { InviteAdminUseCase } from "../../application/use-cases/auth/invite-admin.use-case";
import { AcceptInviteUseCase } from "../../application/use-cases/auth/accept-invite.use-case";
import { IOAuthService } from "../../domain/services/IOAuthService";
import { RegisterDto } from "../../application/dto/auth/RegisterDto";
import { LoginDto } from "../../application/dto/auth/LoginDto";
import { VerifyOtpDto, ResendOtpDto } from "../../application/dto/auth/OtpDto";
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../../application/dto/auth/PasswordResetDto";
import {
  InviteAdminDto,
  AcceptInviteDto,
} from "../../application/dto/auth/InviteAdminDto";
import { AUTH_CONSTANTS } from "../../shared/constants/auth.constants";
import { appConfig } from "../../infrastructure/config";
import { UnauthorizedError, BadRequestError } from "../../shared/errors";
import { IRegisterUseCase } from "container/IRegisterUseCase";
import { ApiError } from "shared/errors/ApiError";

export class AuthController {
  constructor(
    private readonly registerUseCase: IRegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly googleAuthUseCase: GoogleAuthUseCase,
    private readonly oauthService: IOAuthService,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly resendOtpUseCase: ResendOtpUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly inviteAdminUseCase: InviteAdminUseCase,
    private readonly acceptInviteUseCase: AcceptInviteUseCase,
  ) {}

  private setRefreshTokenCookie(
    res: Response,
    token: string,
    ttlSeconds: number,
  ): void {
    res.cookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: appConfig.isProduction,
      sameSite: "lax",
      path: AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_PATH,
      maxAge: ttlSeconds * 1000,
    });
  }

  public register = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const dto = req.body as RegisterDto;
      const result = await this.registerUseCase.execute(dto);

      this.setRefreshTokenCookie(
        res,
        result.refreshToken,
        result.refreshTokenTtlSeconds,
      );

      res
        .status(201)
        .json(
          ApiResponse.created(
            "Registered successfully. Check your email for a verification code.",
            result.authResponse,
          ),
        );
    },
  );

  public login = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const dto = req.body as LoginDto;
      const result = await this.loginUseCase.execute(dto);

      this.setRefreshTokenCookie(
        res,
        result.refreshToken,
        result.refreshTokenTtlSeconds,
      );

      res
        .status(200)
        .json(ApiResponse.success("Login successful", result.authResponse));
    },
  );

  public refresh = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const incomingToken = req.cookies?.[
        AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE
      ] as string | undefined;

      if (!incomingToken) {
        throw new UnauthorizedError("Refresh token is missing");
      }

      const result = await this.refreshTokenUseCase.execute(incomingToken);

      this.setRefreshTokenCookie(
        res,
        result.refreshToken,
        result.refreshTokenTtlSeconds,
      );

      res.status(200).json(
        ApiResponse.success("Token refreshed successfully", {
          accessToken: result.accessToken,
        }),
      );
    },
  );

  public logout = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const refreshToken = req.cookies?.[
        AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE
      ] as string | undefined;
      const userId = req.user?.sub as string;

      await this.logoutUseCase.execute(userId, refreshToken);

      res.clearCookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE, {
        path: AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_PATH,
      });

      res.status(200).json(ApiResponse.success("Logout successful"));
    },
  );

  public me = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.sub as string;
      const profile = await this.getProfileUseCase.execute(userId);

      res
        .status(200)
        .json(ApiResponse.success("Profile retrieved successfully", profile));
    },
  );

  public googleRedirect = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const url = this.oauthService.getAuthUrl();
      res.redirect(url);
    },
  );

  public googleCallback = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const code = req.query.code as string | undefined;

      if (!code) {
        throw new BadRequestError("Missing authorization code");
      }

      const profile = await this.oauthService.getProfileFromCode(code);
      const result = await this.googleAuthUseCase.execute(profile);

      this.setRefreshTokenCookie(
        res,
        result.refreshToken,
        result.refreshTokenTtlSeconds,
      );

      res.redirect(
        `${appConfig.clientUrl}/oauth/success?accessToken=${result.authResponse.accessToken}`,
      );
    },
  );

  public verifyOtp = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const dto = req.body as VerifyOtpDto;
      await this.verifyOtpUseCase.execute(dto);

      res.status(200).json(ApiResponse.success("Email verified successfully"));
    },
  );

  public resendOtp = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const dto = req.body as ResendOtpDto;
      await this.resendOtpUseCase.execute(dto);

      res.status(200).json(ApiResponse.success("Verification code sent"));
    },
  );

  public forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const dto = req.body as ForgotPasswordDto;
      await this.forgotPasswordUseCase.execute(dto);

      res
        .status(200)
        .json(
          ApiResponse.success(
            "If an account exists for that email, a reset link has been sent",
          ),
        );
    },
  );

  public resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const dto = req.body as ResetPasswordDto;
      await this.resetPasswordUseCase.execute(dto);

      res.status(200).json(ApiResponse.success("Password reset successfully"));
    },
  );

  public inviteAdmin = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const dto = req.body as InviteAdminDto;
      await this.inviteAdminUseCase.execute(dto);

      res.status(201).json(ApiResponse.created("Invite sent successfully"));
    },
  );

  public acceptInvite = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const dto = req.body as AcceptInviteDto;
      const result = await this.acceptInviteUseCase.execute(dto);

      this.setRefreshTokenCookie(
        res,
        result.refreshToken,
        result.refreshTokenTtlSeconds,
      );

      res
        .status(200)
        .json(
          ApiResponse.success(
            "Account set up successfully",
            result.authResponse,
          ),
        );
    },
  );
}
