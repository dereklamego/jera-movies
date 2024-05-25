import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { envSchema } from 'src/env'
import { AuthModule } from './auth/auth.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateProfileController } from './controllers/create-profile.controller'
import { MoviesModule } from './movies/movies.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    MoviesModule, // Adicionado o MoviesModule
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateProfileController,
  ],
  providers: [PrismaService],
})
export class AppModule { }