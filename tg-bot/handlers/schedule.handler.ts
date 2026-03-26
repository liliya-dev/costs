import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import { getIRPsForAccount } from '../services/apiService';
import { customerStates } from '../states/customers.state';
import { Role, Status } from '../types';
import { formatDate } from '../helpers/format-date.helper';
export const ADMIN_CHAT_ID = 261106680;

function getDaysUntil(dateISO: string): number {
  const now = new Date();
  const target = new Date(dateISO);
  const diffMs = target.getTime() - now.getTime();
  return diffMs / (1000 * 60 * 60 * 24);
}

export function registerSchedules(bot: TelegramBot) {
  // Выполняется каждый день в 13:00 утра
  cron.schedule(
    '0 13 * * *',
    async () => {
      console.log('🕘 Running daily IRP reminder at', new Date().toLocaleString());

      const accountId = Number(process.env.ACCOUNT_ID ?? 1);
      const allIRPs = await getIRPsForAccount(accountId);
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setMonth(start.getMonth() + 1);
      end.setHours(23, 59, 59, 999);

      const startDate = start.toISOString();
      const endDate = end.toISOString();

      for (const [chatIdStr, state] of Object.entries(customerStates)) {
        const chatId = Number(chatIdStr);

        try {
          let customerId: number | undefined;

          if (state.role === Role.CUSTOMER && state.customer) {
            customerId = state.customer.id;
          } else if (state.role === Role.FOP_CUSTOMER && state.fopCustomer) {
            customerId = state.fopCustomer.id;
          }

          const payments = allIRPs.filter(
            (item) =>
              item.customerId === customerId &&
              item.status === Status.NOT_PAID &&
              item.dateShouldBePaid >= startDate &&
              item.dateShouldBePaid <= endDate,
          );

          for (const payment of payments) {
            const daysUntil = getDaysUntil(payment.dateShouldBePaid);
            if (daysUntil <= 2.0 && daysUntil > 1.0) {
              await bot.sendMessage(
                chatId,
                `📅 Добрый день, напоминаем что через 2 дня у вас оплата сервера.`,
              );
              await bot.sendMessage(
                ADMIN_CHAT_ID,
                `📅 ${payment.customerName} должен оплатить через 2 дня (${formatDate(payment.dateShouldBePaid)}).`,
              );
            }
            // ⚠️ Напоминание в день оплаты
            else if (daysUntil <= 0.5 && daysUntil >= -0.5) {
              await bot.sendMessage(chatId, `⚠️ Добрый день, сегодня день оплаты сервера.`);
              await bot.sendMessage(
                ADMIN_CHAT_ID,
                `⚠️ Сегодня день оплаты у ${payment.customerName} (${formatDate(payment.dateShouldBePaid)}). Сумма: ${payment.amount} ${payment.currency}.`,
              );
            }
          }
        } catch {
          console.error(`❌ Ошибка при обработке напоминаний для чата ${chatId}:`);
        }
      }
    },
    {
      timezone: 'Europe/Kiev',
    },
  );
}
