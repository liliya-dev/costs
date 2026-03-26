import { AccountCreateDto } from 'src/app/accounts/account.dto';
import { AccountEntity } from 'src/app/accounts/accounts.entity';

export interface IAccountsController {
  getOne(id: number): Promise<AccountEntity>;
  create(accountDto: AccountCreateDto): Promise<AccountEntity>;
}
