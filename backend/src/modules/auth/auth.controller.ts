import { Controller, Get, Post, Body, UseGuards, Req, Res, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req) {
    try {
      return await this.authService.login(req.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {
    return req.user;
  }

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req, @Res() res: Response) {
    const token = await this.authService.login(req.user);
    return res.redirect(`http://localhost:3002/auth/callback?token=${token.accessToken}`);
  }

  @Public()
  @Post('oauth/token')
  async oauthToken(@Query('provider') provider: string, @Query('code') code: string) {
    return { message: 'Use /auth/github endpoints for GitHub OAuth flow' };
  }

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Post('logout')
  async logout() {
    return { message: 'Logged out successfully' };
  }
}
