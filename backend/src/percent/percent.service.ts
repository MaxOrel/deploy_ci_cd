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

  async getHistory(limit: number = 10) {
    return this.percentRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getStatistics() {
    const all = await this.percentRepository.find();

    if (all.length === 0) {
      return {
        total: 0,
        average: 0,
        min: 0,
        max: 0,
        median: 0,
      };
    }

    const values = all.map(p => p.percent).sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    const min = values[0];
    const max = values[values.length - 1];
    const median = values.length % 2 === 0
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)];

    return {
      total: all.length,
      average: Math.round(average * 100) / 100,
      min,
      max,
      median,
    };
  }

  async deleteAll() {
    await this.percentRepository.clear();
    return { message: 'История очищена' };
  }
}
