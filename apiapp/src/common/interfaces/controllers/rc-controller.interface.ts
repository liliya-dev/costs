import { CreateRCDto } from 'src/app/rc/rc.dto';
import { RCEntity } from 'src/app/rc/rc.entity';

export interface IRCsController {
  create(data: CreateRCDto): Promise<RCEntity>;
}
