import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessHours } from '../../entities';
import { BusinessHoursService } from './business-hours.service';
import { BusinessHoursController } from './business-hours.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessHours])],
  controllers: [BusinessHoursController],
  providers: [BusinessHoursService],
  exports: [BusinessHoursService],
})
export class BusinessHoursModule {}
