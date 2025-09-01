import { Form, Formik, FormikProps } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormDirtyStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormDirtyStateWatcher';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import NumberInput from '@/components/atoms/form-elements/NumberInput/NumberInput';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import TagsSelector from '@/components/molecules/TagsSelector/TagsSelector';
import { Currency, ITag } from '@/types';
import { createPBI } from '@/utils/api';

import { validationSchema } from './validation-schema';

interface IProps {
  accountId: number;
  toggleIsDisabled: (value: boolean) => void;
  callback: () => void;
}

export interface AddFormRef {
  submitForm: () => void;
}

interface FormValues {
  name: string;
  monthlyPayment: number;
  currency: Currency;
  approximatelyPaymentDay: number;
  numberOfPayments: number;
  numberOfDownpayments?: number;
  tags: number[];
  description?: string;
}

const AddForm = forwardRef<AddFormRef, IProps>(({ toggleIsDisabled, accountId, callback }, ref) => {
  const formikRef = useRef<FormikProps<FormValues> | null>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [currency, setCurrency] = useState(Currency.EUR);
  const [requestErr, setRequestErr] = useState('');

  const handleUpdateSelectedTags = useCallback(
    (tags: ITag[], setFieldValue: FormikProps<FormValues>['setFieldValue']) => {
      setFieldValue(
        'tags',
        tags.map((tag) => tag.id),
      );
    },
    [],
  );

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      formikRef.current?.handleSubmit();
    },
  }));

  const initialValues: FormValues = {
    name: '',
    monthlyPayment: 0,
    currency: Currency.EUR,
    approximatelyPaymentDay: 5,
    numberOfPayments: 1,
    tags: [],
    description: '',
  };

  useEffect(() => {
    if (!formikRef.current) return;
    toggleIsDisabled(!isDirty || isDisabled);
  }, [isDirty, isDisabled]);

  console.log({ isDirty, isDisabled });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (
        {
          name,
          monthlyPayment,
          currency,
          approximatelyPaymentDay,
          tags,
          numberOfPayments,
          description,
          numberOfDownpayments,
        },
        actions,
      ) => {
        const res = await createPBI({
          description,
          name,
          monthlyPayment,
          currency,
          approximatelyPaymentDay,
          accountId,
          tags,
          isFullyPaid: false,
          numberOfPayments,
          numberOfDownpayments,
        });

        if (res.data) {
          actions.resetForm();
          setRequestErr('');
          callback();
        } else {
          setRequestErr(res.message || 'Server error');
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
                name="name"
                title="Payment name"
                placeholder="Iphone"
                isError={Boolean(errors.name || requestErr)}
                isTouched={Boolean(touched.name)}
                errorText={errors.name}
              />
              <TextInput
                isError={Boolean(errors.description || requestErr)}
                isTouched={Boolean(touched.description)}
                placeholder="Description"
                title="Description"
                name="description"
                errorText={errors.description}
              />
              <NumberInput
                name="monthlyPayment"
                title="Monthly Payment"
                placeholder="1500"
                isError={Boolean(errors.monthlyPayment || requestErr)}
                isTouched={Boolean(touched.monthlyPayment)}
                errorText={errors.monthlyPayment}
              />
              <NumberInput
                name="approximatelyPaymentDay"
                title="Payment Day (1–28)"
                placeholder="5"
                isError={Boolean(errors.approximatelyPaymentDay || requestErr)}
                isTouched={Boolean(touched.approximatelyPaymentDay)}
                errorText={errors.approximatelyPaymentDay}
              />
              <NumberInput
                name="numberOfPayments"
                title="Number of payments"
                placeholder="5"
                isError={Boolean(errors.numberOfPayments || requestErr)}
                isTouched={Boolean(touched.numberOfPayments)}
                errorText={errors.numberOfPayments}
              />
              <NumberInput
                name="numberOfDownpayments"
                title="Number of downpayments"
                placeholder="5"
                isError={Boolean(errors.numberOfDownpayments || requestErr)}
                isTouched={Boolean(touched.numberOfDownpayments)}
                errorText={errors.numberOfDownpayments}
              />
              <Dropdown
                title="Select Currency"
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
              <TagsSelector
                accountId={accountId}
                onChange={(tags) => handleUpdateSelectedTags(tags, setFieldValue)}
              />
              {requestErr && <p className="text-sm font-bold text-red-400">{requestErr}</p>}
            </Form>
          </>
        );
      }}
    </Formik>
  );
});

AddForm.displayName = 'AddForm';

export default AddForm;
