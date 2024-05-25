// movie.controller.ts

import { Controller, Get } from '@nestjs/common';
import { TmdbService } from './movies.service';


@Controller('movies')
export class MovieController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('allpopularmovies')
  async getAllPopularMovies() {
    const popularMovies = await this.tmdbService.getAllPopularMovies();
    return popularMovies;
  }
}
