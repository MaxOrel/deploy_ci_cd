import { Injectable } from '@nestjs/common';
import { PercentService } from './percent/percent.service';

@Injectable()
export class AppService {
  constructor(private readonly percentService: PercentService) {}

  async randomPercent() {
    const [min, max] = [0, 100];
    const rnd = Math.floor(Math.random() * (max - min + 1) + min);

    const percentEntity = await this.percentService.create(rnd);

    return percentEntity.percent;
  }
}
