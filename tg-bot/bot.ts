import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

import { registerStartHandler } from './handlers/start.handler';
import { registerCustomersHandler } from './handlers/customers.handler';
import { registerDatesHandler } from './handlers/dates.handler';
import { registerPaymentsHandler } from './handlers/payments.handler';
import { registerOtpsHandler } from './handlers/otps.handler';
import { registerSchedules } from './handlers/schedule.handler';
import { initializeCustomerStates } from './states/customers.state'; // ✅ import initialization

const token = process.env.TG_TOKEN!;
const bot = new TelegramBot(token, { polling: true });

(async () => {
  console.log('🔄 Initializing customer states...');
  await initializeCustomerStates();

  console.log('✅ Customer states initialized.');

  registerStartHandler(bot);
  registerCustomersHandler(bot);
  registerDatesHandler(bot);
  registerPaymentsHandler(bot);
  registerOtpsHandler(bot);
  registerSchedules(bot);

  console.log('🤖 Bot running...');
})();
