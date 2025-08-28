import { CreateOTPDto } from 'src/app/otp/otp.dto';
import { OTPEntity } from 'src/app/otp/otps.entity';

export interface IOTPsController {
  create(data: CreateOTPDto): Promise<OTPEntity>;
}
