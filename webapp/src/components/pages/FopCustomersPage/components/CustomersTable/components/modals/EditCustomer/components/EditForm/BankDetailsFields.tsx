import { FormikErrors, FormikTouched } from 'formik';

import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import { CreateFOPCustomerDto } from '@/types';

interface IProps {
  errors: FormikErrors<CreateFOPCustomerDto>;
  touched: FormikTouched<CreateFOPCustomerDto>;
}

const BankDetailsFields = ({ errors, touched }: IProps) => {
  return (
    <>
      <TextInput
        name="bankDetails.edrpou"
        title="EDRPOU"
        placeholder="12345678"
        isError={Boolean(errors.bankDetails?.edrpou)}
        isTouched={Boolean(touched.bankDetails?.edrpou)}
        errorText={errors.bankDetails?.edrpou}
      />

      <TextInput
        name="bankDetails.ipn"
        title="IPN"
        placeholder="1234567890"
        isError={Boolean(errors.bankDetails?.ipn)}
        isTouched={Boolean(touched.bankDetails?.ipn)}
        errorText={errors.bankDetails?.ipn}
      />

      <TextInput
        name="bankDetails.vat_certificate"
        title="VAT Certificate"
        placeholder="123456789"
        isError={Boolean(errors.bankDetails?.vat_certificate)}
        isTouched={Boolean(touched.bankDetails?.vat_certificate)}
        errorText={errors.bankDetails?.vat_certificate}
      />

      <TextInput
        name="bankDetails.tax_system"
        title="Tax System"
        placeholder="General / Simplified"
        isError={Boolean(errors.bankDetails?.tax_system)}
        isTouched={Boolean(touched.bankDetails?.tax_system)}
        errorText={errors.bankDetails?.tax_system}
      />

      <TextInput
        name="bankDetails.iban"
        title="IBAN"
        placeholder="UA123456789012345678901234567"
        isError={Boolean(errors.bankDetails?.iban)}
        isTouched={Boolean(touched.bankDetails?.iban)}
        errorText={errors.bankDetails?.iban}
      />

      <TextInput
        name="bankDetails.bank_name"
        title="Bank Name"
        placeholder="PrivatBank"
        isError={Boolean(errors.bankDetails?.bank_name)}
        isTouched={Boolean(touched.bankDetails?.bank_name)}
        errorText={errors.bankDetails?.bank_name}
      />

      <TextInput
        name="bankDetails.mfo"
        title="MFO"
        placeholder="305299"
        isError={Boolean(errors.bankDetails?.mfo)}
        isTouched={Boolean(touched.bankDetails?.mfo)}
        errorText={errors.bankDetails?.mfo}
      />

      <TextInput
        name="bankDetails.address"
        title="Address"
        placeholder="Kyiv, Ukraine"
        isError={Boolean(errors.bankDetails?.address)}
        isTouched={Boolean(touched.bankDetails?.address)}
        errorText={errors.bankDetails?.address}
      />

      <TextInput
        name="bankDetails.phone"
        title="Phone"
        placeholder="+380..."
        isError={Boolean(errors.bankDetails?.phone)}
        isTouched={Boolean(touched.bankDetails?.phone)}
        errorText={errors.bankDetails?.phone}
      />

      <TextInput
        name="bankDetails.email"
        title="Email"
        placeholder="example@email.com"
        isError={Boolean(errors.bankDetails?.email)}
        isTouched={Boolean(touched.bankDetails?.email)}
        errorText={errors.bankDetails?.email}
      />

      <TextInput
        name="bankDetails.contract_number"
        title="Contract Number"
        placeholder="№ 15/2025"
        isError={Boolean(errors.bankDetails?.contract_number)}
        isTouched={Boolean(touched.bankDetails?.contract_number)}
        errorText={errors.bankDetails?.contract_number}
      />

      <TextInput
        name="bankDetails.contract_date"
        title="Contract Date"
        placeholder="2025-01-15"
        isError={Boolean(errors.bankDetails?.contract_date)}
        isTouched={Boolean(touched.bankDetails?.contract_date)}
        errorText={errors.bankDetails?.contract_date}
      />

      <TextInput
        name="bankDetails.contract_description"
        title="Contract Description"
        placeholder="Description of contract"
        isError={Boolean(errors.bankDetails?.contract_description)}
        isTouched={Boolean(touched.bankDetails?.contract_description)}
        errorText={errors.bankDetails?.contract_description}
      />

      <TextInput
        name="bankDetails.invoice_description"
        title="Invoice Description"
        placeholder="Invoice for services..."
        isError={Boolean(errors.bankDetails?.invoice_description)}
        isTouched={Boolean(touched.bankDetails?.invoice_description)}
        errorText={errors.bankDetails?.invoice_description}
      />

      <TextInput
        name="bankDetails.invoice_prefix"
        title="Invoice Prefix"
        placeholder="T"
        isError={Boolean(errors.bankDetails?.invoice_prefix)}
        isTouched={Boolean(touched.bankDetails?.invoice_prefix)}
        errorText={errors.bankDetails?.invoice_prefix}
      />

      <TextInput
        name="bankDetails.director"
        title="Director"
        placeholder="Ivan Ivanov"
        isError={Boolean(errors.bankDetails?.director)}
        isTouched={Boolean(touched.bankDetails?.director)}
        errorText={errors.bankDetails?.director}
      />
    </>
  );
};

export default BankDetailsFields;
