import { FormikErrors, FormikHelpers, FormikTouched } from 'formik';
import { useState } from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import { CreateFOPCustomerDto, Currency } from '@/types';

interface Props {
  errors: FormikErrors<CreateFOPCustomerDto>;
  touched: FormikTouched<CreateFOPCustomerDto>;
  setFieldValue: FormikHelpers<CreateFOPCustomerDto>['setFieldValue'];
  requestErr: string;
}

const BasicCustomerFields = ({ errors, touched, setFieldValue, requestErr }: Props) => {
  const [currency, setCurrency] = useState(Currency.EUR);

  return (
    <>
      <TextInput
        isError={Boolean((errors.name && touched.name) || requestErr)}
        isTouched={Boolean(touched.name)}
        placeholder="Customer.."
        title="Customer name"
        name="name"
        errorText={errors.name}
      />
      <TextInput
        isError={Boolean((errors.monthlyPayment && touched.monthlyPayment) || requestErr)}
        isTouched={Boolean(touched.monthlyPayment)}
        placeholder="2000"
        title="Monthly payment"
        name="monthlyPayment"
        errorText={errors.monthlyPayment}
      />
      <TextInput
        isError={Boolean(
          (errors.approximatelyPaymentDay && touched.approximatelyPaymentDay) || requestErr,
        )}
        isTouched={Boolean(touched.approximatelyPaymentDay)}
        placeholder="15"
        title="Approximately payment day"
        name="approximatelyPaymentDay"
        errorText={errors.approximatelyPaymentDay}
      />
      <Dropdown
        title="Select currency"
        selectedItem={{ id: currency, label: currency.toUpperCase() }}
        items={Object.values(Currency).map((item) => ({
          id: item,
          label: item.toUpperCase(),
        }))}
        onSelect={(item) => {
          setCurrency(item.id as Currency);
          setFieldValue('currency', item.id);
        }}
      />
    </>
  );
};

export default BasicCustomerFields;
