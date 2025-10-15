import TelegramBot from 'node-telegram-bot-api';
import { asyncHandler } from '../helpers/asyncWrapper.helper';

import { getCustomerByTgId, subscribeCustomer } from '../services/apiService';
import type { IFOPCustomer } from '../types/general/fop-customer';
import { Role, type ICustomer } from '../types';
import { setCustomerState, type CustomerState } from '../states/customers.state';

export const ADMIN_USERNAMES = ['@vitalyms'];

export function registerStartHandler(bot: TelegramBot) {
  bot.onText(
    /\/start(?: (\d+))?/,
    asyncHandler(async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.chat.username || `user_${chatId}`;
      let role: Role;
      let customer: ICustomer | undefined;
      let fopCustomer: IFOPCustomer | undefined;

      if (ADMIN_USERNAMES.includes(username)) {
        role = Role.ADMIN;
      } else {
        try {
          const customerData = await getCustomerByTgId(chatId);
          if (customerData.role === Role.FOP_CUSTOMER) {
            role = Role.FOP_CUSTOMER;
            fopCustomer = customerData as IFOPCustomer;
          } else {
            role = Role.CUSTOMER;
            customer = customerData as ICustomer;
          }
        } catch {
          await bot.sendMessage(
            chatId,
            '❌ Вы не зарегистрированы как клиент. Пожалуйста, свяжитесь с поддержкой.',
          );
          return;
        }
      }

      const state: CustomerState = { role };

      // 👤 Если обычный клиент
      if (customer !== undefined) {
        state.customer = customer;
        if (!customer.isTgSubscribed) {
          await subscribeCustomer(customer.id);
        }
        await bot.sendMessage(
          chatId,
          '🙏 Спасибо за подписку на наш Telegram-бот! Здесь вы сможете получать уведомления о предстоящих оплатах. В ближайшее время мы добавим ещё много полезных функций специально для вас!',
        );
      }

      // 💼 Если ФОП-клиент
      if (fopCustomer !== undefined) {
        state.fopCustomer = fopCustomer;
        if (!fopCustomer.isTgSubscribed) {
          await subscribeCustomer(fopCustomer.id);
        }
        await bot.sendMessage(
          chatId,
          '🙏 Спасибо за подписку на наш Telegram-бот! Здесь вы сможете получать уведомления о предстоящих оплатах. В ближайшее время мы добавим ещё много полезных функций специально для вас!',
        );
      }

      setCustomerState(chatId, state);

      // 👑 Для админа — остаются кнопки
      if (role === Role.ADMIN) {
        const welcomeMessage = `👋 Привет! Здесь ты сможешь управлять расходами, добавлять платежи для клиентов и отслеживать финансовые операции. Выбери нужное действие:`;
        const inlineKeyboard = [
          [{ text: '💳 Добавить оплату для постоянного клиента', callback_data: 'customers' }],
          [{ text: '💰 Добавить разовый расход', callback_data: 'click' }],
        ];
        await bot.sendMessage(chatId, welcomeMessage, {
          reply_markup: { inline_keyboard: inlineKeyboard },
        });
      }
    }, 'StartHandler'),
  );
}
