import TelegramBot from 'node-telegram-bot-api';
import { Currency, Role } from '../types';
import { createOtp } from '../services/apiService';
import { otpStates } from '../states/otps.state';
import { asyncHandler } from '../helpers/asyncWrapper.helper';
import { customerStates } from '../states/customers.state';

export function registerOtpsHandler(bot: TelegramBot) {
  bot.on(
    'callback_query',
    asyncHandler(async (callbackQuery) => {
      const chatId = callbackQuery.message?.chat.id;
      const data = callbackQuery.data;
      if (!chatId || !data) return;

      if (data === 'click') {
        otpStates[chatId] = { step: 'amount', accountId: 1 };
        await bot.sendMessage(chatId, 'Введи сумму:');
      }

      if (data.startsWith('otp_currency_')) {
        const currency = data.split('_')[2] as Currency;
        const state = otpStates[chatId];
        if (!state) return;

        state.currency = currency;
        state.step = 'name';

        await bot.sendMessage(chatId, 'Теперь введи наименование оплаты:');
      }
    }, 'OtpsCallbackHandler'),
  );

  // Step 3 & 4: message input (amount + name)
  bot.on(
    'message',
    asyncHandler(async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      const state = otpStates[chatId];
      if (!state || !text) return;

      if (state.step === 'amount') {
        const amount = parseFloat(text);
        if (isNaN(amount)) {
          await bot.sendMessage(chatId, 'Пожалуйста введи корректное число');
          return;
        }
        state.amount = amount;
        state.step = 'currency';

        const buttons = Object.values(Currency).map((cur) => ({
          text: cur.toUpperCase(),
          callback_data: `otp_currency_${cur}`,
        }));

        await bot.sendMessage(chatId, 'Выбери валюту расхода:', {
          reply_markup: { inline_keyboard: [buttons] },
        });
      } else if (state.step === 'name') {
        state.name = text;

        await createOtp({
          accountId: state.accountId,
          amount: state.amount!,
          currency: state.currency!,
          name: state.name,
        });

        await bot.sendMessage(
          chatId,
          `✅ Разовый расход внесен в базу:\nСумма: ${state.amount} ${state.currency}\nИмя оплаты: ${state.name}`,
        );

        delete otpStates[chatId];

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
      }
    }, 'OtpsMessageHandler'),
  );
}
