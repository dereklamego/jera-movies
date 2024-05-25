import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TmdbService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly headers: Record<string, string>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY')!;
    console.log('API Key:', this.apiKey); // Adicionando console.log para debug
    this.apiUrl = this.configService.get<string>('TMDB_API_BASE_URL')!;
    this.headers = {
      Authorization: `Bearer ${this.apiKey}`,
      accept: 'application/json',
    };
  }
  
  async getAllPopularMovies() {
    const url = `${this.apiUrl}/movie/popular`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers: this.headers }),
      );
      return response.data;
    } catch (error: any) {
      // Verifica se é um erro de status HTTP
      if (error.response && error.response.status) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        // Se não for um erro de status HTTP, lança um erro interno do servidor
        throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
