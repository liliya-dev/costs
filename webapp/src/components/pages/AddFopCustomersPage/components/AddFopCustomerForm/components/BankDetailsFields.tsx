import { FormikErrors, FormikTouched } from 'formik';

import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import { CreateFOPCustomerDto } from '@/types';

interface Props {
  errors: FormikErrors<CreateFOPCustomerDto>;
  touched: FormikTouched<CreateFOPCustomerDto>;
}

const BankDetailsFields = ({ errors, touched }: Props) => {
  return (
    <div className="mt-6 rounded-md border p-4">
      <h3 className="mb-4 text-lg font-semibold">Bank Details</h3>
      <TextInput
        isError={Boolean(errors.bankDetails?.director && touched.bankDetails?.director)}
        isTouched={Boolean(touched.bankDetails?.director)}
        placeholder="Рябчина О.М"
        title="Director"
        name="bankDetails.director"
        errorText={errors.bankDetails?.director}
      />
      <TextInput
        isError={Boolean(errors.bankDetails?.edrpou && touched.bankDetails?.edrpou)}
        isTouched={Boolean(touched.bankDetails?.edrpou)}
        placeholder="12345678"
        title="EDRPOU"
        name="bankDetails.edrpou"
        errorText={errors.bankDetails?.edrpou}
      />
      <TextInput
        isError={Boolean(errors.bankDetails?.ipn && touched.bankDetails?.ipn)}
        isTouched={Boolean(touched.bankDetails?.ipn)}
        placeholder="1234567890"
        title="IPN"
        name="bankDetails.ipn"
        errorText={errors.bankDetails?.ipn}
      />
      <TextInput
        isError={Boolean(
          errors.bankDetails?.vat_certificate && touched.bankDetails?.vat_certificate,
        )}
        isTouched={Boolean(touched.bankDetails?.vat_certificate)}
        placeholder="VAT12345"
        title="VAT Certificate"
        name="bankDetails.vat_certificate"
        errorText={errors.bankDetails?.vat_certificate}
      />
      <TextInput
        isError={Boolean(errors.bankDetails?.tax_system && touched.bankDetails?.tax_system)}
        isTouched={Boolean(touched.bankDetails?.tax_system)}
        placeholder="General / Simplified"
        title="Tax System"
        name="bankDetails.tax_system"
        errorText={errors.bankDetails?.tax_system}
      />
      <TextInput
        isError={Boolean(errors.bankDetails?.iban && touched.bankDetails?.iban)}
        isTouched={Boolean(touched.bankDetails?.iban)}
        placeholder="UA123..."
        title="IBAN"
        name="bankDetails.iban"
        errorText={errors.bankDetails?.iban}
      />
      <TextInput
        isError={Boolean(errors.bankDetails?.bank_name && touched.bankDetails?.bank_name)}
        isTouched={Boolean(touched.bankDetails?.bank_name)}
        placeholder="PrivatBank"
        title="Bank Name"
        name="bankDetails.bank_name"
        errorText={errors.bankDetails?.bank_name}
      />
      <TextInput
        isError={Boolean(errors.bankDetails?.mfo && touched.bankDetails?.mfo)}
        isTouched={Boolean(touched.bankDetails?.mfo)}
        placeholder="305299"
        title="MFO"
        name="bankDetails.mfo"
        errorText={errors.bankDetails?.mfo}
      />
      <TextInput
        isError={Boolean(errors.bankDetails?.address && touched.bankDetails?.address)}
        isTouched={Boolean(touched.bankDetails?.address)}
        placeholder="Kyiv, Ukraine"
        title="Address"
        name="bankDetails.address"
        errorText={errors.bankDetails?.address}
      />
      <TextInput
        isError={Boolean(errors.bankDetails?.phone && touched.bankDetails?.phone)}
        isTouched={Boolean(touched.bankDetails?.phone)}
        placeholder="+380..."
        title="Phone"
        name="bankDetails.phone"
        errorText={errors.bankDetails?.phone}
      />
      <TextInput
        isError={Boolean(errors.bankDetails?.email && touched.bankDetails?.email)}
        isTouched={Boolean(touched.bankDetails?.email)}
        placeholder="example@mail.com"
        title="Email"
        name="bankDetails.email"
        errorText={errors.bankDetails?.email}
      />
      <TextInput
        isError={Boolean(
          errors.bankDetails?.contract_number && touched.bankDetails?.contract_number,
        )}
        isTouched={Boolean(touched.bankDetails?.contract_number)}
        placeholder="C-12345"
        title="Contract Number"
        name="bankDetails.contract_number"
        errorText={errors.bankDetails?.contract_number}
      />
      <TextInput
        isError={Boolean(errors.bankDetails?.contract_date && touched.bankDetails?.contract_date)}
        isTouched={Boolean(touched.bankDetails?.contract_date)}
        placeholder="2025-09-09"
        title="Contract Date"
        name="bankDetails.contract_date"
        errorText={errors.bankDetails?.contract_date}
      />
      <TextInput
        isError={Boolean(
          errors.bankDetails?.contract_description && touched.bankDetails?.contract_description,
        )}
        isTouched={Boolean(touched.bankDetails?.contract_description)}
        placeholder="Service agreement..."
        title="Contract Description"
        name="bankDetails.contract_description"
        errorText={errors.bankDetails?.contract_description}
      />
      <TextInput
        isError={Boolean(
          errors.bankDetails?.invoice_description && touched.bankDetails?.invoice_description,
        )}
        isTouched={Boolean(touched.bankDetails?.invoice_description)}
        placeholder="Monthly invoice for services"
        title="Invoice Description"
        name="bankDetails.invoice_description"
        errorText={errors.bankDetails?.invoice_description}
      />
    </div>
  );
};

export default BankDetailsFields;
