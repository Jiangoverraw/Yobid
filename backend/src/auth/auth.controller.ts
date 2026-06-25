import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  UnauthorizedException,
  Request,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  // ─── Local email/password ────────────────────────────────────────────────

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user, body.rememberMe === true);
  }

  /**
   * POST /auth/register
   * Creates user (unverified) and sends OTP to email.
   * Returns { message, email } – NOT a JWT token.
   */
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body.email, body.password, body.name);
  }

  /**
   * POST /auth/register/verify
   * Verifies the OTP sent after registration.
   * Returns JWT on success.
   */
  @Post('register/verify')
  async verifyRegistration(@Body() body: { email: string; code: string }) {
    try {
      const user = await this.authService.verifyRegistrationCode(body.email, body.code);
      return this.authService.login(user, false);
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Verification failed');
    }
  }

  /**
   * POST /auth/register/resend
   * Resend registration OTP.
   */
  @Post('register/resend')
  async resendRegistration(@Body() body: { email: string }) {
    try {
      await this.authService.resendRegistrationCode(body.email);
      return { message: 'Verification code resent successfully' };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Resend failed');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.authService.getUserById(req.user.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() body: any) {
    return this.authService.updateProfile(req.user.userId, body);
  }

  // ─── Google OAuth ─────────────────────────────────────────────────────────

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Passport redirects to Google — this handler is never called directly
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Request() req, @Res() res: Response) {
    const email = req.user.email;
    await this.authService.generateAndSendOTP(email);
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/oauth/callback?email=${encodeURIComponent(email)}&otpRequired=true`);
  }

  @Post('google/verify-otp')
  async verifyOtp(@Body() body: { email: string; code: string }) {
    try {
      const user = await this.authService.verifyOTP(body.email, body.code);
      return this.authService.login(user);
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Verification failed');
    }
  }

  @Post('google/resend-otp')
  async resendOtp(@Body() body: { email: string }) {
    try {
      await this.authService.generateAndSendOTP(body.email);
      return { message: 'Verification code resent successfully' };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Resend failed');
    }
  }

  // ─── GitHub OAuth ─────────────────────────────────────────────────────────

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // Passport redirects to GitHub — this handler is never called directly
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Request() req, @Res() res: Response) {
    const { access_token } = await this.authService.login(req.user);
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/oauth/callback?token=${access_token}`);
  }

  // ─── Password reset ───────────────────────────────────────────────────────

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.forgotPassword(body.email);
    return { message: 'Password reset code has been sent to your email' };
  }

  @Post('verify-reset-code')
  async verifyResetCode(@Body() body: { email: string; code: string }) {
    await this.authService.verifyResetCode(body.email, body.code);
    return { message: 'Verification code is valid' };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; code: string; newPassword: string }) {
    await this.authService.resetPassword(body.email, body.code, body.newPassword);
    return { message: 'Password has been reset successfully' };
  }
}
