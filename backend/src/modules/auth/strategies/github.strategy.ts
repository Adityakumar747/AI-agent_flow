import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID') || 'dummy',
      clientSecret: configService.get('GITHUB_CLIENT_SECRET') || 'dummy',
      callbackURL: configService.get('GITHUB_CALLBACK_URL') || 'http://localhost:3001/api/auth/github/callback',
      scope: ['user:email'],
    });
    this.configService = configService;
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { id, displayName, emails } = profile;
    const email = emails?.[0]?.value || `${id}@users.noreply.github.com`;
    done(null, {
      provider: 'github',
      providerId: id,
      email,
      name: displayName,
    });
  }
}
