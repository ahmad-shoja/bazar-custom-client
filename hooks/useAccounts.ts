import { useState } from "react";

import { addAccount as addAccountBase, getAccounts, removeAccounts, removeAccounts as removeAccountsBase, saveAccounts } from "@/services/storage/accounts";
import { useEffect } from "react";
import { Account } from "@/services/storage/types";
import { getAccessToken } from "@/api/auth";

export const useAccounts = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        getAccounts().then(setAccounts);
    }, []);

    const addAccount = (account: Account) => {
        addAccountBase(account);
        setAccounts([...accounts, account]);
    }

    const removeAccounts = (accountIds: string[]) => {
        removeAccountsBase(accountIds);
        setAccounts(accounts.filter(account => !accountIds.includes(account.id)));
    }

    const refreshTokens = async (): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                const refreshedAccounts: Account[] = []
                for (const account of await getAccounts()) {
                    try {
                        const { token } = await getAccessToken(account.refreshToken)
                        refreshedAccounts.push({ ...account, token })
                    } catch (error) {
                        console.error('Error refreshing token:', error);
                        throw error;
                    }
                }
                console.log(refreshedAccounts);

                saveAccounts(refreshedAccounts);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    return { accounts, addAccount, removeAccounts, refreshTokens };

}