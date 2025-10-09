import { Form, Formik, FormikProps } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

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
  approximatelyPaymentDay: number;
  phone?: string;
  tgId?: number;
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
      phone: customer.phone,
      tgId: customer.tgId || undefined,
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
          { monthlyPayment, name, currency, approximatelyPaymentDay, phone, tgId },
          actions,
        ) => {
          const dto = {
            monthlyPayment,
            name,
            currency,
            approximatelyPaymentDay,
            phone,
            tgId: tgId || null,
          };
          console.log(dto);
          const res = await updateCustomer(customer.id, dto);

          if (res.data) {
            actions.resetForm();
            setRequestErr('');
            callback();
          } else if (res.message) {
            setRequestErr(res.message || 'Error occurred');
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
              <TextInput
                isError={Boolean((errors.phone && touched.phone) || requestErr)}
                isTouched={Boolean(touched.phone)}
                placeholder="+380950588989"
                title="Customer Telegram contact"
                name="phone"
                errorText={errors.phone}
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
                isError={Boolean((errors.tgId && touched.tgId) || requestErr)}
                isTouched={Boolean(touched.tgId)}
                placeholder="15"
                title="Telegram id"
                name="tgId"
                errorText={errors.tgId}
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
