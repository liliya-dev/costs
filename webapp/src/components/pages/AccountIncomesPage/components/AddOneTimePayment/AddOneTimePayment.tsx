import { Form, Formik, FormikProps } from 'formik';
import { useRef, useState } from 'react';

import Button from '@/components/atoms/Button/Button';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import Loader from '@/components/atoms/Loader/Loader';
import { Currency } from '@/types';
import { createOTI } from '@/utils/api';

import { validationSchema } from './validation-schema';

interface IProps {
  callback: () => void;
  accountId: number;
}

interface FormValues {
  currency: Currency;
  amount?: string;
  name: string;
  description: string;
}

const AddOneTimePayment = ({ callback, accountId }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const formikRef = useRef<FormikProps<FormValues> | null>(null);
  const [currency, setCurrency] = useState(Currency.EUR);
  const [requestErr, setRequestErr] = useState('');
  const initialValues: FormValues = {
    currency: Currency.EUR,
    amount: '',
    name: '',
    description: '',
  };
  return (
    <div>
      {isLoading && (
        <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
          <Loader />
        </div>
      )}
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async ({ amount, name, currency, description }, actions) => {
          setIsLoading(true);
          if (!amount) return;
          const res = await createOTI({
            accountId,
            amount: +amount,
            description,
            currency,
            name,
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
                  isError={Boolean(errors.name || requestErr)}
                  isTouched={Boolean(touched.name)}
                  placeholder="Upwork"
                  title="Payment name"
                  name="name"
                  errorText={errors.name}
                />
                <TextInput
                  isError={Boolean(errors.description || requestErr)}
                  isTouched={Boolean(touched.description)}
                  placeholder="Payment description"
                  title="Description"
                  name="description"
                  errorText={errors.description}
                />
                <TextInput
                  isError={Boolean(errors.amount || requestErr)}
                  isTouched={Boolean(touched.amount)}
                  placeholder="2000"
                  title="Total Amount paid per transaction"
                  name="amount"
                  errorText={errors.amount}
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

export default AddOneTimePayment;
