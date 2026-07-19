import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (!user || !user.password) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error('validateUser error:', error);
      throw error;
    }
  }

  async validateOAuthUser(profile: { provider: string; providerId: string; email: string; name: string }): Promise<any> {
    const existingUser = await this.usersService.findByEmail(profile.email);

    if (!existingUser) {
      return this.usersService.create({
        email: profile.email,
        password: '',
        name: profile.name,
        role: 'AGENT',
        provider: profile.provider,
        providerId: profile.providerId,
      } as any);
    }

    return this.usersService.update(existingUser.id, {
      provider: profile.provider,
      providerId: profile.providerId,
    } as any);
  }

  async login(user: any): Promise<LoginResponseDto> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.login(user);
  }
}
