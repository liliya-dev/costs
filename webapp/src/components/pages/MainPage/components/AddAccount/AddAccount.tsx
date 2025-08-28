import { Formik, FormikProps, Form } from 'formik';
import React, { useRef, useState } from 'react';
import * as Yup from 'yup';

import FormStateWatcher from '@/components/atoms/form-elements/FormStateWatcher/FormStateWatcher';
import TextInput from '@/components/atoms/form-elements/TextInput/TextInput';
import Loader from '@/components/atoms/Loader/Loader';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { createAccount } from '@/utils/api';

interface IProps {
  handleToggleAddForm: () => void;
  callback: () => void;
}
interface FormValues {
  name: string;
}

const AddAccount = ({ handleToggleAddForm, callback }: IProps) => {
  const [requestErr, setRequestErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const formikRef = useRef<FormikProps<FormValues> | null>(null);
  const initialValues: FormValues = { name: '' };

  const validationSchema = Yup.object({
    name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  });

  const handleAddAccount = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  return (
    <FullScreenModal
      onClose={handleToggleAddForm}
      title="Add new account"
      primaryButtonText="Add"
      secondaryButtonText="Cancel"
      onSecondaryButtonClick={handleToggleAddForm}
      onPrimaryButtonClick={handleAddAccount}
      isPrimaryButtonDisabled={isDisabled}
    >
      {isLoading && (
        <div className="bg-white-100 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-20">
          <Loader />
        </div>
      )}
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          setIsLoading(true);
          const res = await createAccount(values);
          if (res.data) {
            callback();
            handleToggleAddForm();
          } else if (res.message) {
            setRequestErr(res.message);
          }
          setIsLoading(false);
        }}
      >
        {({ errors, touched }) => {
          return (
            <>
              <FormStateWatcher setIsDisabled={setIsDisabled} />
              <Form onChange={() => setRequestErr('')}>
                <TextInput
                  isError={Boolean(errors.name || requestErr)}
                  isTouched={Boolean(touched.name)}
                  placeholder="type the name of new account"
                  title="Account name"
                  name="name"
                />
              </Form>
            </>
          );
        }}
      </Formik>
      {requestErr !== '' && <p className="text-sm font-bold text-red-400">{requestErr}</p>}
    </FullScreenModal>
  );
};

export default AddAccount;
