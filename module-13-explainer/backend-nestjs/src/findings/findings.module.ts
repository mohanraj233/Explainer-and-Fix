import { Module } from '@nestjs/common';
import { FindingsController } from './findings.controller';
import { FindingsService } from './findings.service';
import { FINDINGS_PROVIDER } from './findings-provider.interface';
import { MockFindingsProvider } from './mock-findings.provider';
import { RealFindingsProvider } from './real-findings.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FindingsController],
  providers: [
    FindingsService,
    MockFindingsProvider,
    RealFindingsProvider,
    {
      provide: FINDINGS_PROVIDER,
      // Default to MockFindingsProvider for independent development and tests
      useExisting: MockFindingsProvider,
    },
  ],
  exports: [FindingsService],
})
export class FindingsModule {}

