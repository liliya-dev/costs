import * as Yup from 'yup';

export const validationSchema = Yup.object({
  amount: Yup.number()
    .typeError('Amount must be a number')
    .min(1, 'Amount must be at least 1')
    .required('Amount is required'),

  numberOfPayments: Yup.number()
    .typeError('Number of payments must be a number')
    .min(1, 'Number of payments must be at least 1')
    .required('Number of payments is required'),
});
