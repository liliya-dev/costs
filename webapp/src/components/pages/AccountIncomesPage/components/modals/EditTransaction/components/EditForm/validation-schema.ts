import * as Yup from 'yup';

import { Currency } from '@/types';

export const validationSchema = Yup.object().shape({
  customerId: Yup.number().required('Customer is required').positive('Invalid customer'),

  currency: Yup.mixed<Currency>()
    .oneOf(Object.values(Currency), 'Invalid currency')
    .required('Currency is required'),
  amount: Yup.number().required('Amount is required').positive('Amount must be greater than 0'),
  numberOfPayments: Yup.number()
    .required('Number of payments is required')
    .min(1, 'Must have at least 1 payment')
    .max(100, 'Too many payments'),
});
