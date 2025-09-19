'use client';

import { currencySymbols } from '@/constants';
import { IFOPCustomer } from '@/types';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface FopCustomerDetailsProps {
  customer: IFOPCustomer;
}

const renderField = (label: string, value: string | number | null | undefined) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex justify-between border-b py-1">
      <span className="font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );
};

const FopCustomerDetails = ({ customer }: FopCustomerDetailsProps) => (
  <div className="mb-24 mt-12 grid grid-cols-1 gap-x-15 gap-y-3 md:grid-cols-2">
    {renderField(
      'Monthly Payment',
      `${customer.monthlyPayment} ${currencySymbols[customer.currency]}`,
    )}
    {renderField('Approx. Payment Day', customer.approximatelyPaymentDay)}

    {customer.bankDetails && (
      <>
        {renderField('Bank Name', customer.bankDetails.bank_name)}
        {renderField('IBAN', customer.bankDetails.iban)}
        {renderField('EDRPOU', customer.bankDetails.edrpou)}
        {renderField('IPN', customer.bankDetails.ipn)}
        {renderField('VAT Certificate', customer.bankDetails.vat_certificate)}
        {renderField('Tax System', customer.bankDetails.tax_system)}
        {renderField('MFO', customer.bankDetails.mfo)}
        {renderField('Address', customer.bankDetails.address)}
        {renderField('Phone', customer.bankDetails.phone)}
        {renderField('Email', customer.bankDetails.email)}
        {renderField(
          'Contract Date',
          customer.bankDetails.contract_date ? formatDate(customer.bankDetails.contract_date) : '',
        )}
        {renderField(
          'Contract',
          `${customer.bankDetails.contract_description || ''} ${customer.bankDetails.contract_number || ''}`,
        )}
        {renderField('Invoice Description', customer.bankDetails.invoice_description)}
        {renderField('Director', customer.bankDetails.director)}
      </>
    )}
  </div>
);

export default FopCustomerDetails;
