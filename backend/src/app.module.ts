import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PercentModule } from './percent/percent.module';
import Percent from './percent/entity/percent.entity';

const {
  POSTGRES_HOST = 'postgres',
  POSTGRES_PORT = '5432',
  POSTGRES_DB = 'postgres',
  POSTGRES_USER = 'postgres',
  POSTGRES_PASSWORD = 'password',
  TYPEORM_SYNC = 1,
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: parseInt(POSTGRES_PORT, 10),
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [Percent],
      synchronize: !!TYPEORM_SYNC,
    }),
    PercentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
