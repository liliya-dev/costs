import { Form, Formik, FormikProps } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormDirtyStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormDirtyStateWatcher';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import NumberInput from '@/components/atoms/form-elements/NumberInput/NumberInput';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import TagsSelector from '@/components/molecules/TagsSelector/TagsSelector';
import { Currency, IPBI, ITag } from '@/types';
import { updatePBI } from '@/utils/api';

import { validationSchema } from './validation-schema';

interface IProps {
  accountId: number;
  pbi: IPBI;
  toggleIsDisabled: (value: boolean) => void;
  callback: () => void;
  arePaymentFieldsDisabled: boolean;
}

export interface EditFormRef {
  submitForm: () => void;
}

interface FormValues {
  name: string;
  monthlyPayment: number;
  currency: Currency;
  description?: string;
  approximatelyPaymentDay: number;
  tags: ITag[];
  numberOfPayments: number;
  numberOfDownpayments?: number;
}

const EditForm = forwardRef<EditFormRef, IProps>(
  ({ toggleIsDisabled, pbi, callback, accountId, arePaymentFieldsDisabled }, ref) => {
    const formikRef = useRef<FormikProps<FormValues> | null>(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [currency, setCurrency] = useState<Currency>(pbi.currency);
    const [requestErr, setRequestErr] = useState('');

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        formikRef.current?.handleSubmit();
      },
    }));

    const initialValues: FormValues = {
      name: pbi.name,
      monthlyPayment: pbi.monthlyPayment,
      currency: pbi.currency,
      description: pbi.description ?? '',
      approximatelyPaymentDay: pbi.approximatelyPaymentDay,
      tags: pbi.tags || [],
      numberOfPayments: pbi.numberOfPayments,
      numberOfDownpayments: pbi.numberOfDownpayments,
    };

    useEffect(() => {
      if (!formikRef.current) return;
      toggleIsDisabled(!isDirty || isDisabled);
    }, [isDirty, isDisabled]);

    return (
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema(pbi.transactions.length)}
        onSubmit={async (
          {
            monthlyPayment,
            name,
            currency,
            description,
            approximatelyPaymentDay,
            tags,
            numberOfPayments,
            numberOfDownpayments,
          },
          actions,
        ) => {
          const res = await updatePBI(pbi.id, {
            monthlyPayment,
            name,
            currency,
            description,
            approximatelyPaymentDay,
            numberOfDownpayments,
            numberOfPayments,
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
                placeholder="Iphone"
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
                name="monthlyPayment"
                placeholder="2000"
                title="Monthly payment"
                isError={Boolean(errors.monthlyPayment || requestErr)}
                isTouched={Boolean(touched.monthlyPayment)}
                errorText={errors.monthlyPayment}
                disabled={arePaymentFieldsDisabled}
              />
              <NumberInput
                name="approximatelyPaymentDay"
                placeholder="10"
                title="Payment Day (1–28)"
                isError={Boolean(errors.approximatelyPaymentDay || requestErr)}
                isTouched={Boolean(touched.approximatelyPaymentDay)}
                errorText={errors.approximatelyPaymentDay}
                disabled={arePaymentFieldsDisabled}
              />
              <NumberInput
                name="numberOfPayments"
                title="Number of payments"
                placeholder="5"
                isError={Boolean(errors.numberOfPayments || requestErr)}
                isTouched={Boolean(touched.numberOfPayments)}
                errorText={errors.numberOfPayments}
                disabled={arePaymentFieldsDisabled}
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
                title="Select currency"
                selectedItem={{ id: currency, label: currency.toUpperCase() }}
                items={Object.values(Currency).map((item) => ({
                  id: item,
                  label: item.toUpperCase(),
                }))}
                disabled={arePaymentFieldsDisabled}
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
