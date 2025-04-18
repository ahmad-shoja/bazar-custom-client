import { useState } from "react";

import { addAccount as addAccountBase, getAccounts, removeAccounts as removeAccountsBase } from "@/storage/accounts";
import { useEffect } from "react";
import { Account } from "@/storage/types";

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

    return { accounts, addAccount, removeAccounts };

}