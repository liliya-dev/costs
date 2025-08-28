import * as Yup from 'yup';

import { Currency } from '@/types';

export const validationSchema = Yup.object({
  name: Yup.string()
    .required('Payment name is required')
    .max(100, 'Name should be 100 characters or less'),

  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .max(1000000, 'Amount is too large'),

  currency: Yup.mixed<Currency>()
    .oneOf(Object.values(Currency), 'Invalid currency')
    .required('Currency is required'),

  description: Yup.string().max(500, 'Description should be 500 characters or less').optional(),

  tags: Yup.array().of(
    Yup.object({
      id: Yup.number().required(),
      name: Yup.string().required(),
    }),
  ),
});
