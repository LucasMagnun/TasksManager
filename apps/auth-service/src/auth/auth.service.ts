import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/user.service';
import { RefreshTokensService } from '../refresh-tokens/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private refreshTokensService: RefreshTokensService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(email: string, username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email,
      username,
      password: hashed,
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException();

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException();

    const accessToken = this.jwtService.sign({ sub: user.id });
    const refreshToken = await this.refreshTokensService.create(user);

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async refresh(oldToken: string) {
    const newRefresh = await this.refreshTokensService.rotate(oldToken);

    const accessToken = this.jwtService.sign({
      sub: newRefresh.user.id,
    });

    return {
      accessToken,
      refreshToken: newRefresh.token,
    };
  }

  async logout(token: string) {
    await this.refreshTokensService.revoke(token);
  }
}
