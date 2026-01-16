import * as Yup from 'yup';

export const validationSchema = Yup.object({
  fopFullName: Yup.string().nullable(),
  directorName: Yup.string().nullable(),
  iban: Yup.string().nullable(),
  bankName: Yup.string().nullable(),
  ipn: Yup.string().nullable(),
  bankEdrpou: Yup.string().nullable(),
  mfo: Yup.string().nullable(),
  address: Yup.string().nullable(),
  taxSystem: Yup.string().nullable(),
  phone: Yup.string().nullable(),
});
