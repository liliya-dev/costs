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

  tgId: Yup.number().notRequired(),

  bankDetails: Yup.object({
    edrpou: Yup.string().optional(),
    ipn: Yup.string().optional(),
    vat_certificate: Yup.string().optional(),
    tax_system: Yup.string().optional(),
    iban: Yup.string().optional(),
    bank_name: Yup.string().optional(),
    mfo: Yup.string().optional(),
    address: Yup.string().optional(),
    phone: Yup.string()
      .matches(/^\+?[0-9]{7,15}$/, 'Invalid phone number')
      .optional(),
    email: Yup.string().email('Invalid email').optional(),
    contract_number: Yup.string().optional(),
    contract_date: Yup.date().typeError('Invalid date format').optional(),
    contract_description: Yup.string().optional(),
    invoice_description: Yup.string().optional(),
  }),

  approximatelyPaymentDay: Yup.number()
    .typeError('Approximately payment day must be a number')
    .min(1, 'Day must be at least 1')
    .max(28, 'Day cannot be more than 30')
    .required('Approximately payment day is required'),
});
