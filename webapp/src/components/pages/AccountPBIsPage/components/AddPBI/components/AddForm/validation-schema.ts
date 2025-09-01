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
    .typeError('Payment day must be a number')
    .min(1, 'Day must be at least 1')
    .max(28, 'Day cannot be more than 28')
    .required('Payment day is required'),

  numberOfDownpayments: Yup.number()
    .typeError('Number of downpayments must be a number')
    .min(1, 'Must be at least 1')
    .test(
      'downpayments-max',
      'Number of downpayments cannot exceed number of payments',
      function (value) {
        const { numberOfPayments } = this.parent;
        return value === undefined || value <= numberOfPayments;
      },
    ),

  numberOfPayments: Yup.number()
    .typeError('Number of payments must be a number')
    .min(1, 'Must be at least 1')
    .required('Number of payments is required'),

  tags: Yup.array().of(Yup.number().typeError('Each tag must be a number')).optional(),
});
