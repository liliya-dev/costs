import TelegramBot from 'node-telegram-bot-api';
import { Currency, Role } from '../types';
import { selectedDatesMap, paymentStates } from '../states/payment.state';
import { createTransaction } from '../services/apiService';
import { asyncHandler } from '../helpers/asyncWrapper.helper';
import { customerStates } from '../states/customers.state';

export function registerPaymentsHandler(bot: TelegramBot) {
  bot.on(
    'callback_query',
    asyncHandler(async (query) => {
      const chatId = query.message?.chat.id;
      const messageId = query.message?.message_id;
      const data = query.data;
      if (!chatId || !data) return;

      if (data.startsWith('pay_customer_')) {
        const customerId = data.split('_')[2];
        const chatCustomerKey = `${chatId}_${customerId}`;
        const selectedDates = selectedDatesMap[chatCustomerKey] || [];

        if (!selectedDates.length || !customerId) {
          await bot.sendMessage(chatId, 'Вернись пожалуйста и выбери даты');
          return;
        }

        paymentStates[chatId] = {
          step: 'currency',
          customerId,
          dates: selectedDates,
        };

        const currencyButtons = Object.values(Currency).map((cur) => ({
          text: cur.toUpperCase(),
          callback_data: `currency_${cur}`,
        }));

        await bot.sendMessage(chatId, 'Выбери валюту платежа:', {
          reply_markup: { inline_keyboard: [currencyButtons] },
        });

        if (messageId) {
          await bot.editMessageReplyMarkup(
            { inline_keyboard: [] },
            { chat_id: chatId, message_id: messageId },
          );
        }
      }

      if (data.startsWith('currency_')) {
        const currencyKey = data.split('_')[1] as string;

        if (!Object.values(Currency).includes(currencyKey as Currency)) {
          await bot.sendMessage(chatId, 'Выбрана некорректная валюта.');
          return;
        }

        const state = paymentStates[chatId];
        if (!state) return;

        state.currency = currencyKey as Currency;
        state.step = 'amount';

        await bot.sendMessage(chatId, `Выбранная валюта: ${state.currency}\nТеперь введи сумму:`);
      }
    }, 'PaymentsCallbackHandler'),
  );

  bot.on(
    'message',
    asyncHandler(async (msg) => {
      const chatId = msg.chat.id;
      const state = paymentStates[chatId];
      if (!state || state.step !== 'amount') return;

      const amount = parseFloat(msg.text || '');
      if (isNaN(amount)) {
        await bot.sendMessage(chatId, 'Пожалуйста введи корректную сумму.');
        return;
      }

      const { customerId, dates, currency } = state;

      const dto = {
        amount,
        customerId: +customerId,
        numberOfPayments: dates.length,
        currency: currency!,
        datesShouldBePaid: dates,
      };

      await createTransaction(dto);

      await bot.sendMessage(
        chatId,
        `✅ Оплата внесена:\nКлиент: ${customerId}\nДаты оплат: ${dates.join(
          ', ',
        )}\nCurrency: ${currency}\nAmount: ${amount}`,
      );

      delete paymentStates[chatId];
      delete selectedDatesMap[`${chatId}_${customerId}`];
      const stateRole = customerStates[chatId]?.role;
      if (stateRole === Role.ADMIN) {
        const welcomeMessage =
          '👋 Твой запрос выполнен, теперь ты снова можешь выбрать нужное действие:';
        const inlineKeyboard = [
          [{ text: '💳 Добавить оплату для постоянного клиента', callback_data: 'customers' }],
          [{ text: '💰 Добавить разовый расход', callback_data: 'click' }],
        ];

        await bot.sendMessage(chatId, welcomeMessage, {
          reply_markup: { inline_keyboard: inlineKeyboard },
        });
      }
    }, 'PaymentsMessageHandler'),
  );
}
