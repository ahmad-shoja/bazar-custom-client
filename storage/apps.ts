import { ACCOUNTS_STORAGE_KEY, APPS_STORAGE_KEY } from '@/constants/storage';
import { getUserPreferences, saveUserPreferences } from './index';
import { App } from './types';


export const getApps = async (): Promise<App[]> => {
    const apps = await getUserPreferences(APPS_STORAGE_KEY);
    return apps || [];
};

export const saveApps = async (apps: App[]): Promise<void> => {
    await saveUserPreferences(APPS_STORAGE_KEY, apps);
};

export const addApp = async (app: App): Promise<void> => {
    try {
        const apps = await getApps();
        apps.push(app);
        await saveApps(apps);
    } catch (error) {
        console.error('Error adding app:', error);
        throw error;
    }
};

export const removeApps = async (appIds: string[]): Promise<void> => {
    try {
        const apps = await getApps();
        const filteredApps = apps.filter(app => !appIds.includes(app.id));
        await saveApps(filteredApps);
    } catch (error) {
        console.error('Error removing apps:', error);
        throw error;
    }
};

