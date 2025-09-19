import { FormikErrors, FormikHelpers, FormikTouched } from 'formik';
import { useState } from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import NumberInput from '@/components/atoms/form-elements/NumberInput/NumberInput';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import { CreateFOPCustomerDto, Currency } from '@/types';

interface IProps {
  errors: FormikErrors<CreateFOPCustomerDto>;
  touched: FormikTouched<CreateFOPCustomerDto>;
  setFieldValue: FormikHelpers<CreateFOPCustomerDto>['setFieldValue'];
  requestErr: string;
  initialCurrency: Currency;
}

const BasicCustomerFields = ({
  errors,
  touched,
  setFieldValue,
  requestErr,
  initialCurrency,
}: IProps) => {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  return (
    <>
      <TextInput
        isError={Boolean(errors.name || requestErr)}
        isTouched={Boolean(touched.name)}
        placeholder="FOP Customer name"
        title="Customer name"
        name="name"
        errorText={errors.name}
      />

      <NumberInput
        name="monthlyPayment"
        placeholder="2000"
        title="Monthly payment"
        isError={Boolean(errors.monthlyPayment || requestErr)}
        isTouched={Boolean(touched.monthlyPayment)}
        errorText={errors.monthlyPayment}
      />

      <NumberInput
        name="approximatelyPaymentDay"
        placeholder="10"
        title="Approximately payment day (1-28)"
        isError={Boolean(errors.approximatelyPaymentDay || requestErr)}
        isTouched={Boolean(touched.approximatelyPaymentDay)}
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
      <div className="mb-4" />
    </>
  );
};

export default BasicCustomerFields;
