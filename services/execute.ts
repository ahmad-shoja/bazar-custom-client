import { getAccounts } from "./storage/accounts"
export const executeWithTokensSync = async (action: (token: string) => Promise<void>):
    Promise<void> => getAccounts().then(async (accounts) => {
        for (const { token } of accounts) {
            await action(token);
        }
    })

export const executeWithTokensAsync = async (action: (token: string) => Promise<void>):
    Promise<void> => getAccounts().then(async (accounts) => {
        await Promise.all(accounts.map(({ token }) => action(token)));
    }) 
