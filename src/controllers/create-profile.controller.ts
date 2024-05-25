import { Body, ConflictException, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

// Atualizando o esquema de validação para refletir os campos de Profile
const createProfileBodySchema = z.object({
  name: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createProfileBodySchema);

type CreateProfileBodySchema = z.infer<typeof createProfileBodySchema>;

@Controller('/profiles')
@UseGuards(JwtAuthGuard)
export class CreateProfileController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateProfileBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name } = body;
    const userId = user.sub;

    // Verificar se o usuário já possui um perfil com o mesmo nome
    const existingProfile = await this.prisma.profile.findFirst({
      where: {
        userId,
        name,
      },
    });

    if (existingProfile) {
      throw new ConflictException('Você já possui um perfil com este nome.');
    }

    // Verificar se o usuário já possui 4 perfis
    const profileCount = await this.prisma.profile.count({
      where: {
        userId,
      },
    });

    if (profileCount >= 4) {
      throw new ConflictException('Você não pode ter mais de 4 perfis.');
    }

    // Criar um novo perfil
    await this.prisma.profile.create({
      data: {
        name,
        userId,
      },
    });

    return { message: 'Perfil criado com sucesso!' };
  }
}
