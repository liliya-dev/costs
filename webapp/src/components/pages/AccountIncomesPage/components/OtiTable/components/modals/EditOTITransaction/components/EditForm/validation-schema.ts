import * as Yup from 'yup';

import { Currency } from '@/types';

export const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').typeError('Name must be a string'),

  description: Yup.string().nullable().typeError('Description must be a string'),

  currency: Yup.mixed<Currency>()
    .oneOf(Object.values(Currency), 'Invalid currency')
    .required('Currency is required'),

  amount: Yup.number()
    .typeError('Amount must be a number')
    .min(1, 'Amount must be at least 1')
    .required('Amount is required'),
});
