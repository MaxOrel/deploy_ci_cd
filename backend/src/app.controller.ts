import { Controller, Get, Delete, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async index() {
    return this.appService.randomPercent();
  }

  @Get('history')
  async getHistory(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.appService.getHistory(limitNum);
  }

  @Get('statistics')
  async getStatistics() {
    return this.appService.getStatistics();
  }

  @Delete('history')
  async clearHistory() {
    return this.appService.clearHistory();
  }
}
