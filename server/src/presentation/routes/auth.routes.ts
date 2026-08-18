import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { PasswordService } from "../../infrastructure/services/bcrypt.password.service";
import { TokenService } from "../../infrastructure/services/jwt.token.service";
import { OtpService } from "../../infrastructure/services/otp.service";
import { RedisCacheService } from "../../infrastructure/redis/redis.service";
import { GoogleOAuthService } from "../../infrastructure/oauth/google-oauth.service";
import { EmailService } from "../../infrastructure/email/email.service";
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
import { validate, authenticate, authorize } from "../middleware";
import {
  loginRateLimiter,
  registerRateLimiter,
  otpVerifyRateLimiter,
  otpResendRateLimiter,
  passwordResetRateLimiter,
} from "../middleware/rateLimiters";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  inviteAdminSchema,
  acceptInviteSchema,
} from "../validations/auth.validation";
import { Role } from "../../shared/enums/Role.enum";
import { IRegisterUseCase } from "container/IRegisterUseCase";

const userRepository = new UserRepository();
const passwordService = new PasswordService();
const tokenService = new TokenService();
const cacheService = new RedisCacheService();
const oauthService = new GoogleOAuthService();
const otpService = new OtpService();
const emailService = new EmailService();

const registerUseCase : IRegisterUseCase = new RegisterUseCase(
  userRepository,
  passwordService,
  tokenService,
  cacheService,
  otpService,
  emailService,
);
const loginUseCase = new LoginUseCase(
  userRepository,
  passwordService,
  tokenService,
  cacheService,
);
const refreshTokenUseCase = new RefreshTokenUseCase(
  userRepository,
  tokenService,
  cacheService,
);
const logoutUseCase = new LogoutUseCase(tokenService, cacheService);
const getProfileUseCase = new GetProfileUseCase(userRepository);
const googleAuthUseCase = new GoogleAuthUseCase(
  userRepository,
  tokenService,
  cacheService,
);
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository, otpService);
const resendOtpUseCase = new ResendOtpUseCase(
  userRepository,
  otpService,
  emailService,
  cacheService,
);
const forgotPasswordUseCase = new ForgotPasswordUseCase(
  userRepository,
  emailService,
  cacheService,
);
const resetPasswordUseCase = new ResetPasswordUseCase(
  userRepository,
  passwordService,
  cacheService,
);
const inviteAdminUseCase = new InviteAdminUseCase(
  userRepository,
  emailService,
  cacheService,
);
const acceptInviteUseCase = new AcceptInviteUseCase(
  userRepository,
  passwordService,
  tokenService,
  cacheService,
);

const authController = new AuthController(
  registerUseCase,
  loginUseCase,
  refreshTokenUseCase,
  logoutUseCase,
  getProfileUseCase,
  googleAuthUseCase,
  oauthService,
  verifyOtpUseCase,
  resendOtpUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  inviteAdminUseCase,
  acceptInviteUseCase,
);

const router = Router();

router.post(
  "/register",
  registerRateLimiter,
  validate(registerSchema),
  authController.register,
);
router.post(
  "/login",
  loginRateLimiter,
  validate(loginSchema),
  authController.login,
);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.me);

router.get("/google", authController.googleRedirect);
router.get("/google/callback", authController.googleCallback);

router.post(
  "/otp/verify",
  otpVerifyRateLimiter,
  validate(verifyOtpSchema),
  authController.verifyOtp,
);
router.post(
  "/otp/resend",
  otpResendRateLimiter,
  validate(resendOtpSchema),
  authController.resendOtp,
);

router.post(
  "/forgot-password",
  passwordResetRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  passwordResetRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

router.post(
  "/admin/invite",
  authenticate,
  authorize(Role.SUPER_ADMIN),
  validate(inviteAdminSchema),
  authController.inviteAdmin,
);
router.post(
  "/accept-invite",
  validate(acceptInviteSchema),
  authController.acceptInvite,
);

export { router as authRoutes };
