import * as Yup from 'yup';

import { Currency } from '@/types';

export const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').typeError('Name must be a string'),

  description: Yup.string().nullable().typeError('Description must be a string'),

  currency: Yup.mixed<Currency>()
    .oneOf(Object.values(Currency), 'Invalid currency')
    .required('Currency is required'),

  monthlyPayment: Yup.number()
    .typeError('Amount must be a number')
    .min(1, 'Amount must be at least 1')
    .required('Amount is required'),

  approximatelyPaymentDay: Yup.number()
    .typeError('Approximately payment day must be a number')
    .min(1, 'Day must be at least 1')
    .max(28, 'Day cannot be more than 28')
    .required('Approximately payment day is required'),

  tags: Yup.array().of(
    Yup.object({
      id: Yup.number().required(),
      name: Yup.string().required(),
    }),
  ),
});
