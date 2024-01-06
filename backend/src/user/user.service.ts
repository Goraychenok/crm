import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export type User = any;

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        email: username,
      },
    });
  }
}
