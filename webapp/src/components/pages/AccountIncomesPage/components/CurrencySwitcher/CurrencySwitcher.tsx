import { currencySymbols } from '@/constants';
import { Currency } from '@/types';

interface IProps {
  handleCurrencyChange: (currency: Currency) => void;
  selectedCurrency: Currency;
}

const CurrencySwitcher = ({ handleCurrencyChange, selectedCurrency }: IProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleCurrencyChange(event.target.value as Currency);
  };

  return (
    <div className="flex items-center py-4">
      <h4 className="mr-4 text-nowrap text-lg">Select Currency:</h4>
      <div className="flex space-x-4">
        {Object.values(Currency).map((currency) => (
          <label
            key={currency}
            className={`flex w-[100px] cursor-pointer items-center rounded border bg-white px-2 py-1 ${selectedCurrency === currency ? 'border-gray-400 bg-gray-200' : 'border-gray-300'} transition-colors duration-300 hover:border-gray-400 hover:bg-gray-100`}
          >
            <input
              type="radio"
              value={currency}
              checked={selectedCurrency === currency}
              onChange={handleChange}
              className="hidden"
            />
            <span
              className={`relative flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-300 ${selectedCurrency === currency ? 'border-gray-400' : 'border-gray-300'}`}
            >
              {selectedCurrency === currency && (
                <span className="absolute h-2 w-2 rounded-full bg-[#3b3b3b]" /> // Set the dot color to #d3d3d3
              )}
            </span>
            <span className="ml-2 text-sm">
              {currency} {currencySymbols[currency]}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CurrencySwitcher;
