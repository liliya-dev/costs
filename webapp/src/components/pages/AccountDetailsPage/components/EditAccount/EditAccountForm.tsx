import { Form, Formik, FormikProps } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import FormDirtyStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormDirtyStateWatcher';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import { IAccount } from '@/types';
import { updateAccount } from '@/utils/api';

import { validationSchema } from './validation-schema';

interface IProps {
  account: IAccount;
  toggleIsDisabled: (value: boolean) => void;
  callback: () => void;
}

export interface EditAccountFormRef {
  submitForm: () => void;
}

interface FormValues {
  fopFullName?: string;
  directorName?: string;
  iban?: string;
  bankName?: string;
  ipn?: string;
  bankEdrpou?: string;
  mfo?: string;
  address?: string;
  taxSystem?: string;
  phone?: string;
}

const EditAccountForm = forwardRef<EditAccountFormRef, IProps>(
  ({ toggleIsDisabled, account, callback }, ref) => {
    const formikRef = useRef<FormikProps<FormValues> | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [requestErr, setRequestErr] = useState('');

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        formikRef.current?.handleSubmit();
      },
    }));

    const initialValues: FormValues = {
      fopFullName: account.fopFullName,
      directorName: account.directorName,
      iban: account.iban,
      bankName: account.bankName,
      ipn: account.ipn,
      bankEdrpou: account.bankEdrpou,
      mfo: account.mfo,
      address: account.address,
      taxSystem: account.taxSystem,
      phone: account.phone,
    };

    useEffect(() => {
      toggleIsDisabled(!isDirty || isDisabled);
    }, [isDirty, isDisabled]);

    return (
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          const res = await updateAccount(account.id, { ...account, ...values });

          if (res.data) {
            actions.resetForm();
            setRequestErr('');
            callback();
          } else if (res.message) {
            setRequestErr(res.message || 'Error occurred');
          }
        }}
      >
        {({ errors, touched }) => (
          <>
            <FormDirtyStateWatcher setIsDirty={setIsDirty} />
            <FormStateWatcher setIsDisabled={setIsDisabled} />
            <Form onChange={() => setRequestErr('')}>
              {Object.entries(initialValues).map(([key]) => (
                <TextInput
                  key={key}
                  title={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  name={key}
                  placeholder={key}
                  isError={Boolean(errors[key as keyof FormValues])}
                  isTouched={Boolean(touched[key as keyof FormValues])}
                  errorText={errors[key as keyof FormValues]}
                />
              ))}
              {requestErr && <p className="text-sm font-bold text-red-400">{requestErr}</p>}
            </Form>
          </>
        )}
      </Formik>
    );
  },
);

EditAccountForm.displayName = 'EditAccountForm';

export default EditAccountForm;
