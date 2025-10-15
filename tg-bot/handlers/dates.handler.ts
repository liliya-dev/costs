import TelegramBot from 'node-telegram-bot-api';
import { getIRPsByDates } from '../services/apiService';
import { formatDate } from '../helpers/format-date.helper';
import { selectedDatesMap } from '../states/payment.state';
import { asyncHandler } from '../helpers/asyncWrapper.helper';

export function registerDatesHandler(bot: TelegramBot) {
  bot.on(
    'callback_query',
    asyncHandler(async (query) => {
      const chatId = query.message?.chat.id;
      const messageId = query.message?.message_id;
      const data = query.data;
      if (!chatId || !data) return;

      if (!data.startsWith('customer_dates_')) return;

      const [, , customerId, clickedDate] = data.split('_');
      if (!customerId) return;

      const chatCustomerKey = `${chatId}_${customerId}`;
      if (!selectedDatesMap[chatCustomerKey]) {
        selectedDatesMap[chatCustomerKey] = [];
      }

      const dates = await getIRPsByDates(+customerId);

      const clickedItem = dates.find((d) => d.date === clickedDate);
      if (clickedDate && clickedItem && clickedItem.status !== 'PAID') {
        const idx = selectedDatesMap[chatCustomerKey].indexOf(clickedDate);
        if (idx === -1) selectedDatesMap[chatCustomerKey].push(clickedDate);
        else selectedDatesMap[chatCustomerKey].splice(idx, 1);
      }

      const buttons = dates.map((d) => {
        let text = formatDate(d.date);

        if (d.status === 'PAID') {
          text = `✅ ${text}`;
          return [{ text, callback_data: 'ignore' }];
        }
        const chatCustomerKey = `${chatId}_${customerId}`;
        if (!selectedDatesMap[chatCustomerKey]) {
          selectedDatesMap[chatCustomerKey] = [];
        }
        const isSelected = selectedDatesMap[chatCustomerKey].includes(d.date);
        if (isSelected) text = `✔️ ${text}`;

        return [{ text, callback_data: `customer_dates_${customerId}_${d.date}` }];
      });

      buttons.push([
        { text: 'Подтвердить выбранные даты', callback_data: `pay_customer_${customerId}` },
      ]);

      if (!clickedDate) {
        await bot.sendMessage(chatId, 'Выберите даты, за которые были произведены платежи:', {
          reply_markup: { inline_keyboard: buttons },
        });
      } else {
        await bot.editMessageReplyMarkup(
          { inline_keyboard: buttons },
          { chat_id: chatId, message_id: messageId! },
        );
      }
    }, 'DatesHandler'),
  );
}
