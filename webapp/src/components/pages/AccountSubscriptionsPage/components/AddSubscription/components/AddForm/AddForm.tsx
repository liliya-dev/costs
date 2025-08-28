import { Form, Formik, FormikProps } from 'formik';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormDirtyStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormDirtyStateWatcher';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import NumberInput from '@/components/atoms/form-elements/NumberInput/NumberInput';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import TagsSelector from '@/components/molecules/TagsSelector/TagsSelector';
import { Currency, ITag } from '@/types';
import { createSubscription } from '@/utils/api';

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
  description?: string;
  approximatelyPaymentDay: number;
  tags: number[];
}

const AddForm = forwardRef<AddFormRef, IProps>(({ toggleIsDisabled, accountId, callback }, ref) => {
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
    name: '',
    monthlyPayment: 0,
    currency: Currency.EUR,
    description: '',
    approximatelyPaymentDay: 5,
    tags: [],
  };

  useEffect(() => {
    if (!formikRef.current) return;
    toggleIsDisabled(!isDirty || isDisabled);
  }, [isDirty, isDisabled]);

  const handleUpdateSelectedTags = useCallback(
    (tags: ITag[], setFieldValue: FormikProps<FormValues>['setFieldValue']) => {
      setFieldValue(
        'tags',
        tags.map((tag) => tag.id),
      );
    },
    [],
  );

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (
        { monthlyPayment, name, currency, description, approximatelyPaymentDay, tags },
        actions,
      ) => {
        const res = await createSubscription({
          monthlyPayment,
          description,
          currency,
          name,
          approximatelyPaymentDay,
          accountId,
          isCancelled: false,
          tags,
        });

        if (res.data) {
          actions.resetForm();
          setRequestErr('');
          callback();
        } else if (res.message) {
          setRequestErr('Error occurred');
        }
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <>
          <FormDirtyStateWatcher setIsDirty={setIsDirty} />
          <FormStateWatcher setIsDisabled={setIsDisabled} />
          <Form onChange={() => setRequestErr('')}>
            <TextInput
              isError={Boolean(errors.name || requestErr)}
              isTouched={Boolean(touched.name)}
              placeholder="ChatGPT"
              title="Subscription name"
              name="name"
              errorText={errors.name}
            />
            <TextInput
              isError={Boolean(errors.description || requestErr)}
              isTouched={Boolean(touched.description)}
              placeholder="Subscription description"
              title="Description"
              name="description"
              errorText={errors.description}
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
              placeholder="5"
              title="Approximately payment day from 1 to 28"
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
            <TagsSelector
              accountId={accountId}
              onChange={(tags) => handleUpdateSelectedTags(tags, setFieldValue)}
            />
            {requestErr !== '' && <p className="text-sm font-bold text-red-400">{requestErr}</p>}
          </Form>
        </>
      )}
    </Formik>
  );
});

AddForm.displayName = 'AddForm';

export default AddForm;
