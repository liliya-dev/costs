import { IRPsDoneAndUpcomingDto } from 'src/app/irp/irps.dto';
import { PeriodOptionsDto } from 'src/common/dtos/period-options.dto';

export interface IIncomePaymentsController {
  getIncomePaymentsInPeriod(
    dto: PeriodOptionsDto,
    id: number,
  ): Promise<IRPsDoneAndUpcomingDto[]>;
}
