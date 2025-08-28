import * as Yup from 'yup';

import { Currency } from '@/types';

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').max(100, 'Name must be less than 100 characters'),

  monthlyPayment: Yup.number()
    .required('Monthly payment is required')
    .min(1, 'Monthly payment must be greater than 0'),

  currency: Yup.mixed<Currency>()
    .oneOf(Object.values(Currency) as Currency[], 'Invalid currency')
    .required('Currency is required'),

  approximatelyPaymentDay: Yup.number()
    .required('Payment day is required')
    .min(1, 'Payment day must be between 1 and 28')
    .max(28, 'Payment day must be between 1 and 28'),

  isPermanentAmount: Yup.boolean().required('Permanent amount flag is required'),

  description: Yup.string().max(500, 'Description must be less than 500 characters').optional(),

  tags: Yup.array().of(Yup.number().min(1, 'Invalid tag ID')).optional(),
});
