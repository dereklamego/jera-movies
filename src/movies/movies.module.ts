import { Module} from '@nestjs/common';

import { MovieController } from './movies.controller';
import { TmdbService } from './movies.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TmdbService],
  controllers: [MovieController],
})
export class MoviesModule {}
