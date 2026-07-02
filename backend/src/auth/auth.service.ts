import { Injectable, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailService } from './mail.service';
import { AuthResetService } from './auth-reset.service';
import * as dns from 'dns';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailService,
    private resetService: AuthResetService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // ─── Registration with email verification ─────────────────────────────────

  async register(
    email: string,
    pass: string,
    name?: string,
    role: Role = Role.MEMBER,
  ): Promise<{ message: string; email: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists in the system');
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        isEmailVerified: false,
        otpCode: code,
        otpExpiresAt: expiresAt,
      },
    });

    await this.mailService.sendVerificationCode(email, code);

    return { message: 'Verification code sent to your email', email };
  }

  async verifyRegistrationCode(email: string, code: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }
    if (!user.otpCode || user.otpCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('Verification code has expired');
    }

    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    return updatedUser;
  }

  async resendRegistrationCode(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: { otpCode: code, otpExpiresAt: expiresAt },
    });

    await this.mailService.sendVerificationCode(email, code);
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  async login(user: any, rememberMe = false) {
    if (!user.isEmailVerified && !user.provider) {
      throw new ForbiddenException(
        'Please verify your email before logging in. Check your inbox for the verification code.',
      );
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const expiresIn = rememberMe ? '30d' : '7d';

    return {
      access_token: this.jwtService.sign(payload, { expiresIn }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  // ─── OAuth helpers ────────────────────────────────────────────────────────

  async checkIsGoogleEmail(email: string): Promise<boolean> {
    const emailLower = email.toLowerCase();
    if (emailLower.endsWith('@gmail.com') || emailLower.endsWith('@googlemail.com')) {
      return true;
    }

    const domain = emailLower.split('@')[1];
    if (!domain) return false;

    try {
      const records = await dns.promises.resolveMx(domain);
      return records.some(record => {
        const exchange = record.exchange.toLowerCase();
        return exchange.includes('google.com') || exchange.includes('googlemail.com');
      });
    } catch (error) {
      return false;
    }
  }

  async validateOAuthUser(
    email: string,
    name: string,
    provider: string,
    providerId: string,
  ): Promise<any> {
    if (provider === 'google') {
      const isGoogle = await this.checkIsGoogleEmail(email);
      if (!isGoogle) {
        throw new BadRequestException(
          'Only Google-hosted email addresses (Gmail or Google Workspace domains) are allowed for Google Sign-In.'
        );
      }
    }

    let user = await this.prisma.user.findFirst({
      where: { provider, providerId },
    });

    if (user) {
      const { password, ...result } = user;
      return result;
    }

    user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      user = await this.prisma.user.update({
        where: { email },
        data: { provider, providerId, isEmailVerified: true },
      });
      const { password, ...result } = user;
      return result;
    }

    user = await this.prisma.user.create({
      data: {
        email,
        name,
        provider,
        providerId,
        password: null,
        role: Role.MEMBER,
        isEmailVerified: true,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  // ─── Profile ─────────────────────────────────────────────────────────────

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(
    userId: number,
    data: { name?: string; email?: string; password?: string; avatar?: string },
  ) {
    const updateData: any = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.avatar !== undefined) {
      updateData.avatar = data.avatar;
    }
    if (data.email !== undefined) {
      if (data.email) {
        const existing = await this.prisma.user.findFirst({
          where: {
            email: data.email,
            NOT: { id: userId },
          },
        });
        if (existing) {
          throw new ConflictException('Email already in use');
        }
        updateData.email = data.email;
      }
    }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password, ...result } = updated;
    return result;
  }

  // ─── Delegate OTP & Password Reset to AuthResetService ────────────────────

  generateAndSendOTP(email: string): Promise<void> {
    return this.resetService.generateAndSendOTP(email);
  }

  verifyOTP(email: string, code: string): Promise<any> {
    return this.resetService.verifyOTP(email, code);
  }

  forgotPassword(email: string): Promise<void> {
    return this.resetService.forgotPassword(email);
  }

  verifyResetCode(email: string, code: string): Promise<void> {
    return this.resetService.verifyResetCode(email, code);
  }

  resetPassword(email: string, code: string, pass: string): Promise<void> {
    return this.resetService.resetPassword(email, code, pass);
  }
}
