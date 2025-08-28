import { CreateOTIDto } from 'src/app/oti/oti.dto';
import { OTIEntity } from 'src/app/oti/otis.entity';

export interface IOTIsController {
  create(data: CreateOTIDto): Promise<OTIEntity>;
}
