import { Formik, Form, FormikProps } from 'formik';
import { forwardRef, useRef, useState, useImperativeHandle, useEffect, useCallback } from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import NumberInput from '@/components/atoms/form-elements/NumberInput/NumberInput';
import Loader from '@/components/atoms/Loader/Loader';
import { IRC, Currency } from '@/types';
import { createRCTransaction } from '@/utils/api';

import RCDatesPreview from '../RCDatesPreview/ RCDatesPreview';

import { validationSchema } from './validation-schema';

interface IProps {
  rc: IRC;
  callback: () => void;
  toggleIsDisabled: (value: boolean) => void;
}

export interface PayFormRef {
  submitForm: () => void;
}

interface FormValues {
  amount: number;
  currency: Currency;
  selectedDate: string | null;
}

const PayForm = forwardRef<PayFormRef, IProps>(({ rc, callback, toggleIsDisabled }, ref) => {
  const [currency, setCurrency] = useState<Currency>(rc.currency);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestErr, setRequestErr] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);

  const formikRef = useRef<FormikProps<FormValues>>(null);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      formikRef.current?.handleSubmit();
    },
  }));

  const handleToggleIsDisabled = useCallback((value: boolean) => {
    setIsDisabled(value);
  }, []);

  useEffect(() => {
    toggleIsDisabled(!(hasChanged && !isDisabled && selectedDate));
  }, [hasChanged, isDisabled, selectedDate]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        amount: rc.monthlyPayment,
        currency,
        selectedDate: null,
      }}
      validationSchema={validationSchema}
      onSubmit={async ({ amount, currency, selectedDate }) => {
        if (!selectedDate) return;
        setIsLoading(true);
        const res = await createRCTransaction({
          amount,
          currency,
          dateShouldBePaid: selectedDate,
          rcId: rc.id,
        });
        if (res.data) {
          callback();
        } else {
          setRequestErr(res.message || 'Error occurred');
        }
        setIsLoading(false);
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <>
          {isLoading && (
            <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
              <Loader />
            </div>
          )}
          <FormStateWatcher setIsDisabled={handleToggleIsDisabled} />
          <Form
            onChange={() => {
              setRequestErr('');
              setHasChanged(true);
            }}
          >
            <NumberInput
              name="amount"
              placeholder="2000"
              title="Amount paid"
              isError={Boolean(errors.amount || requestErr)}
              isTouched={Boolean(touched.amount)}
              errorText={errors.amount}
              disabled={rc.isPermanentAmount}
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
              disabled={rc.isPermanentAmount}
            />
            <RCDatesPreview
              rc={rc}
              initialSelectedDate={null}
              onDateChange={(date: string | null) => {
                setSelectedDate(date);
                setFieldValue('selectedDate', date);
                setHasChanged(true);
              }}
            />
            {requestErr && <p className="text-sm font-bold text-red-400">{requestErr}</p>}
          </Form>
        </>
      )}
    </Formik>
  );
});

PayForm.displayName = 'PayForm';

export default PayForm;
