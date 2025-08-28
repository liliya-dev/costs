import { Form, Formik, FormikProps } from 'formik';
import { useRef, useState } from 'react';

import Button from '@/components/atoms/Button/Button';
import Checkbox from '@/components/atoms/Checkbox/Checkbox';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import Loader from '@/components/atoms/Loader/Loader';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { Currency } from '@/types';
import { createCustomer } from '@/utils/api';

import { validationSchema } from './validation-schema';

interface FormValues {
  currency: Currency;
  monthlyPayment?: string;
  name: string;
  approximatelyPaymentDay: number;
  isCashless: boolean;
}

interface IProps {
  callback: () => void;
  accountId: number;
}

const AddCustomerForm = ({ callback, accountId }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const formikRef = useRef<FormikProps<FormValues> | null>(null);
  const [currency, setCurrency] = useState(Currency.EUR);
  const [requestErr, setRequestErr] = useState('');
  const initialValues: FormValues = {
    currency: Currency.EUR,
    monthlyPayment: '',
    name: '',
    approximatelyPaymentDay: 15,
    isCashless: false,
  };
  return (
    <div className="mt-12 h-full w-full rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-6">
      {isLoading && (
        <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
          <Loader />
        </div>
      )}
      <TableTitle title="Add new customer" />
      <div className="mb-8" />
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (
          { monthlyPayment, name, currency, approximatelyPaymentDay, isCashless },
          actions,
        ) => {
          setIsLoading(true);
          if (!monthlyPayment) return;
          const res = await createCustomer({
            accountId,
            monthlyPayment: +monthlyPayment,
            isCashless,
            currency,
            name,
            approximatelyPaymentDay: +approximatelyPaymentDay,
          });
          if (res.data) {
            actions.resetForm();
            setRequestErr('');
            setCurrency(Currency.EUR);
            callback();
          } else if (res.message) {
            setRequestErr('Error occured');
          }
          setIsLoading(false);
        }}
      >
        {({ errors, touched, setFieldValue }) => {
          return (
            <>
              <FormStateWatcher setIsDisabled={setIsDisabled} />
              <Form onChange={() => setRequestErr('')}>
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
                    (errors.approximatelyPaymentDay && touched.approximatelyPaymentDay) ||
                      requestErr,
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
                <Checkbox name="isCashless" label="Is client cashless" />
                {requestErr !== '' && (
                  <p className="text-sm font-bold text-red-400">{requestErr}</p>
                )}
                <div className="mt-4 flex justify-end">
                  <Button
                    type="SUCESS"
                    title="Add"
                    buttonType="submit"
                    onClick={() => {}}
                    isDisabled={isDisabled}
                  />
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddCustomerForm;
