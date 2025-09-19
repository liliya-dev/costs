import { Form, Formik, FormikProps } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import FormDirtyStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormDirtyStateWatcher';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import { CreateFOPCustomerDto, IFOPCustomer, Currency } from '@/types';
import { updateFopCustomer } from '@/utils/api';

import BankDetailsFields from './BankDetailsFields';
import BasicCustomerFields from './BasicCustomerFields';
import { validationSchema } from './validation-schema';

interface IProps {
  customer: IFOPCustomer;
  toggleIsDisabled: (value: boolean) => void;
  callback: () => void;
  accountId: number;
}

export interface EditFopFormRef {
  submitForm: () => void;
}

const EditFopForm = forwardRef<EditFopFormRef, IProps>(
  ({ toggleIsDisabled, customer, accountId, callback }, ref) => {
    const formikRef = useRef<FormikProps<CreateFOPCustomerDto> | null>(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [requestErr, setRequestErr] = useState('');

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        formikRef.current?.handleSubmit();
      },
    }));

    const initialValues: CreateFOPCustomerDto = {
      accountId: accountId,
      name: customer.name,
      currency: customer.currency || Currency.EUR,
      monthlyPayment: customer.monthlyPayment,
      isCancelled: customer.isCancelled,
      approximatelyPaymentDay: customer.approximatelyPaymentDay,
      bankDetails: {
        edrpou: customer.bankDetails?.edrpou || '',
        ipn: customer.bankDetails?.ipn || '',
        vat_certificate: customer.bankDetails?.vat_certificate || '',
        tax_system: customer.bankDetails?.tax_system || '',
        iban: customer.bankDetails?.iban || '',
        bank_name: customer.bankDetails?.bank_name || '',
        mfo: customer.bankDetails?.mfo || '',
        address: customer.bankDetails?.address || '',
        phone: customer.bankDetails?.phone || '',
        email: customer.bankDetails?.email || '',
        contract_number: customer.bankDetails?.contract_number || '',
        contract_date: customer.bankDetails?.contract_date || '',
        contract_description: customer.bankDetails?.contract_description || '',
        invoice_description: customer.bankDetails?.invoice_description || '',
        invoice_prefix: customer.bankDetails?.invoice_prefix || '',
        director: customer.bankDetails?.director || '',
      },
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
        onSubmit={async (values, actions) => {
          const dto = {
            id: customer.id,
            ...values,
            monthlyPayment: +values.monthlyPayment,
          };

          const res = await updateFopCustomer(customer.id, dto);

          if (res.data) {
            actions.resetForm({ values: dto });
            setRequestErr('');
            callback();
          } else if (res.message) {
            setRequestErr(res.message || 'Error occurred');
          }
        }}
      >
        {({ errors, touched, setFieldValue }) => {
          console.log(errors);
          return (
            <>
              <FormDirtyStateWatcher setIsDirty={setIsDirty} />
              <FormStateWatcher setIsDisabled={setIsDisabled} />
              <Form onChange={() => setRequestErr('')}>
                <BasicCustomerFields
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  requestErr={requestErr}
                  initialCurrency={customer.currency}
                />
                <BankDetailsFields errors={errors} touched={touched} />
                {requestErr !== '' && (
                  <p className="text-sm font-bold text-red-400">{requestErr}</p>
                )}
              </Form>
            </>
          );
        }}
      </Formik>
    );
  },
);

EditFopForm.displayName = 'EditFopForm';

export default EditFopForm;
