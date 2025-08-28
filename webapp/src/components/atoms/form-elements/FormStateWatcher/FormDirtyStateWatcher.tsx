import { useFormikContext } from 'formik';
import { useEffect } from 'react';

interface Props {
  setIsDirty: (v: boolean) => void;
}

const FormDirtyStateWatcher = ({ setIsDirty }: Props) => {
  const { dirty } = useFormikContext();

  useEffect(() => {
    setIsDirty(dirty);
  }, [dirty]);

  return null;
};

export default FormDirtyStateWatcher;
