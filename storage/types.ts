export type Account = {
    id: string;
    phone: string;
    token: string;
};

export type App = { name: string; id: string }

export type Code = { id: string; code: string; appId: string; type: 'enemy' | 'mine' }


