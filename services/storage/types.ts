export type Account = {
    id: string;
    phone: string;
    token: string;
};

export type App = { name: string; id: string }

export type CodeType = "friendly" | "enemy"

export type Code = { id: string; code: string; appId: string; type: CodeType }


