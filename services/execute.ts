import { LogLine } from "@/types";
import { getAccounts, updateAccount } from "./storage/accounts"
import { getAccessToken } from "@/api/auth";
import { Account } from "./storage/types";
export const executeWithTokensSync = async (action: (token: string) => Promise<void>,
    logOutput?: (log: LogLine) => void, pAccounts?: Account[]):
    Promise<void> => new Promise<void>(async (resolve, reject) => {
        let accounts = pAccounts ?? await getAccounts()
        for (const { token, phone, ...rest } of accounts) {
            logOutput?.({ text: `Executing with account: ${phone}` });
            await action(token).then(() => {
                logOutput?.({ text: `Successfully executed review ${phone}`, color: "green" })
            }).catch((e) => {
                if (e == 401) {
                    logOutput?.({ text: `Account ${phone} is Deactivated Activating ...` });
                    getAccessToken(rest.refreshToken).then(({ token: newToken }) => {
                        updateAccount({ ...rest, token: newToken, phone }).then(async () => {
                            logOutput?.({ text: `Account ${phone} Successfully Activated...`, color: 'green' });
                            accounts = await getAccounts()
                        });
                        action(newToken).then(resolve).catch(reject).then(() => {
                            logOutput?.({ text: `Successfully executed review ${phone}`, color: "green" })
                        }).catch(e => {
                            logOutput?.({ text: `Failed to execute review ${phone}: ${e}`, color: "red" })
                        })
                    })
                }
            });
        }
    })
