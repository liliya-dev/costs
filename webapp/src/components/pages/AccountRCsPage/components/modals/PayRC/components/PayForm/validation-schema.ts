import * as Yup from 'yup';

import { Currency } from '@/types';

export const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be greater than zero')
    .required('Amount is required'),
  currency: Yup.mixed<Currency>()
    .oneOf(Object.values(Currency) as Currency[], 'Invalid currency')
    .required('Currency is required'),
  selectedDate: Yup.string().nullable().required('You must select a date'),
});
