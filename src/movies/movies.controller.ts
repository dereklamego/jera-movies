// movie.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { TmdbService } from './movies.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('allpopularmovies')
  async getAllPopularMovies() {
    const popularMovies = await this.tmdbService.getAllPopularMovies();
    return popularMovies;
  }

  @Get('search') // Rota para pesquisa de filmes
  async searchMoviesByName(@Query('query') query: string) { // Alterando para 'query' em vez de 'name'
    const searchedMovies = await this.tmdbService.searchMoviesByName(query);
    return searchedMovies;
  }
}
