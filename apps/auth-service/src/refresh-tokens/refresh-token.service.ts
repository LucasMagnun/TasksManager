import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { User } from '../users/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repo: Repository<RefreshToken>,
  ) {}

  async create(user: User): Promise<RefreshToken> {
    const token = randomUUID();

    const refreshToken = this.repo.create({
      token,
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return this.repo.save(refreshToken);
  }

  async validate(token: string): Promise<RefreshToken> {
    const refresh = await this.repo.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!refresh || refresh.revoked || refresh.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return refresh;
  }

  async rotate(oldToken: string): Promise<RefreshToken> {
    const old = await this.validate(oldToken);

    old.revoked = true;
    await this.repo.save(old);

    return this.create(old.user);
  }

  async revoke(token: string): Promise<void> {
    const refresh = await this.repo.findOne({ where: { token } });
    if (!refresh) return;

    refresh.revoked = true;
    await this.repo.save(refresh);
  }
}
