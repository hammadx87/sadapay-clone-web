
import { STATIC_SENDER } from '../constants/User';

export interface TransactionHistoryItem {
  id: string;
  name: string; // This will be the Receiver's Name for sent transactions
  time: string;
  amount: string;
  type: 'sent' | 'received';
  date?: string;
  bankName?: string; // Receiver's Bank Name
  bankId?: string; // Receiver's Bank ID
  accountInfo?: string; // Receiver's Account/Phone
  referenceNumber?: string;
  senderName: string; // Always Muhammad Hammad for sent
  senderBank: string; // Always SadaPay for sent
}

interface TransactionDetails {
  amount: number;
  senderWalletId: string;
  recipientAccount: string;
  recipientBank: string;
  bankId?: string;
  purpose: string;
  note: string;
  referenceNumber?: string;
}

class TransactionService {
  private static instance: TransactionService;
  private balance: number = 25000;
  private transactions: TransactionHistoryItem[] = [
    {
      id: '1',
      name: 'MUHAMMAD HAMMAD',
      time: '10:30 AM',
      amount: 'Rs. 5,000',
      type: 'received',
      date: '10 February 2026',
      bankName: 'SadaPay',
      bankId: 'sadapay',
      accountInfo: '3187606497',
      senderName: 'External',
      senderBank: 'Bank'
    },
    {
      id: '2',
      name: 'ALI KHAN',
      time: '02:15 PM',
      amount: 'Rs. 1,200',
      type: 'sent',
      date: '09 February 2026',
      bankName: 'Meezan Bank',
      bankId: 'meezan',
      accountInfo: 'PK20MEZN0098830110909230',
      senderName: STATIC_SENDER.name,
      senderBank: STATIC_SENDER.bankName
    }
  ];
  private listeners: (() => void)[] = [];

  private constructor() {}

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  public getBalance(): number {
    return this.balance;
  }

  public async checkBalance(amount: number): Promise<{ isValid: boolean; currentBalance: number; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (amount > this.balance) {
      return { 
        isValid: false, 
        currentBalance: this.balance,
        error: `Insufficient balance. Your current balance is Rs. ${this.balance.toLocaleString()}`
      };
    }
    
    return { 
      isValid: true, 
      currentBalance: this.balance 
    };
  }

  public getTransactionHistory(): TransactionHistoryItem[] {
    return [...this.transactions].sort((a, b) => {
      return parseInt(b.id) - parseInt(a.id) || 0;
    });
  }

  public addListener(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  private generateReferenceNumber(): string {
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    return `Raast-${randomDigits}`;
  }

  public async processTransaction(details: TransactionDetails & { recipientName?: string }): Promise<{ success: boolean; referenceNumber?: string; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!details.amount || details.amount <= 0) {
        return { success: false, error: 'Invalid transaction amount' };
      }

      if (details.amount > this.balance) {
        return { success: false, error: 'Insufficient balance' };
      }

      this.balance -= details.amount;
      
      const referenceNumber = details.referenceNumber && !details.referenceNumber.includes('NaN') 
        ? details.referenceNumber 
        : this.generateReferenceNumber();

      const newTransaction: TransactionHistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: details.recipientName || 'Unknown Recipient',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amount: `Rs. ${details.amount.toLocaleString()}`,
        type: 'sent',
        date: 'Today',
        bankName: details.recipientBank,
        bankId: details.bankId,
        accountInfo: details.recipientAccount,
        referenceNumber,
        senderName: STATIC_SENDER.name,
        senderBank: STATIC_SENDER.bankName
      };

      this.transactions.unshift(newTransaction);
      this.notifyListeners();

      return { 
        success: true, 
        referenceNumber 
      };
    } catch (error) {
      console.error('Transaction processing error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while processing your transaction.'
      };
    }
  }

  public async handleTransactionError(error: string) {
    console.error('Transaction Error:', error);
  }
}

export default TransactionService;
