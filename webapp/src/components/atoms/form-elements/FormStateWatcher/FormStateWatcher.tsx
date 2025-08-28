import { useFormikContext } from 'formik';
import { useEffect } from 'react';

interface Props {
  setIsDisabled: (v: boolean) => void;
}

const FormStateWatcher = ({ setIsDisabled }: Props) => {
  const { isValid, dirty } = useFormikContext();
  useEffect(() => {
    setIsDisabled(!isValid);
  }, [isValid, dirty]);

  return null;
};

export default FormStateWatcher;
