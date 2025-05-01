import { useState } from "react";

import { addApp as addAppBase, getApp, getApps, removeApps as removeAppsBase } from "@/services/storage/apps";
import { useEffect } from "react";
import { App } from "@/services/storage/types";

export const useApps = () => {
    const [apps, setApps] = useState<App[]>([]);

    const refresh = () => {
        getApps().then(setApps);
    };

    useEffect(() => {
        refresh();
    }, []);

    const addApp = (app: App) => {
        addAppBase(app);
        setApps([...apps, app]);
    }

    const removeApps = (appIds: string[]) => {
        removeAppsBase(appIds);
        setApps(apps.filter(app => !appIds.includes(app.id)));
    }

    return { apps, addApp, removeApps, refresh };
}

export const useApp = (appId: string) => {
    const [app, setApp] = useState<App | undefined>(undefined);
    useEffect(() => {
        getApp(appId).then(setApp)
    }, [appId])

    return { app }
} 