import { Formik, Form, FormikProps } from 'formik';
import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useEffect,
} from 'react';

import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import NumberInput from '@/components/atoms/form-elements/NumberInput/NumberInput';
import Loader from '@/components/atoms/Loader/Loader';
import IRPDatesPreview from '@/components/pages/AccountIncomesPage/components/AddCustomerPayment/components/IRPDatesPreview/ IRPDatesPreview';
import { Currency, ICustomer, ITransaction } from '@/types';
import { updateTransaction } from '@/utils/api';
import { areArraysEqual } from '@/utils/helpers/are-arrays-equal.helper';

import { validationSchema } from './validation-schema';

interface IProps {
  transaction: ITransaction;
  customers: ICustomer[];
  callback: () => void;
  toggleIsDisabled: (value: boolean) => void;
}

export interface EditFormRef {
  submitForm: () => void;
}

interface FormValues {
  customerId: number;
  currency: Currency;
  amount: number;
  numberOfPayments: number;
}

const EditForm = forwardRef<EditFormRef, IProps>(
  ({ transaction, customers, callback, toggleIsDisabled }, ref) => {
    const [currency, setCurrency] = useState<Currency>(transaction.currency);
    const [selectedCustomer, setSelectedCustomer] = useState<ICustomer>(transaction.customer);
    const [isLoading, setIsLoading] = useState(false);
    const [requestErr, setRequestErr] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [hasSomethingChanged, setHasSomethingChanged] = useState(false);
    const [selectedIrpDates, setSelectedIrpDates] = useState<string[]>(
      transaction.irps.map((item) => item.dateShouldBePaid),
    );
    const initialSelectedDates = useMemo(() => {
      return selectedCustomer.id === transaction.customer.id
        ? transaction.irps.map((item) => item.dateShouldBePaid)
        : [];
    }, [selectedCustomer.id, transaction]);

    const formikRef = useRef<FormikProps<FormValues>>(null);

    const handleSelectedDatesChange = useCallback(
      (dates: string[]) => {
        setSelectedIrpDates(dates);
        setHasSomethingChanged(!areArraysEqual(initialSelectedDates, dates));
      },
      [hasSomethingChanged, initialSelectedDates],
    );

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        formikRef.current?.handleSubmit();
      },
    }));

    const handleToggleIsDisabled = useCallback((value: boolean) => {
      setIsDisabled(value);
    }, []);

    useEffect(() => {
      toggleIsDisabled(
        !(
          !isDisabled &&
          hasSomethingChanged &&
          formikRef.current?.values.numberOfPayments === selectedIrpDates.length
        ),
      );
    }, [
      hasSomethingChanged,
      isDisabled,
      formikRef.current?.values.numberOfPayments,
      selectedIrpDates,
    ]);

    return (
      <Formik
        innerRef={formikRef}
        initialValues={{
          customerId: selectedCustomer.id,
          currency,
          amount: transaction.amount,
          numberOfPayments: transaction.numberOfPayments,
        }}
        validationSchema={validationSchema}
        onSubmit={async ({ amount, currency, customerId, numberOfPayments }) => {
          setIsLoading(true);
          const res = await updateTransaction(transaction.id, {
            amount: +amount,
            customerId,
            numberOfPayments,
            currency,
            datesShouldBePaid: selectedIrpDates,
          });
          if (res.data) {
            callback();
          } else {
            setRequestErr('Error occurred');
          }
          setIsLoading(false);
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <>
            {isLoading && (
              <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
                <Loader />
              </div>
            )}
            <FormStateWatcher setIsDisabled={handleToggleIsDisabled} />
            <Form
              onChange={() => {
                setRequestErr('');
                setHasSomethingChanged(true);
              }}
            >
              <Dropdown
                selectedItem={{ id: selectedCustomer.id, label: selectedCustomer.name }}
                title="Select customer"
                items={customers.map((item) => ({ id: item.id, label: item.name }))}
                onSelect={(item) => {
                  const newCustomer = customers.find((c) => c.id === item.id) as ICustomer;
                  setSelectedCustomer(newCustomer);
                  setFieldValue('customerId', item.id);
                  if (item.id !== transaction.customer.id) {
                    setSelectedIrpDates([]);
                  } else {
                    setSelectedIrpDates(transaction.irps.map((item) => item.dateShouldBePaid));
                  }
                }}
              />
              <div className="mb-6" />
              <NumberInput
                name="amount"
                placeholder="2000"
                title="Amount paid per transaction"
                isError={Boolean(errors.amount || requestErr)}
                isTouched={Boolean(touched.amount)}
                errorText={errors.amount}
              />
              <NumberInput
                name="numberOfPayments"
                placeholder="2"
                title="Number of payments per transaction"
                isError={Boolean(errors.numberOfPayments || requestErr)}
                isTouched={Boolean(touched.numberOfPayments)}
                errorText={errors.numberOfPayments}
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
              <IRPDatesPreview
                numberOfPayments={values.numberOfPayments}
                onDatesChange={handleSelectedDatesChange}
                customer={selectedCustomer}
                initialSelectedDates={initialSelectedDates}
              />
              {requestErr && <p className="text-sm font-bold text-red-400">{requestErr}</p>}
            </Form>
          </>
        )}
      </Formik>
    );
  },
);

EditForm.displayName = 'EditForm';

export default EditForm;
