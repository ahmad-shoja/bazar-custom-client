import { ACCOUNTS_STORAGE_KEY } from '@/constants/storage';
import { getUserPreferences, saveUserPreferences } from './index';
import { Account } from './types';


export const getAccounts = async (): Promise<Account[]> => {
    const accounts = await getUserPreferences(ACCOUNTS_STORAGE_KEY);
    return accounts || [];
};

export const saveAccounts = async (accounts: Account[]): Promise<void> => {
    await saveUserPreferences(ACCOUNTS_STORAGE_KEY, accounts);
};

export const addAccount = async (account: Account): Promise<void> => {
    try {
        const accounts = await getAccounts();
        accounts.push(account);
        await saveAccounts(accounts);
    } catch (error) {
        console.error('Error adding account:', error);
        throw error;
    }
};

export const removeAccounts = async (accountIds: string[]): Promise<void> => {
    try {
        const accounts = await getAccounts();
        const filteredAccounts = accounts.filter(account => !accountIds.includes(account.id));
        await saveAccounts(filteredAccounts);
    } catch (error) {
        console.error('Error removing accounts:', error);
        throw error;
    }
};

