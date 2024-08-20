import { Module } from '@nestjs/common';
import { PercentService } from './percent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Percent from './entity/percent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Percent])],
  providers: [PercentService],
  exports: [PercentService]
})
export class PercentModule {}
