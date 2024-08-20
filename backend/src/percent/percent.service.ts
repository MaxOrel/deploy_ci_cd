import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Percent from './entity/percent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PercentService {
  constructor(@InjectRepository(Percent) private readonly percentRepository: Repository<Percent>) {}

  async create(percent: number) {
    return this.percentRepository.save({ percent });
  }
}
