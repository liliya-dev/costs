import { Form, Formik, FormikProps } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormDirtyStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormDirtyStateWatcher';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import NumberInput from '@/components/atoms/form-elements/NumberInput/NumberInput';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import { Currency, IOTI } from '@/types';
import { updateOti } from '@/utils/api';

import { validationSchema } from './validation-schema';

interface IProps {
  callback: () => void;
  oti: IOTI;
  toggleIsDisabled: (value: boolean) => void;
}

export interface EditFormRef {
  submitForm: () => void;
}

interface FormValues {
  currency: Currency;
  amount: number;
  name: string;
  description?: string;
}

const EditForm = forwardRef<EditFormRef, IProps>(({ callback, oti, toggleIsDisabled }, ref) => {
  const formikRef = useRef<FormikProps<FormValues> | null>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [currency, setCurrency] = useState(Currency.EUR);
  const [requestErr, setRequestErr] = useState('');

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      formikRef.current?.handleSubmit();
    },
  }));

  const initialValues: FormValues = {
    currency,
    amount: oti.amount,
    description: oti.description || '',
    name: oti.name,
  };

  useEffect(() => {
    if (!formikRef.current) return;
    toggleIsDisabled(!isDirty || isDisabled);
  }, [isDirty, isDisabled]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async ({ amount, name, currency, description }, actions) => {
        if (!amount) return;
        const res = await updateOti(oti.id, {
          amount,
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
          setRequestErr('Error occurred');
        }
      }}
    >
      {({ errors, touched, setFieldValue }) => {
        return (
          <>
            <FormDirtyStateWatcher setIsDirty={setIsDirty} />
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
              <NumberInput
                name="amount"
                placeholder="2000"
                title="Amount paid"
                isError={Boolean(errors.amount || requestErr)}
                isTouched={Boolean(touched.amount)}
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
              {requestErr !== '' && <p className="text-sm font-bold text-red-400">{requestErr}</p>}
            </Form>
          </>
        );
      }}
    </Formik>
  );
});

EditForm.displayName = 'EditForm';

export default EditForm;
