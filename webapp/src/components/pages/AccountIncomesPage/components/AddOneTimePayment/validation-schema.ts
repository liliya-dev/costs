import * as Yup from 'yup';

export const validationSchema = Yup.object({
  amount: Yup.number()
    .typeError('Amount must be a number')
    .min(1, 'Amount must be at least 1')
    .required('Amount is required'),
  name: Yup.string()
    .min(1, 'Name of payment must be at least 2 letters')
    .required('Nameis required'),
});
