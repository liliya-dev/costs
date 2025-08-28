import { Form, Formik, FormikProps } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import Checkbox from '@/components/atoms/Checkbox/Checkbox';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormDirtyStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormDirtyStateWatcher';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import NumberInput from '@/components/atoms/form-elements/NumberInput/NumberInput';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import { Currency, ICustomer } from '@/types';
import { updateCustomer } from '@/utils/api';

import { validationSchema } from './validation-schema';

interface IProps {
  customer: ICustomer;
  toggleIsDisabled: (value: boolean) => void;
  callback: () => void;
}

export interface EditFormRef {
  submitForm: () => void;
}

interface FormValues {
  name: string;
  monthlyPayment: number;
  currency: Currency;
  isCashless: boolean;
  approximatelyPaymentDay: number;
}

const EditForm = forwardRef<EditFormRef, IProps>(
  ({ toggleIsDisabled, customer, callback }, ref) => {
    const formikRef = useRef<FormikProps<FormValues> | null>(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [currency, setCurrency] = useState<Currency>(customer.currency);
    const [requestErr, setRequestErr] = useState('');

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        formikRef.current?.handleSubmit();
      },
    }));

    const initialValues: FormValues = {
      name: customer.name,
      monthlyPayment: customer.monthlyPayment,
      currency: customer.currency,
      approximatelyPaymentDay: customer.approximatelyPaymentDay,
      isCashless: customer.isCashless,
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
        onSubmit={async (
          { monthlyPayment, name, currency, isCashless, approximatelyPaymentDay },
          actions,
        ) => {
          const res = await updateCustomer(customer.id, {
            monthlyPayment,
            name,
            currency,
            isCashless,
            approximatelyPaymentDay,
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
                title="Customer name"
                name="name"
                errorText={errors.name}
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
                placeholder="10"
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
              <Checkbox name="isCashless" label="Is client cashless" />
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
