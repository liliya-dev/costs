import * as Yup from 'yup';

import { Currency } from '@/types';

export const validationSchema = Yup.object({
  monthlyPayment: Yup.number()
    .typeError('Amount must be a number')
    .min(1, 'Amount must be at least 1')
    .required('Amount is required'),
  name: Yup.string()
    .min(1, 'Name of payment must be at least 2 letters')
    .required('Name is required'),
  approximatelyPaymentDay: Yup.number()
    .typeError('Amount must be a number')
    .min(1, 'Amount must be at least 1')
    .max(30, 'Amount must be at least 1')
    .required('Amount is required'),
  currency: Yup.mixed<Currency>()
    .oneOf(Object.values(Currency), 'Invalid currency')
    .required('Currency is required'),
  isCashless: Yup.boolean(),
});
