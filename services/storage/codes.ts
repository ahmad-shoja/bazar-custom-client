import { CODES_STORAGE_KEY } from '@/constants/storage';
import { getUserPreferences, saveUserPreferences } from './index';
import { Code } from './types';


export const getCodes = async (): Promise<Code[]> => {
    const codes = await getUserPreferences(CODES_STORAGE_KEY);
    return codes || [];
};

export const saveCodes = async (codes: Code[]): Promise<void> => {
    await saveUserPreferences(CODES_STORAGE_KEY, codes);
};

export const addCode = async ({ code, appId, type }: Omit<Code, 'id'>): Promise<Code> => {
    try {
        const codes = await getCodes();
        const newCode = { id: generateId(appId, code), code, appId, type };
        codes.push(newCode);
        await saveCodes(codes);
        return newCode;
    } catch (error) {
        console.error('Error adding code:', error);
        throw error;
    }
};

export const removeCodes = async (codeIds: string[]): Promise<void> => {
    try {
        const codes = await getCodes();
        const filteredCodes = codes.filter(code => !codeIds.includes(code.id));
        await saveCodes(filteredCodes);
    } catch (error) {
        console.error('Error removing codes:', error);
        throw error;
    }
};

const generateId = (appId: string, code: string) => `${appId}/${code}`;