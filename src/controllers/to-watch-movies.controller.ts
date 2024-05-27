import { Body, ConflictException, Controller, Post, Delete, Get, UseGuards, NotFoundException, Query } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const addToWatchMovieSchema = z.object({
  profileId: z.number(),
  movieId: z.number(),
});

const removeToWatchMovieSchema = z.object({
  profileId: z.number(),
  movieId: z.number(),
});

const bodyValidationPipe = new ZodValidationPipe(addToWatchMovieSchema);

type AddToWatchMovieSchema = z.infer<typeof addToWatchMovieSchema>;
type RemoveToWatchMovieSchema = z.infer<typeof removeToWatchMovieSchema>;

@Controller('/profiles')
@UseGuards(JwtAuthGuard)
export class ToWatchMovieController {
  constructor(private prisma: PrismaService) { }

  @Post('towatch')
  async addToWatchMovie(
    @Body(bodyValidationPipe) body: AddToWatchMovieSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { profileId, movieId } = body;

    const profile = await this.prisma.profile.findFirst({
      where: {
        id: profileId,
        userId: user.sub,
      },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    const existingToWatch = await this.prisma.watchedMovie.findFirst({
      where: {
        profileId,
        movieId,
      },
    });

    if (existingToWatch) {
      throw new ConflictException('Este filme já está na lista de assistidos.');
    }

    await this.prisma.watchedMovie.create({
      data: {
        profileId,
        movieId,
      },
    });

    return { message: 'Filme adicionado à lista de assistidos com sucesso!' };
  }

  @Delete('watched')
  async removeToWatchMovie(
    @Body(bodyValidationPipe) body: RemoveToWatchMovieSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { profileId, movieId } = body;

    const profile = await this.prisma.profile.findFirst({
      where: {
        id: profileId,
        userId: user.sub,
      },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    const existingWatched = await this.prisma.watchedMovie.findFirst({
      where: {
        profileId,
        movieId,
      },
    });

    if (!existingWatched) {
      throw new NotFoundException('Filme não encontrado na lista de para assistir.');
    }

    await this.prisma.watchedMovie.delete({
      where: {
        id: existingWatched.id,
      },
    });

    return { message: 'Filme removido da lista de para assistir com sucesso!' };
  }

  @Get('watched')
  async listWatchedMovies(
    @Query('profileId') profileId: number,
    @CurrentUser() user: UserPayload,
  ) {
    // Verificar se o perfil existe e pertence ao usuário
    const profile = await this.prisma.profile.findFirst({
      where: {
        id: profileId,
        userId: user.sub,
      },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    // Recuperar a lista de filmes assistidos do perfil
    const watchedMovies = await this.prisma.watchedMovie.findMany({
      where: {
        profileId,
      },
      orderBy: {
        watchedAt: 'desc', // Ordenar por data de visualização, mais recente primeiro
      },
    });

    return { watchedMovies };
  }
}
