import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/profiles')
@UseGuards(JwtAuthGuard)
export class FetchProfilesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const profiles = await this.prisma.profile.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { profiles }
  }
}
