import { Form, Formik, FormikProps } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormDirtyStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormDirtyStateWatcher';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import NumberInput from '@/components/atoms/form-elements/NumberInput/NumberInput';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import TagsSelector from '@/components/molecules/TagsSelector/TagsSelector';
import { Currency, ITag } from '@/types';
import { createOTP } from '@/utils/api';

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
  amount: number;
  currency: Currency;
  name: string;
  description?: string;
  tags: ITag[];
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
    amount: 0,
    currency: Currency.EUR,
    name: '',
    description: '',
    tags: [],
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
      onSubmit={async ({ name, amount, currency, tags, description }, actions) => {
        const res = await createOTP({
          accountId,
          amount,
          currency,
          name,
          description,
          tags: tags.map((tag) => tag.id),
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
      {({ errors, touched, setFieldValue }) => (
        <>
          <FormDirtyStateWatcher setIsDirty={setIsDirty} />
          <FormStateWatcher setIsDisabled={setIsDisabled} />
          <Form onChange={() => setRequestErr('')}>
            <TextInput
              name="name"
              title="Payment name"
              placeholder="Pharmacy"
              isError={Boolean(errors.name || requestErr)}
              isTouched={Boolean(touched.name)}
              errorText={errors.name}
            />
            <TextInput
              name="description"
              title="Description"
              placeholder="Optional description"
              isError={Boolean(errors.description || requestErr)}
              isTouched={Boolean(touched.description)}
              errorText={errors.description}
            />
            <NumberInput
              name="amount"
              title="Amount"
              placeholder="500"
              isError={Boolean(errors.amount || requestErr)}
              isTouched={Boolean(touched.amount)}
              errorText={errors.amount}
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
            <TagsSelector accountId={accountId} onChange={(tags) => setFieldValue('tags', tags)} />
            {requestErr && <p className="text-sm font-bold text-red-400">{requestErr}</p>}
          </Form>
        </>
      )}
    </Formik>
  );
});

AddForm.displayName = 'AddForm';

export default AddForm;
