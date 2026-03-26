// import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

import { registerStartHandler } from './handlers/start.handler';
import { registerCustomersHandler } from './handlers/customers.handler';
import { registerDatesHandler } from './handlers/dates.handler';
import { registerPaymentsHandler } from './handlers/payments.handler';
import { registerOtpsHandler } from './handlers/otps.handler';
import { registerSchedules } from './handlers/schedule.handler';
import { initializeCustomerStates } from './states/customers.state'; 

const token = process.env.TG_TOKEN!;
const bot = new TelegramBot(token, { polling: true });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function startBot() {
  let initialized = false;
  while (!initialized) {
    try {
      console.log('🔄 Initializing customer states...', new Date());
      await initializeCustomerStates();
      initialized = true;
    } catch (err) {
      console.error('❌ Failed to initialize customer states, retrying in 10s...', err);
      await sleep(10000);
    }
  }
  registerStartHandler(bot);
  registerCustomersHandler(bot);
  registerDatesHandler(bot);
  registerPaymentsHandler(bot);
  registerOtpsHandler(bot);
  registerSchedules(bot);

  console.log('🤖 Bot running...');
}

startBot();