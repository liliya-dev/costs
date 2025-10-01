import { Form, Formik, FormikProps } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import FormDirtyStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormDirtyStateWatcher';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import Loader from '@/components/atoms/Loader/Loader';
import { CreateFOPCustomerDto, Currency } from '@/types';
import { createFopCustomer } from '@/utils/api';

import BankDetailsFields from './components/BankDetailsFields';
import BasicCustomerFields from './components/BasicCustomerFields';
import { validationSchema } from './validation-schema';

interface IProps {
  accountId: number;
  toggleIsDisabled: (value: boolean) => void;
  callback: () => void;
}

export interface AddFormRef {
  submitForm: () => void;
}

const AddForm = forwardRef<AddFormRef, IProps>(({ toggleIsDisabled, accountId, callback }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [requestErr, setRequestErr] = useState('');
  const formikRef = useRef<FormikProps<CreateFOPCustomerDto> | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      formikRef.current?.handleSubmit();
    },
  }));

  useEffect(() => {
    if (!formikRef.current) return;
    toggleIsDisabled(!isDirty || isDisabled);
  }, [isDirty, isDisabled]);

  const initialValues: CreateFOPCustomerDto = {
    accountId,
    name: '',
    currency: Currency.EUR,
    monthlyPayment: 0,
    isCancelled: false,
    approximatelyPaymentDay: 28,
    bankDetails: {
      edrpou: '',
      ipn: '',
      vat_certificate: '',
      tax_system: '',
      iban: '',
      bank_name: '',
      mfo: '',
      address: '',
      phone: '',
      email: '',
      contract_number: '',
      contract_date: '',
      contract_description: '',
      invoice_description: '',
      invoice_prefix: '',
      director: '',
    },
  };

  return (
    <>
      {isLoading && (
        <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
          <Loader />
        </div>
      )}
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          setIsLoading(true);
          const dto = {
            accountId,
            name: values.name,
            currency: values.currency,
            monthlyPayment: +values.monthlyPayment,
            isCancelled: values.isCancelled,
            approximatelyPaymentDay: values.approximatelyPaymentDay,
            bankDetails: values.bankDetails,
          };
          const res = await createFopCustomer(dto);
          if (res.data) {
            actions.resetForm();
            setRequestErr('');
            callback();
          } else if (res.message) {
            setRequestErr(res.message || 'Error occurred');
          }
          setIsLoading(false);
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <>
            <FormDirtyStateWatcher setIsDirty={setIsDirty} />
            <FormStateWatcher setIsDisabled={setIsDisabled} />
            <Form onChange={() => setRequestErr('')}>
              <BasicCustomerFields
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                requestErr={requestErr}
              />
              <BankDetailsFields errors={errors} touched={touched} />
              {requestErr !== '' && <p className="text-sm font-bold text-red-400">{requestErr}</p>}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
});

AddForm.displayName = 'AddForm';

export default AddForm;
