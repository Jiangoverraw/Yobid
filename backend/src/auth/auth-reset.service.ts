import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthResetService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  // ─── OTP helpers (Google OAuth 2FA) ──────────────────────────────────────

  async generateAndSendOTP(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User with this email not found');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await this.prisma.user.update({
      where: { email },
      data: {
        otpCode: code,
        otpExpiresAt: expiresAt,
      },
    });

    await this.mailService.sendVerificationCode(email, code);
  }

  async verifyOTP(email: string, code: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.otpCode || user.otpCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('Verification code has expired');
    }

    // Clear OTP
    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: {
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    return updatedUser;
  }

  // ─── Password reset ───────────────────────────────────────────────────────

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email not found in the system');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await this.prisma.user.update({
      where: { email },
      data: {
        otpCode: code,
        otpExpiresAt: expiresAt,
      },
    });

    await this.mailService.sendPasswordResetCode(email, code);
  }

  async verifyResetCode(email: string, code: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.otpCode || user.otpCode !== code) {
      throw new BadRequestException('Invalid reset code');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('Reset code has expired');
    }
  }

  async resetPassword(email: string, code: string, pass: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.otpCode || user.otpCode !== code) {
      throw new BadRequestException('Invalid reset code');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('Reset code has expired');
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpiresAt: null,
      },
    });
  }
}
