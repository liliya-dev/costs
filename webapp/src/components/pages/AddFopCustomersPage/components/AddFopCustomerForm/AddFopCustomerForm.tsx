import { Form, Formik, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import Button from '@/components/atoms/Button/Button';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import Loader from '@/components/atoms/Loader/Loader';
import { CreateFOPCustomerDto, Currency } from '@/types';
import { createFopCustomer } from '@/utils/api';

import BankDetailsFields from './components/BankDetailsFields';
import BasicCustomerFields from './components/BasicCustomerFields';
import { validationSchema } from './validation-schema';

interface IProps {
  accountId: number;
}

const AddFopCustomerForm = ({ accountId }: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [requestErr, setRequestErr] = useState('');
  const formikRef = useRef<FormikProps<CreateFOPCustomerDto> | null>(null);
  const router = useRouter();

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
            id: 0,
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
            router.push(`/account/${accountId}/fop/customers`);
          } else if (res.message) {
            setRequestErr(res.message || 'Error occurred');
          }
          setIsLoading(false);
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <>
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
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => {}}
                  type="SUCCESS"
                  title="Add"
                  buttonType="submit"
                  isDisabled={isDisabled}
                />
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default AddFopCustomerForm;
