import * as Yup from 'yup';

import { Currency } from '@/types';

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').max(100, 'Name must be at most 100 characters'),

  amount: Yup.number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .positive('Amount must be greater than zero'),

  currency: Yup.mixed<Currency>()
    .oneOf(Object.values(Currency), 'Invalid currency')
    .required('Currency is required'),

  description: Yup.string().max(500, 'Description must be at most 500 characters'),

  tags: Yup.array().of(Yup.number().typeError('Each tag must be a number')).optional(),
});
