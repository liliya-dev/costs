import { Form, Formik, FormikProps } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormDirtyStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormDirtyStateWatcher';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import NumberInput from '@/components/atoms/form-elements/NumberInput/NumberInput';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import TagsSelector from '@/components/molecules/TagsSelector/TagsSelector';
import { Currency, IOTP, ITag } from '@/types';
import { updateOTP } from '@/utils/api';

import { validationSchema } from './validation-schema';

interface IProps {
  accountId: number;
  otp: IOTP;
  toggleIsDisabled: (value: boolean) => void;
  callback: () => void;
}

export interface EditFormRef {
  submitForm: () => void;
}

interface FormValues {
  name: string;
  amount: number;
  currency: Currency;
  description?: string;
  tags: ITag[];
}

const EditForm = forwardRef<EditFormRef, IProps>(
  ({ toggleIsDisabled, otp, callback, accountId }, ref) => {
    const formikRef = useRef<FormikProps<FormValues> | null>(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [currency, setCurrency] = useState<Currency>(otp.currency);
    const [requestErr, setRequestErr] = useState('');

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        formikRef.current?.handleSubmit();
      },
    }));

    const initialValues: FormValues = {
      name: otp.name,
      amount: otp.amount,
      currency: otp.currency,
      description: otp.description ?? '',
      tags: otp.tags || [],
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
        onSubmit={async ({ name, amount, currency, description, tags }, actions) => {
          const res = await updateOTP(otp.id, {
            name,
            amount,
            currency,
            description,
            tags: tags.map((tag) => tag.id),
          });

          if (res.data) {
            actions.resetForm();
            setRequestErr('');
            callback();
          } else if (res.message) {
            setRequestErr(res.message || 'Server error');
          }
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <>
            <FormDirtyStateWatcher setIsDirty={setIsDirty} />
            <FormStateWatcher setIsDisabled={setIsDisabled} />
            <Form onChange={() => setRequestErr('')}>
              <TextInput
                isError={Boolean(errors.name || requestErr)}
                isTouched={Boolean(touched.name)}
                placeholder="Netflix"
                title="Payment name"
                name="name"
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
                name="amount"
                placeholder="2000"
                title="Amount"
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
              <TagsSelector
                accountId={accountId}
                selected={values.tags}
                onChange={(tags) => setFieldValue('tags', tags)}
              />
              {requestErr !== '' && <p className="text-sm font-bold text-red-400">{requestErr}</p>}
            </Form>
          </>
        )}
      </Formik>
    );
  },
);

EditForm.displayName = 'EditForm';

export default EditForm;
