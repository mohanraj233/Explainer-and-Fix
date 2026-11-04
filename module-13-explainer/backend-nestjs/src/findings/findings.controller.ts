import { Controller, Get, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { FindingsService, SafeFixResult } from './findings.service';

@Controller('api/v1/findings')
export class FindingsController {
  constructor(private readonly findingsService: FindingsService) {}

  @Get()
  async getAllFindings() {
    return this.findingsService.getAllFindings();
  }

  @Get(':id')
  async getFindingById(@Param('id') id: string) {
    return this.findingsService.getFindingById(id);
  }

  @Post(':id/fix')
  @HttpCode(HttpStatus.OK)
  async generateSafeFix(@Param('id') id: string): Promise<SafeFixResult> {
    return this.findingsService.generateSafeFix(id);
  }

  @Post(':id/retest')
  @HttpCode(HttpStatus.OK)
  async retestFinding(@Param('id') id: string) {
    return this.findingsService.retestFinding(id);
  }
}

