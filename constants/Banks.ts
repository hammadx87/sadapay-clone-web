export const BANKS = [
  { id: 'easypaisa', name: 'Easypaisa', logo: require('../assets/images/easypaisa.png') },
  { id: 'nayapay', name: 'NayaPay', logo: require('../assets/images/nayapay.png') },
  { id: 'jazzcash', name: 'JazzCash', logo: require('../assets/images/jazzcash.png') },
  { id: 'meezan', name: 'Meezan Bank', logo: require('../assets/images/meezan-bank.png') },
  { id: 'hbl', name: 'HBL Bank', logo: require('../assets/images/hbl-bank.png') },
  { id: 'askari', name: 'Askari Bank', logo: require('../assets/images/askari-bank.png') },
  { id: 'sadapay', name: 'SadaPay', logo: require('../assets/images/sadapay-logo.jpg') },
];

export type Bank = typeof BANKS[0];

export const getBankById = (id: string) => BANKS.find(bank => bank.id === id) || BANKS[0];
