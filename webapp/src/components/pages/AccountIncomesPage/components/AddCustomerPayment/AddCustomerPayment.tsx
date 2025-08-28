import { Form, Formik, FormikProps } from 'formik';
import { useRef, useState } from 'react';

import Button from '@/components/atoms/Button/Button';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import Loader from '@/components/atoms/Loader/Loader';
import { ICustomer, Currency } from '@/types';
import { createTransaction } from '@/utils/api';

import IRPDatesPreview from './components/IRPDatesPreview/ IRPDatesPreview';
import { validationSchema } from './validation-schema';

interface IProps {
  callback: () => void;
  customers: ICustomer[];
}

interface FormValues {
  customerId: number;
  currency: Currency;
  amount?: string;
  numberOfPayments: number;
}

const AddCustomerPayment = ({ callback, customers }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const formikRef = useRef<FormikProps<FormValues> | null>(null);
  const [currency, setCurrency] = useState(Currency.EUR);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [requestErr, setRequestErr] = useState('');
  const [selectedIrpDates, setSelectedIrpDates] = useState<string[]>([]);

  const initialValues: FormValues = {
    customerId: customers[0]?.id,
    currency: Currency.EUR,
    numberOfPayments: 1,
    amount: '',
  };

  return (
    <>
      {isLoading && (
        <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
          <Loader />
        </div>
      )}
      {selectedCustomer && (
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async ({ amount, numberOfPayments, currency, customerId }, actions) => {
            setIsLoading(true);
            if (!amount) return;
            const res = await createTransaction({
              amount: +amount,
              customerId,
              numberOfPayments: +numberOfPayments,
              currency,
              datesShouldBePaid: selectedIrpDates,
            });
            if (res.data) {
              actions.resetForm();
              setCurrency(Currency.EUR);
              setSelectedCustomer(customers[0]);
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
                  <Dropdown
                    selectedItem={{ id: selectedCustomer.id, label: selectedCustomer.name }}
                    title="Select customer"
                    items={customers.map((item) => ({ id: item.id, label: item.name }))}
                    onSelect={(item) => {
                      setSelectedCustomer(
                        customers.find((customer) => +customer.id === +item.id) as ICustomer,
                      );
                      setFieldValue('customerId', item.id);
                    }}
                  />
                  <div className="mb-6" />
                  <TextInput
                    isError={Boolean(errors.amount || requestErr)}
                    isTouched={Boolean(touched.amount)}
                    placeholder="2000"
                    title="Total Amount paid per transaction"
                    name="amount"
                    errorText={errors.amount}
                  />
                  <TextInput
                    isError={Boolean(errors.numberOfPayments || requestErr)}
                    isTouched={Boolean(touched.numberOfPayments)}
                    placeholder="Number of payments"
                    title="Number of payments per this transaction"
                    name="numberOfPayments"
                    errorText={errors.numberOfPayments}
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
                  {requestErr !== '' && (
                    <p className="text-sm font-bold text-red-400">{requestErr}</p>
                  )}
                  {!isLoading && (
                    <IRPDatesPreview
                      numberOfPayments={+(formikRef.current?.values.numberOfPayments || 1)}
                      onDatesChange={setSelectedIrpDates}
                      customer={selectedCustomer}
                    />
                  )}
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="SUCESS"
                      title="Add"
                      buttonType="submit"
                      onClick={() => {}}
                      isDisabled={
                        isDisabled ||
                        +(formikRef.current?.values.numberOfPayments || 1) !==
                          selectedIrpDates.length
                      }
                    />
                  </div>
                </Form>
              </>
            );
          }}
        </Formik>
      )}
    </>
  );
};

export default AddCustomerPayment;
