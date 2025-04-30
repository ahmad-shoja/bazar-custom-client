import { LogLine } from "@/types";
import { getAccounts } from "./storage/accounts"
export const executeWithTokensSync = async (action: (token: string) => Promise<void>, logOutput?: (log: LogLine) => void):
    Promise<void> => getAccounts().then(async (accounts) => {
        for (const { token, phone } of accounts) {
            logOutput?.({ text: `Executing with account: ${phone}` });
            await action(token);
        }
    })

export const executeWithTokensAsync = async (action: (token: string) => Promise<void>, logOutput?: (log: LogLine) => void):
    Promise<void> => getAccounts().then(async (accounts) => {
        await Promise.all(accounts.map(({ token, phone }) => {
            logOutput?.({ text: `Executing with account: ${phone}` });
            action(token)
        }));
    }) 
