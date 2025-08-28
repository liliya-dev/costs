import { CreatePBIDto } from 'src/app/pbi/pbi.dto';
import { PBIEntity } from 'src/app/pbi/pbi.entity';

export interface IPBIsController {
  create(data: CreatePBIDto): Promise<PBIEntity>;
}
