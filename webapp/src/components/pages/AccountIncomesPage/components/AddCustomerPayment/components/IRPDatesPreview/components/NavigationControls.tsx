import cx from 'classnames';

interface IProps {
  disablePrevious: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const NavigationControls = ({ disablePrevious, onPrevious, onNext }: IProps) => {
  return (
    <div className="mb-3 flex justify-between">
      <button
        type="button"
        className={cx(
          'text-sm text-blue-600 hover:underline',
          disablePrevious && 'cursor-not-allowed opacity-50 hover:no-underline',
        )}
        onClick={() => !disablePrevious && onPrevious()}
        disabled={disablePrevious}
      >
        ← Previous
      </button>
      <button type="button" className="text-sm text-blue-600 hover:underline" onClick={onNext}>
        Next →
      </button>
    </div>
  );
};

export default NavigationControls;
