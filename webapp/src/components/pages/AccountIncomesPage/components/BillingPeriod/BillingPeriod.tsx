import IconButton from '@/components/atoms/IconButton/IconButton';
import Text from '@/components/atoms/Text/Text';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  start: string;
  end: string;
  changeSkip: (n: number) => void;
}

const BillingPeriod = ({ start, end, changeSkip }: IProps) => {
  const handleBack = () => changeSkip(-1);
  const handleForward = () => changeSkip(1);
  return (
    <div className="flex items-center justify-center">
      <IconButton icon="ArrowLeft" onClick={handleBack} />
      <div className="mx-8 flex w-80 items-center justify-between">
        <div className="mr-2">
          <p>{formatDate(start)}</p>
        </div>
        <Text text={'-'} size="L" color="LIGHT" />
        <div className="ml-2">
          <p>{formatDate(end)}</p>
        </div>
      </div>
      <IconButton icon="ArrowRight" onClick={handleForward} />
    </div>
  );
};

export default BillingPeriod;
