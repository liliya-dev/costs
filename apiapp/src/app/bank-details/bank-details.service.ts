import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { CustomerEntity } from '../customers/customer.entity';

import { BankDetailsEntity } from './bank-details.entity';
import { BankDetailsRepository } from './bank-details.repository';

const data = [
  {
    id: 1,
    name: 'ТОВ "ДИСТРИБУЦІЙНА КОМПАНІЯ "ОПТИМА"',
    edrpou: '45055589',
    ipn: null,
    vat_certificate: null,
    tax_system: null,
    iban: 'UA043253650000000260080051472',
    bank_name: 'АТ "КредоБанк"',
    mfo: null,
    address: '79041, м. Львів, вул. Городоцька, 207, офіс 506',
    phone: '+380987441792',
    email: 'dk.optima.llc@gmail.com',
    created_at: null,
    updated_at: null,
    contract_number: '1/25-О',
    contract_date: '2025-03-14',
    contract_description:
      'Договір надання консультаційних послуг з питань інформатизації',
  },
  {
    id: 2,
    name: 'ТОВ "Конструкторське бюро ФОРДЖ"',
    edrpou: '45488920',
    ipn: null,
    vat_certificate: null,
    tax_system: null,
    iban: 'UA443005280000026002000041263',
    bank_name: 'АТ "ОТП Банк"',
    mfo: null,
    address:
      '08132, Київська обл., Бучанський р-н, с. Софіївська Борщагівка, вул. Соборна, буд. 103/10, нежитлове приміщення 316',
    phone: '+380951824494',
    email: 'kb.forge.ua@gmail.com',
    created_at: null,
    updated_at: null,
    contract_number: '1-25-Ф',
    contract_date: '2025-03-14',
    contract_description:
      'Договір надання консультаційних послуг з питань інформатизації',
  },
  {
    id: 3,
    name: 'ТОВ "ВКФ "Теплобуд"',
    edrpou: '34959708',
    ipn: null,
    vat_certificate: null,
    tax_system: null,
    iban: 'UA823204780000000026007170525',
    bank_name: 'АБ "УкрГазБанк"',
    mfo: null,
    address: '01015, м. Київ, вул. Лейпцизька, буд. 3А',
    phone: '(044) 351-14-10',
    email: null,
    created_at: null,
    updated_at: null,
    contract_number: '1-25-Т',
    contract_date: '2025-03-10',
    contract_description:
      'Договір надання консультаційних послуг з питань інформатизації',
  },
  {
    id: 4,
    name: 'ТОВ "Коін"',
    edrpou: null,
    ipn: null,
    vat_certificate: null,
    tax_system: null,
    iban: 'UA...YOUR_IBAN...',
    bank_name: '...',
    mfo: null,
    address: '...',
    phone: '...',
    email: '...',
    created_at: null,
    updated_at: null,
    contract_number: '1/25-KO',
    contract_date: '2025-03-14',
    contract_description:
      'Договір надання консультаційних послуг з питань інформатизації',
  },
];

@Injectable()
export class BankDetailsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly bankDetailsRepository: BankDetailsRepository,
  ) {}

  async create(
    bankDetailsDto: Partial<BankDetailsEntity>,
  ): Promise<BankDetailsEntity> {
    const bankDetails = this.bankDetailsRepository.create(bankDetailsDto);
    return this.bankDetailsRepository.save(bankDetails);
  }

  async update(
    bankDetails: BankDetailsEntity,
    updateDto: Partial<BankDetailsEntity>,
  ): Promise<BankDetailsEntity> {
    Object.assign(bankDetails, updateDto);
    return this.bankDetailsRepository.save(bankDetails);
  }

  async seed(): Promise<void> {
    const bankRepo = this.dataSource.getRepository(BankDetailsEntity);
    const customerRepo = this.dataSource.getRepository(CustomerEntity);

    for (const item of data) {
      const customer = await customerRepo.findOne({ where: { id: item.id } });
      if (!customer) continue;

      const bankDetails = bankRepo.create({
        edrpou: item.edrpou,
        ipn: item.ipn,
        vat_certificate: item.vat_certificate,
        tax_system: item.tax_system,
        iban: item.iban,
        bank_name: item.bank_name,
        mfo: item.mfo,
        address: item.address,
        phone: item.phone,
        email: item.email,
        contract_number: item.contract_number,
        contract_date: item.contract_date ? new Date(item.contract_date) : null,
        contract_description: item.contract_description,
        invoice_description: 'Послуги',
        customer,
      });

      await bankRepo.save(bankDetails);
      console.log(`Saved bank details for ${customer.name}`);
    }
  }
}
