import TelegramBot from 'node-telegram-bot-api';
import { getCustomersByAccount } from '../services/apiService';
import { asyncHandler } from '../helpers/asyncWrapper.helper';

export function registerCustomersHandler(bot: TelegramBot) {
  bot.on(
    'callback_query',
    asyncHandler(async (query) => {
      const chatId = query.message?.chat.id;
      const data = query.data;
      if (!chatId || !data) return;

      if (data !== 'customers') return;

      const customers = await getCustomersByAccount(+(process.env.ACCOUNT_ID ?? '1'));

      if (customers.length === 0) {
        await bot.sendMessage(chatId, 'No customers found.');
        return;
      }

      const buttons = customers.map((customer) => [
        { text: customer.name, callback_data: `customer_dates_${customer.id}` },
      ]);

      await bot.sendMessage(chatId, 'Select a customer:', {
        reply_markup: { inline_keyboard: buttons },
      });
    }, 'CustomersHandler'),
  );
}
